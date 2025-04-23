import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction } from '@/store/authSlice';

function DeleteConfirmation({ onConfirm }) {
  const [open, setOpen] = useState(false);
let {confirnDelete}=useSelector((state)=>{;return(state.auth)})
let dispath=useDispatch()
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (data) => {
    setOpen(false);
    if(data=="cancel" ){
      dispath(confirnDeleteAction(false))

    }
    else if(data=="confirm"){
      dispath(confirnDeleteAction(true))
    }
    else{
      dispath(confirnDeleteAction(false))
    }

  };

  const handleConfirm = () => {
    onConfirm();
    handleClose("confirm");

  };
useEffect(()=>{
    if(confirnDelete=="sure" || confirnDelete=="enable_app_status" ||confirnDelete=="disable_app_status"){
      handleClickOpen()
    }
},[confirnDelete])
  return (
    <div>
<>  
{ (confirnDelete=="enable_app_status" ||confirnDelete=="disable_app_status") ? 
<Dialog
        open={open}
        onClose={()=>{handleClose("cancel")}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to ${confirnDelete=="enable_app_status" ? "Enable" :"Disable"  }  app status?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{handleClose("cancel")}}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
             {`${confirnDelete=="enable_app_status" ? "Enable" :"Disable"  }`}
          </Button>
        </DialogActions>
      </Dialog> :""
   }
   { confirnDelete=="sure" &&
      <Dialog
        open={open}
        onClose={()=>{handleClose("cancel")}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{handleClose("cancel")}}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
}
      </>
    </div>
  );
}
function MyComponent() {
    let dispath=useDispatch()
    const handleDelete = () => {
        dispath(confirnDeleteAction(true))
    };
  
    return (
      <div>
        <DeleteConfirmation onConfirm={handleDelete} />
      </div>
    );
  }
export default MyComponent;