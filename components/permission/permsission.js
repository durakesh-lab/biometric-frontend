import { getPermissionbyRole } from '@/store/authSlice';
import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { useDispatch } from 'react-redux';

const PermisissionRole = () => {
    let dispatch=useDispatch()
  React.useEffect(() => {
    if(localStorage.getItem("biometric_token")){
    let data=jwtDecode(localStorage.getItem("biometric_token"))

    if (data.role) {
      const fetchRoleDetails = async () => {
        // setLoading(true);
        try {
           

          dispatch(getPermissionbyRole(data.role));
          // const response = await axios.get(`http://localhost:3001/permissions/findpermissionsbyrole/${data.role}`);
          // const role = response.data[0];
    
        } catch (error) {
          // showSnackbar('Failed to fetch role details', 'error');
        } finally {
          // setLoading(false);
        }
      };
      fetchRoleDetails();
    }
    }

  }, []);

  return (
   ""
  )
}

export default PermisissionRole
