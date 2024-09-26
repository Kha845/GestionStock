import {makeObservable, observable,action} from 'mobx';
import { IRootStore } from './rootStore';
import axios from 'axios';
import {GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, ListItemButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Link, Navigate, useNavigate } from 'react-router-dom';
import Products from '../pages/private/products';

export default class ProductStore {
    BASE_URL = import.meta.env.VITE_API_URL + '/v1/products';
    rootStore: IRootStore;
    rowData: GridRowsProp[] = [];
    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50},
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'category_id', headerName: 'Categorie', width: 150 },
        { field: 'stock', headerName: 'Stock', width: 150, },
        { field: 'price', headerName: 'Price', width: 250, },
        { field: 'image', headerName: 'Image', width: 100, },
        { 
            field: 'actions', 
            headerName: 'action', 
            width: 150, 
            sortable: false, 
            filterable: false,
            renderCell: (params) => (
              <Box display="flex" justifyContent="center" alignItems="center">
                <ListItemButton sx={{ width: 'auto' }} component={Link} to = {`edit/${params.row.id}`}>
                  <EditIcon color='primary'/>
                </ListItemButton>
                <ListItemButton onClick={ ()=>this.deleteDialog(params)}>
                  <DeleteIcon  className='text-red-600'/>
                </ListItemButton>
              </Box>
            )
          },
        
    ];

    constructor(rootStore: IRootStore){
        makeObservable(this, {
           rowData: observable,
           columns: observable,
           productLists: action,
           setRowData: action,
           createData: action,
           getData: action,
           updateData: action,
           initForm: action
        });
        this.rootStore = rootStore
    }
    
    productLists = async () => {
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

                this.setRowData(data.data.products);

                return Promise.resolve(data.message);
            }
    
        } catch (error: any) {
            console.error("Erreur de création:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }

    initForm = async () => {
        try {
            if (!this.rootStore.authStore.token) {
                this.rootStore.handleError(401, "Token manquant", {});
                return Promise.reject("Token manquant");
            }
    
            const response = await axios.get(this.BASE_URL + '/init-form', {
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
                return Promise.reject(new Error(data));
            } else {

                return Promise.resolve(data);
            }
    
        } catch (error: any) {
            console.error("Erreur de création:", error);
            this.rootStore.handleError(error.response?.status || 500, error.message || "An error occurred", error);
        }
    }


    createData = async (postData: any) => {

        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;        
    
        try {
            const response = await axios.post(this.BASE_URL, postData, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);
            
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            }else{
                this.rootStore.alertStore.open(
                    {status: 'success', 
                     message: data.message
                     } )
                     return Promise.resolve(data);
            }
    
        } catch (error: any) {
            // Vérifie si l'erreur provient d'Axios et possède une réponse HTTP
            if (error.response) {
                console.error("Erreur Axios Response:", error.response.data);
                // Gérer les erreurs spécifiques retournées par le serveur
                const serverMessage = error.response.data.message || 'Une erreur est survenue lors de la requête.';
                this.rootStore.handleError(error.response.status, serverMessage, error.response.data);
                return Promise.reject(serverMessage);
            } else if (error.request) {
                // Lorsque la requête est envoyée mais qu'aucune réponse n'est reçue
                console.error("Erreur Axios Request:", error.request);
                this.rootStore.handleError(500, "Aucune réponse du serveur", error.request);
                return Promise.reject('Aucune réponse du serveur.');
            } else {
                // Erreur lors de la configuration de la requête
                console.error("Erreur Axios:", error.message);
                this.rootStore.handleError(500, error.message, error);
                return Promise.reject(error.message);
            }
        }
    }
    

//view

getData = async (id: number | string ) =>{
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
            return Promise.resolve(data);
        }

    } catch (error: any) {
        this.rootStore.handleError(419,'something went wrong',error)
    }
}

updateData = async (id: number | string, postData: any) => {
    try {
        const response = await axios.put(`${this.BASE_URL}/${id}`, postData, {
            headers: {
                'Authorization': `Bearer ${this.rootStore.authStore.token}`,
            },
        });

        console.log("HTTP Status:", response.status);
        const data = response.data;
        console.log("Response Data:", data);
        if (data.error) {
            this.rootStore.handleError(response.status, data.message, data);
            return Promise.reject(data);
        }else{
            this.rootStore.alertStore.open( {status: 'success',   message: data.message } )
            return Promise.resolve(data);
        }
    } catch (error: any) {
        console.error("Erreur :", error);
        // Gère les erreurs et renvoie un message d'erreur
        this.rootStore.handleError(419, 'Quelque chose a mal tourné', error);
        return { success: false, message: 'Une erreur est survenue lors de la mise à jour.' };
    }
}

    setRowData(values: GridRowsProp[]){
        this.rowData = values;
    }

    deleteData = async (id: number | string)=>{
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;
        try {
            const response = await axios.delete(`${this.BASE_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
            });
            
            console.log("HTTP Status:", response.status);
            const data = response.data;
            console.log("Response Data:", data);
            
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data);
            }else{
                this.setRowData(this.rowData.filter(
                    (e:any)=> e.id != e.id))
                this.rootStore.alertStore.open( {status: 'success',  message: data.message } )
                     this.productLists();
                return Promise.resolve(data);
            }
        } catch (error: any) {
            this.rootStore.handleError(419,"something went wrong",error)
        }
    }
    //delete
    deleteDialog = async (params: any) =>{

        this.rootStore.dialogStore.openDialog( 
            {
            confirm: () => this.deleteData(params.row.id),
            dialogText: "Are you sure you want to delete this item"
            }
        )
    }
}