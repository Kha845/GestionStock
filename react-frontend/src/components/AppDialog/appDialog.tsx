import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/rootStore';

const  AppDialog = () =>{
 
  const { rootStore: {dialogStore}} = useStore();
  const {isDialogOpen,closeDialog, confirmAction} = dialogStore

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={()=> closeDialog()}>
        Open alert dialog
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={()=> closeDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Alerte"}
        </DialogTitle>
        <IconButton
        aria-label='close'
        onClick={()=> closeDialog()}
        sx={{ position: 'absolute',righ: 8, top: 8, color: (theme) => theme.palette.grey[500]}}>  
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           "Are you sure".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>confirmAction()} style={{ background: '#25a325eb', color: 'white' }} variant ="contained">Confirm</Button>
          <Button onClick={()=>closeDialog()} variant ="contained" style={{ background: 'red', color: 'white' }} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default observer(AppDialog)