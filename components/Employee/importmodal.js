// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Divider,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Stack
// } from '@mui/material';
// import { Download as DownloadIcon } from '@mui/icons-material';
// import * as XLSX from 'xlsx';

// const ImportEmployeeModal = ({ open, onClose, onImport }) => {
//   const [file, setFile] = useState(null);
//   const [existingDataOption, setExistingDataOption] = useState('ignore');
//   const fileInputRef = React.useRef(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleDownloadTemplate = () => {
//     // Create template data based on the sample you provided
//     const templateData = [
//       {
//         'Employee Id': '',
//         'First Name': '',
//         'Last Name': '',
//         'Department Id': '',
//         'Department Name': '',
//         'Position Code': '',
//         'Position Name': '',
//         'Date of Joining': '',
//         'Card No.': '',
//         'Area Code': '',
//         'Gender': '',
//         'Mobile': '',
//         'Birthday': '',
//         'Email': '',
//         'Aadhaar No.': ''
//       }
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(templateData);
//     const workbook = XLSX.utils.book_new();
    
//     // Set column widths
//     const colWidths = [
//       { wch: 12 }, // Employee Id
//       { wch: 15 }, // First Name
//       { wch: 15 }, // Last Name
//       { wch: 12 }, // Department Id
//       { wch: 18 }, // Department Name
//       { wch: 12 }, // Position Code
//       { wch: 18 }, // Position Name
//       { wch: 15 }, // Date of Joining
//       { wch: 10 }, // Card No.
//       { wch: 10 }, // Area Code
//       { wch: 10 }, // Gender
//       { wch: 15 }, // Mobile
//       { wch: 12 }, // Birthday
//       { wch: 20 }, // Email
//       { wch: 15 }  // Aadhaar No.
//     ];
    
//     worksheet['!cols'] = colWidths;
  
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
//     XLSX.writeFile(workbook, "Employee_Import_Template.xlsx");
//     // const worksheet = XLSX.utils.json_to_sheet(templateData);
//     // const workbook = XLSX.utils.book_new();
//     // XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
//     // XLSX.writeFile(workbook, "Employee_Import_Template.xlsx");
//   };

//   const handleImport = () => {
//     if (!file) {
//       alert('Please select a file first');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('import_file', file);
//     formData.append('duplicate_record', existingDataOption === 'ignore' ? 'not_import' : 'overwrite');

//     onImport(formData);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Import Employee</DialogTitle>
//       <DialogContent dividers>
//         <Box mb={3}>
//           <Typography variant="subtitle1" gutterBottom>
//             Import File: 
//             <Button 
//               variant="outlined" 
//               component="label"
//               sx={{ ml: 2 }}
//             >
//               Choose File
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 accept=".xlsx,.xls,.csv,.txt"
//                 onChange={handleFileChange}
//               />
//             </Button>
//             <Typography variant="caption" sx={{ ml: 2 }}>
//               {file ? file.name : 'No file chosen'}
//             </Typography>
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Please download sample template, add your data, and then import
//           </Typography>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Box mb={3}>
//           {/* <Typography variant="subtitle1" gutterBottom>
//             Existing Data:
//           </Typography> */}
//           <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
//             <InputLabel>Existing Data</InputLabel>
//             <Select
//               value={existingDataOption}
//               onChange={(e) => setExistingDataOption(e.target.value)}
//               label="Existing Data"
//             >
//               <MenuItem value="ignore">Ignore</MenuItem>
//               <MenuItem value="overwrite">Overwrite existing employee</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Box mb={3}>
//           <Stack direction="row" justifyContent="space-between" alignItems="center">
//             <Typography variant="subtitle1" gutterBottom>
//               Sample Template:
//             </Typography>
//             <Button 
//               onClick={handleDownloadTemplate} 
//               startIcon={<DownloadIcon />}
//               variant="outlined"
//               size="small"
//             >
//               Download Template
//             </Button>
//           </Stack>
//           <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
//             <Table size="small" stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>A</TableCell>
//                   <TableCell>B</TableCell>
//                   <TableCell>C</TableCell>
//                   <TableCell>D</TableCell>
//                   <TableCell>E</TableCell>
//                   <TableCell>F</TableCell>
//                   <TableCell>G</TableCell>
//                   <TableCell>H</TableCell>
//                   <TableCell>I</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 <TableRow>
//                   <TableCell>S.No</TableCell>
//                   <TableCell>Employee Id</TableCell>
//                   <TableCell>First Na...</TableCell>
//                   <TableCell>Department Id</TableCell>
//                   <TableCell>Department Na...</TableCell>
//                   <TableCell>Position Code</TableCell>
//                   <TableCell>Position Name</TableCell>
//                   <TableCell>Gender</TableCell>
//                   <TableCell>Date of Joint...</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>1</TableCell>
//                   <TableCell>10001</TableCell>
//                   <TableCell>Koi</TableCell>
//                   <TableCell>1</TableCell>
//                   <TableCell>HR</TableCell>
//                   <TableCell>1</TableCell>
//                   <TableCell>Director</TableCell>
//                   <TableCell>Male / Female</TableCell>
//                   <TableCell>2016-10-14</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>2</TableCell>
//                   <TableCell>10002</TableCell>
//                   <TableCell>Koe</TableCell>
//                   <TableCell>1</TableCell>
//                   <TableCell>HR</TableCell>
//                   <TableCell>1</TableCell>
//                   <TableCell>Director</TableCell>
//                   <TableCell>Male / Female</TableCell>
//                   <TableCell>2016-10-14</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>3</TableCell>
//                   <TableCell>10003</TableCell>
//                   <TableCell>Kosan</TableCell>
//                   <TableCell>1</TableCell>
//                   <TableCell>HR</TableCell>
//                   <TableCell>2</TableCell>
//                   <TableCell>Manager Assis...</TableCell>
//                   <TableCell>Male / Female</TableCell>
//                   <TableCell>2016-10-14</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>

//         <Box>
//           <Typography variant="subtitle2" gutterBottom>
//             Description
//           </Typography>
//           <Typography variant="body2" paragraph>
//             1. The header in file template are required
//           </Typography>
//           <Typography variant="body2" paragraph>
//             2. The Employee ID, First Name, Department ID, Area Code are Required fields
//           </Typography>
//           <Typography variant="body2" paragraph>
//             3. The Card Number must be unique
//           </Typography>
//           <Typography variant="caption" color="textSecondary">
//             Note: Only 'txt', 'xls', 'csv' and 'xlsx' formats are supported
//           </Typography>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Box sx={{ flexGrow: 1 }} />
//         <Button onClick={onClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={handleImport} variant="contained" color="primary">
//           Confirm
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ImportEmployeeModal;






import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';

const ImportEmployeeModal = ({ open, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [existingDataOption, setExistingDataOption] = useState('ignore');
  const fileInputRef = React.useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const templateData = [
    {
      "username":"" ,
      'firstName': '',
 
      'lastName': '',
           "password":"",
           "role":"",
      'email': '',
      'joining_date': '',
      'date_of_birth': '',
      'mobile': '',
      'gender': '',
      'active_status': '',
      'Department Code': '',
      'Company Id': '',
      'Branch Code': '',
    }
  ];

  const headers = [
     { label: 'username', key: 'username' },
         { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
            { label: 'password', key: 'password' },
              { label: 'role', key: 'role' },
           { label: 'Email', key: 'email' },
   { label: 'Date of Joining', key: 'joining_date' },
    { label: 'date of birth', key: 'date_of_birth' },
    { label: 'Mobile', key: 'mobile' },
  { label: 'Gender', key: 'gender' },
    { label: 'active status', key: 'active_status.' },
    // { label: 'DepartmentId', key: 'dept_code' },
    { label: 'Department Code', key: 'Department Code' },

    { label: 'Company Id', key: 'Company Id' },

    { label: 'Branch Code', key: 'Branch Code' },
    // { label: 'Position Name', key: 'Position Name' },
 
  ];
  
  const handleImport = () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    // formData.append('duplicate_record', existingDataOption === 'ignore' ? 'not_import' : 'overwrite');

    onImport(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Staff</DialogTitle>
      <DialogContent sx={{   overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1'}} dividers>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Import File: 
            <Button 
              variant="outlined" 
              component="label"
              sx={{ ml: 2 }}
            >
              Choose File
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".csv,.xlsx"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="caption" sx={{ ml: 2 }}>
              {file ? file.name : 'No file chosen'}
            </Typography>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please download sample template, add your data, and then import
          </Typography>
        </Box>

        {/* <Divider sx={{ my: 2 }} /> */}

        {/* <Box mb={3}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Existing Data</InputLabel>
            <Select
              value={existingDataOption}
              onChange={(e) => setExistingDataOption(e.target.value)}
              label="Existing Data"
            >
              <MenuItem value="ignore">Ignore</MenuItem>
              <MenuItem value="overwrite">Overwrite existing employee</MenuItem>
            </Select>
          </FormControl>
        </Box> */}

        <Divider sx={{ my: 2 }} />

    <Box mb={3}>
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="subtitle1" gutterBottom>
      Sample Template:
    </Typography>
    <CSVLink
      data={templateData}
      headers={headers}
      filename="Employee_Import_Template.csv"
    >
      <Button 
        startIcon={<DownloadIcon />}
        variant="outlined"
        size="small"
      >
        Download Template
      </Button>
    </CSVLink>
  </Stack>
  <TableContainer component={Paper}  sx={{

        
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',maxHeight: 300
          }} >
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>A</TableCell>
          <TableCell>B</TableCell>
          <TableCell>C</TableCell>
          <TableCell>D</TableCell>
          <TableCell>E</TableCell>
          <TableCell>F</TableCell>
          <TableCell>G</TableCell>
          <TableCell>H</TableCell>
          <TableCell>I</TableCell>
          <TableCell>J</TableCell>
          <TableCell>K</TableCell>
          <TableCell>L</TableCell>
          <TableCell>M</TableCell>
          <TableCell>N</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
           <TableCell>Password</TableCell>
               <TableCell>Role</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Date of Joining</TableCell>
          <TableCell>Date of Birth</TableCell>
          <TableCell>Mobile</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>Active Status</TableCell>
          <TableCell>Department Code</TableCell>
          <TableCell>Department Name</TableCell>
          <TableCell>Company Id</TableCell>
          <TableCell>Branch Code</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>10001</TableCell>
          <TableCell>Koi</TableCell>
          <TableCell>Smith</TableCell>
           <TableCell>Password</TableCell>
               <TableCell>Employee</TableCell>
          <TableCell>koi.smith@example.com</TableCell>
          <TableCell>14-10-2016</TableCell>
          <TableCell>02-07-1988</TableCell>
          <TableCell>+1234567890</TableCell>
          <TableCell>M</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>1</TableCell>
          <TableCell>HR</TableCell>
          <TableCell>COMP001</TableCell>
          <TableCell>BR001</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>10002</TableCell>
          <TableCell>Koe</TableCell>
          <TableCell>Johnson</TableCell>
               <TableCell>Password</TableCell>
               <TableCell>HR</TableCell>
          <TableCell>koe.johnson@example.com</TableCell>
          <TableCell>14-10-2016</TableCell>
          <TableCell>02-07-1988</TableCell>
          <TableCell>+1234567891</TableCell>
          <TableCell>F</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>1</TableCell>
          <TableCell>HR</TableCell>
          <TableCell>COMP001</TableCell>
          <TableCell>BR001</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>10003</TableCell>
          <TableCell>Kosan</TableCell>
          <TableCell>Williams</TableCell>
               <TableCell>Password</TableCell>
               <TableCell>HR Manager</TableCell>
          <TableCell>kosan.williams@example.com</TableCell>
          <TableCell>14-10-2016</TableCell>
          <TableCell>30-11-1990</TableCell>
          <TableCell>+1234567892</TableCell>
          <TableCell>M</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>1</TableCell>
          <TableCell>HR</TableCell>
          <TableCell>COMP001</TableCell>
          <TableCell>BR001</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
</Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" paragraph>
            1. The header in file template are required
          </Typography>
          <Typography variant="body2" paragraph>
            2. The Username, Employee ID,  Department code, Branch Code are Required fields
          </Typography>
          <Typography variant="body2" paragraph>
            3. The Username, Employee ID,  Department code, Branch Code must be unique
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Note: Only 'xlsx'  formats are supported
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleImport} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportEmployeeModal;