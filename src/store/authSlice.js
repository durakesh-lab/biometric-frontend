import { port } from '@/config';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ---------------------------------
// 1) Thunk for login
// ---------------------------------
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log(process.env.NEXT_PUBLIC_BASE_URL,"9876555555555555555555")
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:email, password
        }),
      });

      const data = await response.json();
      
      // Handle GraphQL errors
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }
      // data.data.userLogin should be { token: "..." }
      return data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// export const loginUserBythirdparty = createAsyncThunk(
//   'auth/loginUserBythirdparty',
//   async ({ email:username, password }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`http://localhost:${port}/jwt-api-token-auth/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username,password
//         }),
//       });

//       const data = await response.json();
//      console.log({data},"======================??????????")
//       // Handle GraphQL errors
//       if (data.errors) {
//         return rejectWithValue(data.errors[0].message);
//       }

//       // data.data.userLogin should be { token: "..." }
//       return data
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );


// ---------------------------------
// 2) Thunk for registration
// ---------------------------------
// Adjust the mutation name and fields to match your actual schema
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ firstName, lastName, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'UserRegister',
          query: `
            mutation UserRegister($firstName: String!, $lastName: String!, $email: String!, $password: String!, $role: String!) {
              createUser(createUserInput: {firstName: $firstName, lastName: $lastName, email: $email, password: $password, role: $role}) {
                id
                firstName
                lastName
                email
              }
            }
          `,
          variables: { firstName, lastName, email, password, role },
        }),
      });
      const data = await response.json();

      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "auth/createEmployee",
  async ({ obj }, { rejectWithValue }) => {
    obj.area=[obj.area]
    let token=localStorage.getItem("biometric_token")
    try {
      const response = await fetch('http://localhost:7000/employee/addemployee', {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  "auth/createDepartment",
  async ({ obj }, { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")
    try {
      const response = await fetch(obj?.url=="createposition" ?'http://localhost:7000/position/addposition': 'http://localhost:7000/department/adddepartment', {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createPosition = createAsyncThunk(
  "auth/createPosition",
  async ({ obj }, { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")
    try {
      const response = await fetch('http://localhost:7000/position/addposition', {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createbranch = createAsyncThunk(
  "auth/createbranch",
  async ({ obj }, { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")
    try {
      const response = await fetch('http://localhost:7000/area/addArea', {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createcompany = createAsyncThunk(
  "auth/createcompany",
  async ({ obj }, { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company`, {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editEmployeeAction = createAsyncThunk(
  "auth/editEmployee",
  async (obj , { rejectWithValue }) => {
    obj.area=[obj.area]
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch('http://localhost:7000/employee/editemployee/'+obj.id, {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editDepartmentAction = createAsyncThunk(
  "auth/editDepartment",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/department/`+obj.id, {
        method: 'PUT',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editStaffAction = createAsyncThunk(
  "auth/editStaffAction",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/edituser/`+obj.id, {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
    
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editPositionAction = createAsyncThunk(
  "auth/editPosition",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch('http://localhost:7000/Position/editPosition/'+obj.id, {
        method: 'POST',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editCompanyAction = createAsyncThunk(
  "auth/editCompanyAction",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/`+obj.id, {
        method: 'PUT',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editBranchAction = createAsyncThunk(
  "auth/editBranchAction",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/branch/`+obj.id, {
        method: 'PUT',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },
        body: JSON.stringify(obj),
        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getPositionList = createAsyncThunk(
  "auth/getPositionList",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch('http://localhost:7000/position/getPositionList/', {
        method: 'GET',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getbranchList = createAsyncThunk(
  "auth/getbranchList",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch('http://localhost:7000/area/getAreaList/', {
        method: 'GET',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getDepartmentList = createAsyncThunk(
  "auth/getDepartmentList",
  async (obj , { rejectWithValue }) => {
    let token=localStorage.getItem("biometric_token")

    try {
      const response = await fetch('http://localhost:7000/department/getdepartmentList/', {
        method: 'GET',
        headers:{
          Authorization:token,
          'Content-Type':"application/json"
        },        
      });
      
      const data = await response.json();
      if (data.errors) {
        return rejectWithValue(data.errors[0].message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---------------------------------
// 3) Auth Slice
// ---------------------------------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    loading: false,
    error: null,
    confirnDelete:false,
    getPositionListData:[],
    getDepartmentListData:[],
    createdDepartmentData:{},
    createdPositionData:{},
    createdbranchData:{},
    createdcompanyData:{},
    getBranchListData:[],
    
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    
      onLogout:(state,data)=>{
          return {...state,token:null}
      },
      confirnDeleteAction:(state,data)=>{
      
        return {...state,confirnDelete:data.payload}
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.errorlogin = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if(action.payload.error){
        state.loading = false;
        state.errorlogin = action.payload.message;
      }
      else{
        state.loading = true;
        state.token = action.payload; // token from userLogin
        state.errorlogin = null;
      }
  
    });
    builder.addCase(loginUser.rejected, (state, action) => {

      state.loading = false;
      state.errorlogin = action.payload || action.error.message;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token; // token from userRegister
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // create employee
    builder.addCase(createEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.createdEmplyeeData=null
    });
    builder.addCase(createEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.createdEmplyeeData = action.payload // token from userRegister
      state.error = null;
    });
    builder.addCase(createEmployee.rejected, (state, action) => {
      state.loading = false;
      state.createdEmplyeeData=null
      state.error = action.payload || action.error.message;
    });
        // Edit employee
        builder.addCase(editEmployeeAction.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.editEmployeeData=null
        });
        builder.addCase(editEmployeeAction.fulfilled, (state, action) => {
          state.loading = false;
          state.editEmployeeData = action.payload // token from userRegister
          state.error = null;
        });
        builder.addCase(editEmployeeAction.rejected, (state, action) => {
          state.loading = false;
          state.editEmployeeData=null
          state.error = action.payload || action.error.message;
        });

        // get position list
        builder.addCase(getPositionList.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.getPositionListData=null
        });
        builder.addCase(getPositionList.fulfilled, (state, action) => {
          // console.log({state, action})
          state.loading = false;
          state.getPositionListData = action.payload.data // token from userRegister
          state.error = null;
        });
        builder.addCase(getPositionList.rejected, (state, action) => {
          state.loading = false;
          state.getPositionListData=null
          state.error = action.payload || action.error.message;
        });

        // get branch data
        builder.addCase(getbranchList.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.getBranchListData=null
        });
        builder.addCase(getbranchList.fulfilled, (state, action) => {
          // console.log({state, action})
          state.loading = false;
          state.getBranchListData = action.payload.data // token from userRegister
          state.error = null;
        });
        builder.addCase(getbranchList.rejected, (state, action) => {
          state.loading = false;
          state.getBranchListData=null
          state.error = action.payload || action.error.message;
        });

                // get getDepartmentList list
                builder.addCase(getDepartmentList.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.getDepartmentListData=null
                });
                builder.addCase(getDepartmentList.fulfilled, (state, action) => {
                  console.log({state, action})
                  state.loading = false;
                  state.getDepartmentListData = action.payload.data // token from userRegister
                  state.error = null;
                });
                builder.addCase(getDepartmentList.rejected, (state, action) => {
                  state.loading = false;
                  state.getDepartmentListData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(editDepartmentAction.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.editDepartmentData=null
                });
                builder.addCase(editDepartmentAction.fulfilled, (state, action) => {
                  console.log({state, action})
                  state.loading = false;
                  state.editDepartmentData = action.payload.data // token from userRegister
                  state.error = null;
                });
                builder.addCase(editDepartmentAction.rejected, (state, action) => {
                  state.loading = false;
                  state.editDepartmentData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(createDepartment.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.createdDepartmentData=null
                });
                builder.addCase(createDepartment.fulfilled, (state, action) => {
                  state.loading = false;
                  state.createdDepartmentData = action.payload // token from userRegister
                  state.error = null;
                });
                builder.addCase(createDepartment.rejected, (state, action) => {
                  state.loading = false;
                  state.createdDepartmentData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(createPosition.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.createdPositionData=null
                });
                builder.addCase(createPosition.fulfilled, (state, action) => {
                  state.loading = false;
                  state.createdPositionData = action.payload // token from userRegister
                  state.error = null;
                });
                builder.addCase(createPosition.rejected, (state, action) => {
                  state.loading = false;
                  state.createdPositionData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(createbranch.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.createdbranchData=null
                });
                builder.addCase(createbranch.fulfilled, (state, action) => {
                  state.loading = false;
                  state.createdbranchData = action.payload // token from userRegister
                  state.error = null;
                });
                builder.addCase(createbranch.rejected, (state, action) => {
                  state.loading = false;
                  state.createdbranchData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(createcompany.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.createdcompanyData=null
                });
                builder.addCase(createcompany.fulfilled, (state, action) => {
                  state.loading = false;
                  state.createdcompanyData = action.payload // token from userRegister
                  state.error = null;
                });
                builder.addCase(createcompany.rejected, (state, action) => {
                  state.loading = false;
                  state.createdcompanyData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(editPositionAction.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.editPositionData=null
                });
                builder.addCase(editPositionAction.fulfilled, (state, action) => {
                  console.log({state, action})
                  state.loading = false;
                  state.editPositionData = action.payload.data // token from userRegister
                  state.error = null;
                });
                builder.addCase(editPositionAction.rejected, (state, action) => {
                  state.loading = false;
                  state.editPositionData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(editBranchAction.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.editBranchData=null
                });
                builder.addCase(editBranchAction.fulfilled, (state, action) => {
                  console.log({state, action})
                  state.loading = false;
                  state.editBranchData = action.payload.data // token from userRegister
                  state.error = null;
                });
                builder.addCase(editBranchAction.rejected, (state, action) => {
                  state.loading = false;
                  state.editBranchData=null
                  state.error = action.payload || action.error.message;
                });
                builder.addCase(editCompanyAction.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                  state.editCompanyData=null
                });
                builder.addCase(editCompanyAction.fulfilled, (state, action) => {
                  state.loading = false;
                  state.editCompanyData = action.payload // token from userRegister
                  state.error = null;
                });
                builder.addCase(editCompanyAction.rejected, (state, action) => {
                  state.loading = false;
                  state.editCompanyData=null
                  state.error = action.payload || action.error.message;
                });
                
        
  }
});


export const getPermissionbyRole = createAsyncThunk(
  "auth/getPermissionbyRole",
  async (obj , { rejectWithValue }) => {
    // let token=localStorage.getItem("biometric_token")

    try {
      
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions/findpermissionsbyrole/${obj}`);
          const role = response.data[0];
        const response2= await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions`);
      // const data = await response.json();
      // if (response2.errors) {
      //   return rejectWithValue(data.errors[0].message);
      // }
    
      return {rolepermission:role.permAndSubPerm,allpermission:response2.data};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

let userSlice=createSlice({
  name:"users",
  initialState:{
   edituserdata:{},
   opencompanybranch:false,
   zindexheadervalue:null
  },
  reducers:{
          SelectCompanyBranchGlobal:(state,data)=>{
      
        return {...state,opencompanybranch:data.payload}
    },
      zindexheader:(state,data)=>{
      
        return {...state,zindexheadervalue:data.payload}
    },
  },
  extraReducers:(builder)=>{
    builder.addCase(editStaffAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.edituserdata=null
    });
    builder.addCase(editStaffAction.fulfilled, (state, action) => {
      state.loading = false;
      state.edituserdata = action.payload // token from userRegister
      state.error = null;
    });
    builder.addCase(editStaffAction.rejected, (state, action) => {
      state.loading = false;
      state.edituserdata=null
      state.error = action.payload || action.error.message;
    });
    builder.addCase(getPermissionbyRole.pending, (state) => {
      state.loading = true;
            // console.log(action,"90000000000000000000222")
      state.error = null;
      state.getPermission=null
    });
    builder.addCase(getPermissionbyRole.fulfilled, (state, action) => {
      state.loading = false;
 
      state.getPermission = action.payload // token from userRegister
      state.error = null;
    });
    builder.addCase(getPermissionbyRole.rejected, (state, action) => {
      state.loading = false;
      
      state.getPermission=null
      state.error = action.payload || action.error.message;
    });
    
  }
})
export const { logout,onLogout ,confirnDeleteAction} = authSlice.actions;
export const { SelectCompanyBranchGlobal,zindexheader} = userSlice.actions;

export default authSlice.reducer;
const userSliceReducer=userSlice.reducer
export  {userSliceReducer}
