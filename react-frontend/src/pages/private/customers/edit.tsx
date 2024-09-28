import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Card, CardContent, Snackbar, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../store/rootStore';
import { useEffect, useState } from 'react';

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    phone_number: Yup.string().required('Phone number is required').min(9, 'Phone number must be 9 characters').max(12, 'Phone number must be 12 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    adresse: Yup.string().required('Adresse is required'),
    zip_code: Yup.string().required('Zip code is required').min(4, 'Zipcode must be 4 characters').max(4, 'ZipCode must be 4 characters'),
});

const CustomerEdit = () => {
    const navigate = useNavigate();
    const { rootStore: { customerStore } } = useStore();
    const { getData, updateData } = customerStore;
    const { id } = useParams();

    const { handleSubmit, control, formState: { errors }, setError, reset } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            zip_code: ""
        }
    });

    // Soumission du formulaire

    const onSubmit = async (data: any) => {
        try {
            if (id) {
                // Effectuer la mise à jour des données
                const resData = await updateData(id, data);
                console.log("Response Data: ", resData);
                
            } else {
                navigate(-1);
            }
        } catch (error: any) {
            console.log("Erreur lors de la mise à jour :", error);
        }
    };
    
      
    // Initialiser le formulaire avec les données existantes
    const initForm = async () => {
        try {
            if (id) {
                const resData = await getData(id);
                console.log("response",resData.data)
                reset(resData.data.customer); // Charger les données existantes du client
            } 
            else {
                navigate(-1); // Retourner si aucun ID n'est présent
            }
        } catch (error) {
            console.log("Error while fetching data", error);
        }
    };

    useEffect(() => {
        initForm();
    }, [id]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom className='text-left'>
                    Éditer Client
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="first_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Prénom"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.first_name}
                                        helperText={errors.first_name ? errors.first_name.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="last_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nom de famille"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.last_name}
                                        helperText={errors.last_name ? errors.last_name.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Numéro de téléphone"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.phone_number}
                                        helperText={errors.phone_number ? errors.phone_number.message : ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.email}
                                        helperText={errors.email ? errors.email.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="adresse"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id='adresse'
                                    label="Adresse"
                                    variant="filled"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.adresse}
                                    helperText={errors.adresse ? errors.adresse.message : ''}
                                />
                            )}
                        />
                    </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="zip_code"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Code postal"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.zip_code}
                                        helperText={errors.zip_code ? errors.zip_code.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Mise à jour
                    </Button>
                    <Button sx={{ mt: 2, ml: 2 }} variant="contained" color="primary" onClick={() => navigate(-1)}>
                        Retour
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default observer(CustomerEdit);
