import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useStore } from '../../../store/rootStore';
import ServerSideAutocomplete from '../../../components/side/ServerSideAutocomplet/ServerSideAutocomplete';
import { useNavigate } from 'react-router-dom';


// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    product: Yup.object().shape({
        id: Yup.string().required('Le client est requis'),
        label: Yup.string().required('Le client est requis'),
    }).required('Le client est requis'),
    price: Yup.number(),
    quantity: Yup.number().required('Quantity is reuquired').min(1, 'Minimum quantity is 1'),
    discount: Yup.number().required('Discount is required').min(0, 'Minimum discount is 0').max(100, 'Max discount'),
    total: Yup.number(),
});

const AddNewItemForm: React.FC<any> = () => {
    const { rootStore: { orderStore, productStore } } = useStore();
    const navigate = useNavigate();
    const { handleSubmit, control, formState: { errors }, reset, getValues, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            product: { id: "", label: "" },
            price: 0,
            quantity: 1,
            discount: 0,
            total: 0,
        },
    });

    const onSubmit = (data: any) => {
        orderStore.addToCart(data);
        
    };
    const handleSelectProduct = (value: any) => {
        console.log('handleSelectProduct', value)
        setValue('product', value);
        setValue('price', value?.price);
        setValue('total', value?.total);
        setValue('quantity', 1);
    }
    const calculateFinalPrice = () => {
        const original = getValues('price') ?? 0
        const discount = getValues('discount') ?? 0
        const finalPrice = original - (original * discount / 100);
        setValue('total', finalPrice * getValues('quantity'));
    }
    return (
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                    <Grid container spacing={3} direction="row" alignItems="center">
                        <Grid item xs={4} >
                            <Controller
                                key={"product"}
                                name="product"
                                control={control}
                                render={({ field }) => (
                                    <ServerSideAutocomplete
                                        label="Sélectionner le produit"
                                        ajaxCallFn={productStore.getlist}
                                        onOptionSelect={(option) => {
                                            field.onChange(option);
                                            console.log('Selected option:', option);
                                            handleSelectProduct(option);
                                        }}
                                        field={field}
                                        error={errors.product?.id ?? errors.product}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3} >
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        InputProps={{
                                            readOnly: true,
                                            disabled: true
                                        }}
                                        {...field}
                                        label="Prix"
                                        variant="filled"
                                        fullWidth
                                        id="price"
                                        margin="normal"
                                        error={!!errors.price}
                                        helperText={errors.price ? errors.price.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Controller
                                name="quantity"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        value={field.value} // On spécifie manuellement la valeur
                                        onBlur={field.onBlur} // On spécifie manuellement le gestionnaire onBlur
                                        onChange={(e) => {
                                            field.onChange(e); // Met à jour la valeur du champ avec la nouvelle valeur
                                            calculateFinalPrice(); // Calcule le prix final après modification de la quantité
                                        }}
                                        label="Quantite"
                                        variant="filled"
                                        fullWidth
                                        id="quantity"
                                        margin="normal"
                                        error={!!errors.quantity} // Vérifie s'il y a une erreur
                                        helperText={errors.quantity ? errors.quantity.message : ''} // Affiche le message d'erreur si présent
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Controller
                                name="discount"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, ...restField } = field;
                                    return (
                                        <TextField
                                            onChange={(e) => {
                                                onChange(e); // Utilisation de l'onChange extrait de 'field'
                                                calculateFinalPrice(); // Calcul du prix final
                                            }}
                                            {...restField} // Toutes les autres propriétés de 'field'
                                            label="Discount (%)"
                                            variant="filled"
                                            fullWidth
                                            id="discount"
                                            margin="normal"
                                            error={!!errors.discount}
                                            helperText={errors.discount ? errors.discount.message : ''}
                                        />
                                    );
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Controller
                                name="total"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, ...restField } = field;
                                    return (
                                        <TextField
                                            onChange={(e) => {
                                                onChange(e); // Utilise la méthode onChange extraite de 'field'
                                                calculateFinalPrice(); // Calcule le prix final
                                            }}
                                            {...restField} // Applique les autres propriétés de 'field'
                                            id="total"
                                            label="Totale"
                                            variant="filled"
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.total}
                                            helperText={errors.total ? errors.total.message : ''}
                                        />
                                    );
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                        <Button sx={{ mb: 2 }} variant="contained" className="bg-violet-500" onClick={handleSubmit(onSubmit)}>Ajout</Button>
                       </Grid>
                    </Grid>
                </form>
    );
};

export default observer(AddNewItemForm);


