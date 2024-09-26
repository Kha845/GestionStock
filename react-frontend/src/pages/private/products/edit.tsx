import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Card, CardActions, CardContent,CardMedia,MenuItem,Snackbar,TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, set } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../store/rootStore';
import { useEffect, useState } from 'react';
import ProductStore from './../../../store/productStore';

//definir la validation du formulaire
const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required'),
        category_id: Yup.string().required('categorie name is required'),
        price: Yup.number().required('price is required'),
        stock: Yup.number().required('stock is required'),
        image: Yup.mixed()
        .required('Image is required')
        .test('fileType', 'Unsupported file format', (value: any) => {
            if (value && value !== "") {
                const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
                return supportedFormats.includes(value.type);
            }
            return false; // Si aucun fichier n'est fourni, ce test échoue.
        })
        .test('fileSize', 'File size is too large (max: 5MB)', (value: any) => {
            if (value && value !== "") {
                return value.size <= 5000000; // Taille maximale de 5MB
            }
            return false; // Échec si aucun fichier n'est fourni.
        }),
})
       


const ProductEdit = () =>{
 
    const navigate = useNavigate();
    const { rootStore: {productStore}} = useStore();
    const [imageUrl, setImageUrl] = useState<string|null>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'> ('success');
    const {createData , initForm,updateData,getData} = productStore;
    const { id } = useParams();

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
    const {handleSubmit, control , formState: { errors}, setError, reset} =  useForm({resolver: yupResolver(validationSchema), 
                defaultValues: { 
                name: "",
                category_id: "",
                price: 0,
                stock: 0,
                image: ""
            }
        });
        const initFormData = async () =>{

            const resData = await productStore.initForm();
                setCategories(resData.categories)
            try {
                if(id){
                    const resData = await productStore.getData(id);
                    console.log(resData.data.product)
                    let {image, categories, ...formData} = resData.data.product
                    console.log("Image URL:", `${import.meta.env.VITE_APP_STORAGE_URL}/${image}`);
                    // Vérification pour voir si une image existe
                    setImageUrl(`${import.meta.env.VITE_APP_STORAGE_URL}/${image}`); // Assurez-vous d'inclure le chemin d'image
                    reset(formData)
                }else{
                    navigate(-1);
                }
            } catch (error) {
                console.log(error)
            }
        }
        const onSubmit = async (data: any) => {
            try {
                if(id){
                    const formData = new FormData();
                
                    Object.keys(data).map(key =>{
                        if(key == "image"){
                            if(data[key] !== '') formData.append(key, data[key])
                         }else{
                            formData.append(key, data[key])
                        }  
                    })
                    const resMessage = await updateData(id, data);
                         console.log(resMessage)
                    if(resMessage){
                        reset()
                        navigate('...')
                    }
                }          
    
            } catch (error: any) {
                // Gérer les erreurs, afficher un message d'alerte avec le message d'erreur du backend
               console.log(error)
            }
        };
        useEffect(()=>{
           initFormData()
      },[])         
    return (
    <Card>
        <CardContent>
        
            <Typography variant="h2" gutterBottom>
                Edition de Produit
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Product Name"
                                    variant="outlined"
                                    fullWidth
                                    id="name"
                                    margin="normal"
                                    error={!!errors.name}
                                    helperText={errors.name ? errors.name.message : ''}
                                >
                                
                                </TextField>
                                
                         )} 
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Categorie"
                                    variant="outlined"
                                    fullWidth
                                    id="category_id"
                                    margin="normal"
                                    select
                                    error={!!errors.category_id}
                                    helperText={errors.category_id ? errors.category_id.message : ''}
                                >
                                { categories.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
                                    </MenuItem>
                                 ))}
                                </TextField>
                               
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Stock"
                                    variant="outlined"
                                    fullWidth
                                    id="stock"
                                    margin="normal"
                                    error={!!errors.stock}
                                    helperText={errors.stock ? errors.stock.message : ''}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Price"
                                    variant="outlined"
                                    fullWidth
                                    id="price"
                                    margin="normal"
                                    error={!!errors.price}
                                    helperText={errors.price ? errors.price.message : ''}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    {imageUrl && (
                        <Card sx={{ maxWidth: 345 , my: 5}}>
                            <CardMedia
                                component="img"
                                height="auto"
                                image={imageUrl}
                                alt="Description de l'image" // Ajoutez une description alternative pour l'accessibilité
                            />
                        </Card>
                    )}
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Image"
                                    variant="outlined"
                                    fullWidth
                                    id="image"
                                    type="file"
                                    margin="normal"
                                    error={!!errors.image}
                                    focused
                                    onChange={ (e: any) => {
                                        field.onChange(e.target.files[0]);

                                        e.target.files.length > 0 ? setImageUrl(URL.createObjectURL(e.target.files[0])) : setImageUrl(null)
                                        
                                    }}
                                    helperText={errors.image ? errors.image.message : ''}
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

export default observer(ProductEdit)