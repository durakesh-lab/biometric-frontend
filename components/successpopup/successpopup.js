// components/SuccessSnackbar.js
import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SuccessSnackbar = ({ open,openEdit, handleClose ,deleteemployee}) => {
  let dataToShow;
  let check=false
  switch (open) {
    case "addemployee":
       dataToShow="Success! Employee Added"
       check=true
      break;
      case "editemployee":
        dataToShow="Success! Employee Edited"
        check=true
       break;
       case "adddepartment":
        dataToShow="Success! Department Added"
        check=true
       break; 
       case "deletedepartment":
        dataToShow="Success! Department Deleted"
        check=true
       break; 
       case "editdepartment":
        dataToShow="Success! Department Edited"
        check=true
       break; 
       case "addposition":
        console.log(open,"inside position added")
        dataToShow="Success! Position Added"
        check=true
       break; 
       
       case "deleteeemployee":
        dataToShow="Success! Employee Deleted"
        check=true
       break; 
       case "addbranch":
        dataToShow="Success! Branch Added"
        check=true
       break; 
       case "editbranch":
        dataToShow="Success! Branch Edited"
        check=true
       break; 
       case "addcompany":
        dataToShow="Success! Company Added"
        check=true
       break; 
       case "editcompany":
        dataToShow="Success! Company Edited"
        check=true
       break;
       
       
       

       
    // default:
    //   break;
  }
    return (
<Snackbar
  open={check}
  autoHideDuration={2000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <SnackbarContent
    style={{ backgroundColor: '#0e9f6e', color: 'white' }}
    message={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CheckCircleIcon style={{ marginRight: 8, fontSize: '20px' }} />
        {dataToShow}
      </div>
    }
    action={
      <IconButton size="small" onClick={handleClose} style={{ color: 'white' }}>
        <CloseIcon />
      </IconButton>
    }
  />
</Snackbar>


    );
};

export default SuccessSnackbar;