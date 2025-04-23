import * as React from 'react';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import { theme } from '../../pages/_app';
import {  CircularProgress } from '@mui/material';

export default function LoadingButtons({loading}) {
  return (
<>      
    <Button
type="submit"
fullWidth
loadingPosition="end"
variant="contained"
sx={{ 
  mt: 3, 
  mb: 2, 
  py: 1.5,
  borderRadius: 2,
  fontSize: '1rem',
  opacity:"50%",
  backgroundColor:"#0E9F6E",
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none'
  }
}}
    >
      {loading ? (
      
        <Stack direction="row" alignItems="center" spacing={1}>
        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
        <CircularProgress color="inherit" size={16} />
      </Stack>
      ) : (
        'Submit'
      )}
    </Button>
    </>
  );
}
