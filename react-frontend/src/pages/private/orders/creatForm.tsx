import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../store/rootStore';
import ServerSideAutocomplete from '../../../components/side/ServerSideAutocomplet/ServerSideAutocomplete';
import AddNewItemForm from '../products/addNewItemForm';
import AllItemList from './allItemList';
import { useState } from 'react';
import products from '../products';

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    id: Yup.string().required('Le client est requis'),
    label: Yup.string().required('Le client est requis'),
  }).required('Le client est requis'),
});

const OrderCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { orderStore, customerStore } } = useStore();
  const [ProductErrorMessage,setProductErrorMessage] = useState<any>(null);
  const { handleSubmit, control, formState: { errors }, reset , setError} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: { id: "", label: "" },
    },
  });

  const onSubmit = async (data: any) => {
        try {
            setProductErrorMessage(null);
            const resData = await orderStore.createData(data);
            if(resData){
                reset({
                    customer: {id:"",label:""},
                })
                orderStore.setCartItems([])

                navigate('/dashboard/orders');
            }
        } catch (error:any) {
            Object.keys(error?.data).map((e:any) =>{
                setError(e, {
                    type: 'manual',
                    message: error?.data[e],
                });
            });
        }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom className='text-left'>
          Creer commande
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                key={"customer"}
                name="customer"
                control={control}
                render={({ field }) => (
                  <ServerSideAutocomplete
                    label="Sélectionner le client"
                    ajaxCallFn={customerStore.getlist}
                    onOptionSelect={(option) => field.onChange(option)}
                    error={errors.customer?.id ?? errors.customer}
                    field={field}
                  />
                )}
              />
            </Grid>            
          </Grid>
          <AddNewItemForm />
          <AllItemList editMode={true}/>
          <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end', // Pour aligner à droite
          mt: 3,  // Marge au-dessus des boutons
          gap: 2  // Espace entre les boutons
        }}
      >
        <Button type="submit" variant="contained" color="success">
          Enregistrer
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Box>
      {ProductErrorMessage ? <Box sx={{ color: 'error.main', my: 2 }}>{ProductErrorMessage}</Box>: " "}
        </form>
      </CardContent>
    </Card>
  );
};

export default observer(OrderCreate);
