import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Card, CardContent,Snackbar,TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../store/rootStore';
import { useState } from 'react';

//definir la validation du formulaire
const validationSchema = Yup.object().shape({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('last name is required'),
        phone_number: Yup.string().required('Phone number is required').min(9,'Phone number must be 9 character').max(12,'Phone number must be 10 character'),
        email: Yup.string().email('Invalid email address').required('email is required'),
        adresse: Yup.string().required('adresse is required'),
        zip_code: Yup.string().required('Zip code is required').min(4,'Zipcode must be 4 character').max(4,'ZipCode must be 4 character'),
})


const CustomerCreate = () =>{
 
    const navigate = useNavigate();
    const { rootStore: {customerStore}} = useStore();
    const {createData} = customerStore;

   
    const {handleSubmit, control , formState: { errors}, setError, reset} =  useForm({resolver: yupResolver(validationSchema), 
                defaultValues: { 
                first_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                zip_code: ""
            }
        });
      
        const onSubmit = async (data: any) => {
            try {
                // Appel à la fonction qui crée le client
                const resMessage = await createData(data);
                console.log(resMessage);
              
            } catch (error: any) {
                console.log(error);
             
            }
        };
                
    return (
    <Card>
        <CardContent>
            <Typography variant="h2" gutterBottom>
                Création de Client
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
                                    variant="outlined"
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
                                    variant="outlined"
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
                                    variant="outlined"
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
                                    variant="outlined"
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
                                    label="Adresse"
                                    variant="outlined"
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
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.zip_code}
                                    helperText={errors.zip_code ? errors.zip_code.message : ''}
                                />
                            )}
                        />
                    </Grid>
                   
                   
                </Grid>
                <Button sx={{ mt:2 }} type="submit" variant="contained" color="success" >
                    Enregistrer
                </Button>
                <Button  sx={{ mt:2, ml: 2 }} 
                 variant="contained" color="primary" onClick={()=>{
                    navigate(-1)
                 }}>
                    Back
                </Button>
            </form>
        </CardContent>
    </Card>
    );
}

export default observer(CustomerCreate)