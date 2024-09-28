import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/rootStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import AllItemList from './allItemList';
import { useReactToPrint } from 'react-to-print';

const OrderView = () => {
  const { rootStore: { orderStore } } = useStore();
  const [editData, setEditData] = useState<any>(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = React.useRef<any>();

  const fetchDetails = async () => {
    try {
      if (id) {
        const resData = await orderStore.getData(id);
        console.log(resData);
        setEditData(resData);
      } else {
        navigate(-1);
      }
    } catch (error: any) {
      console.error('Error while fetching data', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchDetails();
    orderStore.setCartItems([]);
  }, [id]);

  if (!editData) {
    return <Typography>Chargement des détails de la commande...</Typography>; // Affiche un message de chargement
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ px: 5, py: 3 }} ref={printRef}>
        <Typography variant="h4" gutterBottom>
          Détails de la commande
        </Typography>

        {/* Affichage des détails de la commande */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 3, sm: 2 }} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography fontWeight="bold">ID de la commande: {editData.data.orders?.id || 'N/A'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography fontWeight="bold">Date de la commande: {editData.data.orders?.created_at || 'N/A'}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 3, sm: 2 }} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box>
              <Typography fontWeight="bold">Nom: {editData.data.orders?.customer?.first_name || 'Non défini'} {editData.data.orders?.customer?.last_name || ''}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography fontWeight="bold">Email: {editData.data.orders?.customer?.email || 'Non défini'}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 3, sm: 2 }} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box>
              <Typography></Typography>
              <Typography fontWeight="bold">Téléphone: {editData.data.orders?.customer?.phone_number || 'N/A'}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Liste des articles de la commande */}
        <AllItemList editMode={false} />

        {/* Boutons d'impression et retour */}
        <Button
          sx={{ mt: 2, ml: 5 }}
          type="button"
          variant="contained"
          color="success"
          onClick={handlePrint}
        >
          Imprimer
        </Button>
        <Button
          sx={{ mt: 2, ml: 5 }}
          type="button"
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      </Box>
    </Box>
  );
};

export default OrderView;
