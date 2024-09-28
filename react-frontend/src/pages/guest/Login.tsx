
import { Alert, Button, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useStore } from '../../store/rootStore';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';


//utilisation de la bibiothéque yup pour définir un schéma de validation des données
const schema = yup.object().shape(
    {
        email: yup.string().required('l\'email est requis').email('l\'email n\'est pas valide'),
        password: yup
        .string()
        .required('Le mot de passe est requis'),
    }
);



const Login = () =>{
    
    const { rootStore: { authStore } } = useStore()

    const  { handleSubmit, register , control, formState: { errors , isSubmitting},reset} = 
    useForm({resolver: yupResolver(schema), defaultValues: { email: "",password: ""}
            });
    
    const isAuthenticated = authStore.isAuthenticated;

   const onSubmit = async (data: any) =>{
   
        try{
            const resData = await authStore.login({
                email: data.email,
                password: data.password,
            })
          
            reset();
        }catch(errors){
            console.log(errors)
        }
    
   }
   if(isAuthenticated){
    return <Navigate to="/dashboard/customers" replace/>
  }
    return(
<div className="min-h-screen w-full  flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
    <div className="text-center mb-4 text-white">
        <Typography variant="h4"> G-STOCK </Typography>
    </div>
    <Card className="p-4 border rounded-lg shadow"> 
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
              <h1 className="text-lg font-bold mb-2 text-blue-700">Espace de connexion</h1>
              <Controller name='email' control={control} render={({field}) => (
              <TextField fullWidth id="email" label="Email" type='email' variant="filled" 
              error={!! errors.email !!} helperText={errors.email ? errors.email.message : ''} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon className='text-blue-700'/>
                  </InputAdornment>
                ),
              }}
              {...field} 
          />)} />
             <Controller name="password" control={control}
              render={({field}) => (
                <TextField fullWidth  id="password" 
                label="Password"  type="password" variant="filled" error={!! errors.password !!} helperText={errors.password ? errors.password.message:""}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className='text-blue-700'/>
                      </InputAdornment>
                    ),
                  }}    
                {...field}/>
             
    )}/>      
          <Button variant='contained'  
                color='primary' 
                className="px-4 py-2 text-white rounded" 
                type="submit" disabled={isSubmitting}> {isSubmitting ? "Vérification..." : "Connecter"}</Button>
        </form>
        </CardContent>
    </Card>
  
</div>
     
    )
}

export default observer(Login)