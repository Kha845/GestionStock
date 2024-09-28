
import { makeObservable, observable, action, toJS } from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

export default class OrderStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/orders';
    cartItems: any[] = []
    rootStore: IRootStore;
    rowData: GridRowsProp[] = [];
    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'order_number', headerName: 'Numéro commande', width: 150 },
        { field: 'customer_name', headerName: 'Nom client', width: 150 },
        { field: 'quantity', headerName: 'Quantite', width: 150, },
        { field: 'price', headerName: 'Prix', width: 250, },
        {
            field: 'actions',
            headerName: 'action',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <ListItemButton sx={{ width: 'auto' }} component={Link} to={`view/${params.row.id}`}>
                        <LocalPrintshopIcon />
                    </ListItemButton>
                </Box>
            )
        },

    ];

    constructor(rootStore: IRootStore) {
        makeObservable(this, {
            rowData: observable,
            columns: observable,
            orderLists: action,
            setRowData: action,
            createData: action,
            getData: action,
            cartItems: observable,
            setCartItems: action,
            addToCart: action,
            removeFromCart: action
        });
        this.rootStore = rootStore
    }
    setCartItems = (items: any[]) => {
        this.cartItems;
    }
    addToCart = async (value: any): Promise<boolean> => {
        this.cartItems.push(value);
        return Promise.resolve(true)
    }
    removeFromCart = async (index: any) => {
        this.cartItems.splice(index, 1);
    }
    calculateFinalPrice =
        async (original: number, discount: number, quantity: number) => {
            const finalPrice = original - (original * discount / 100);
            return finalPrice * quantity;
        }

    orderLists = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }

            const response = await axios.get(this.BASE_URL + '/list', {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log(data);
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));
            } else {

                this.setRowData(data.data.orders);

                return Promise.resolve(data.message);
            }

        } catch (error: any) {
            console.error("Erreur de création:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }
    createData = async (customerData: any) => {
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;        
    
        try {
            // Préparation des données pour les produits
            const postDataProducts = [...this.cartItems].map((e: any) => {
                return {
                    product_id: e.product.id,
                    quantity: e.quantity,
                    discount: e.discount,
                };
            });
            
            console.log("Created Data", postDataProducts);
    
            const formData = new FormData();
            
            // Ajout du customer_id
            formData.append("customer_id", customerData.customer?.id);
            
            // Ajout des produits dans formData
            postDataProducts.forEach((item: any, i: number) => {
                Object.keys(item).forEach((key: any) => {
                    formData.append(`products[${i}][${key}]`, item[key]);
                });
            });
    
            // Envoi de la requête POST avec formData
            const response = await axios.post(this.BASE_URL, formData, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'X-CSRF-TOKEN': csrfToken, // CSRF token
                    // On ne précise pas Content-Type pour FormData, il sera défini automatiquement
                },
            });
    
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);
    
            // Gestion des erreurs retournées par l'API
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            } else {
                this.rootStore.alertStore.open({ status: 'success', message: data.message });
                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            // Gestion des erreurs
            this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
        }
    }
    //view

    getData = async (id: number | string) => {
        try {

            const response = await axios.get(`${this.BASE_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("HTTP Status:", response.status);

            const data = response.data;
            console.log(data)
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(new Error(data.message));

            } else {
                const orderItems = data.data.order?.items.map((item: any) => {
                    return {
                        product: {
                            label: item.product_name
                        },
                        quantity: item.product_quantity,
                        price: item.product_price,
                        discount: item.product_discount,
                        total: this.calculateFinalPrice(item.product_price, item.product_discount, item.product_quantity)
                    }
                })
                this.setCartItems(orderItems);
                return Promise.resolve(data);
            }

        } catch (error: any) {
            this.rootStore.handleError(419, 'something went wrong', error)
        }
    }
    setRowData(values: GridRowsProp[]) {
        this.rowData = values;
    }

}