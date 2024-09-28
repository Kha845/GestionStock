import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Card, CardActions, CardContent,CardMedia,MenuItem,Snackbar,TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, set } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../store/rootStore';
import { useEffect, useState } from 'react';

//definir la validation du formulaire
const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required'),
        category_id: Yup.string().required('categorie name is required'),
        price: Yup.number().required('price is required'),
        stock: Yup.number().required('stock is required'),
        image: Yup.mixed().test('image is required','image is required',(value: any)=>{
            if(!value) return false;
            return true
        }).test('fileType','Unsupported file format', (value: any) => {
            if(!value) return true;
            const supportedFormat = ['image/jpeg','image/png','image/jpg'];
            return supportedFormat.includes(value.type);
        }).test('filesize','file size is top large (max: 5000)', (value: any) => {
            if(!value) return true;
              return value.size <= 5000000;
            }),
})
       


const ProductCreate = () =>{
 
    const navigate = useNavigate();
    const { rootStore: {productStore}} = useStore();
    const [imageUrl, setImageUrl] = useState<string|null>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [snackbarOpen, setSnackbarOpen] = useState(false);
  
    const {createData , initForm} = productStore;
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
            try {
                const resData = await productStore.initForm();
                if (resData && Array.isArray(resData.categories) && resData.categories.length > 0) {
                    console.log('Réponse complète de l\'API:', JSON.stringify(resData, null, 2));
                    setCategories(resData.categories);
                    console.log("Catégories récupérées avec succès :", resData.categories);
                } else {
                    console.log("Les catégories sont absentes ou invalides dans la réponse :", resData);
                }

            } catch (error) {
                console.log(error)
            }
        }
        const onSubmit = async (data: any) => {
            try {

                const formData = new FormData();
                Object.keys(data).map(key =>{
                    formData.append(key, data[key])
                })
                formData.append('image', data.image[0]);
                const resMessage = await createData(formData);
        
                console.log(resMessage);
                reset();
                formData.delete('image');
            } catch (error: any) {
                console.log(error)
            }
        };
        useEffect(()=>{
            initFormData();
      },[])         
    return (
    <Card>
        <CardContent>
            <Typography variant="h2" gutterBottom  className='text-left'>
                Créer  Produit
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
                                    variant="filled"
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
                                    variant="filled"
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
                                    variant="filled"
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
                    <Grid item xs={12} sm={6}>
                      {imageUrl && <Card sx={{ maxWidth:345 }} />}

                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            component="img"
                            
                            height="140"
                            hidden
                            image={imageUrl ??  ""}
                        />
                        </Card>
                    <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Image"
                                    variant="filled"
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
                    Retour
                </Button>
            </form>
        </CardContent>
    </Card>
    );
}

export default observer(ProductCreate)