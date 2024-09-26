import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useStore } from '../../../store/rootStore';
import { observer } from 'mobx-react-lite';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import creatForm from './creatForm';


const paginationModel = { page: 0, pageSize: 5 };

const ProductList = () =>{

  const {rootStore: {customerStore}} = useStore();
  const initTable = async () =>{
    try {
        const resData = await customerStore.customerLists();
    } catch (error) {

        console.log(error)
    }
  }

  React.useEffect(()=>{

        initTable();
  },[])


  return (
 
    <Card sx={{ width: '100%'}}>
    <CardContent>
    <Typography variant='h2' className='text-left'>
      Clients</Typography>
      <Box display="flex" justifyContent="flex-start" marginBottom={2}>
        <Button variant="contained" component={Link} to={'create'}>Creer</Button>
      </Box>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={customerStore.rowData}
          columns={customerStore.columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0, width: '100%' }}
        />
      </Paper>
    </CardContent>
  </Card>

  );
}
export default observer(ProductList)