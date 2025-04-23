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
      'Employee Id': '',
      'First Name': '',
      'Last Name': '',
      'Department Id': '',
      'Department Name': '',
      'Position Code': '',
      'Position Name': '',
      'Date of Joining': '',
      'Card No.': '',
      'Area Code': '',
      'Gender': '',
      'Mobile': '',
      'Birthday': '',
      'Email': '',
      'Aadhaar No.': ''
    }
  ];

  const headers = [
    { label: 'Employee Id', key: 'Employee Id' },
    { label: 'First Name', key: 'First Name' },
    { label: 'Last Name', key: 'Last Name' },
    { label: 'Department Id', key: 'Department Id' },
    { label: 'Department Name', key: 'Department Name' },
    { label: 'Position Code', key: 'Position Code' },
    { label: 'Position Name', key: 'Position Name' },
    { label: 'Date of Joining', key: 'Date of Joining' },
    { label: 'Card No.', key: 'Card No.' },
    { label: 'Area Code', key: 'Area Code' },
    { label: 'Gender', key: 'Gender' },
    { label: 'Mobile', key: 'Mobile' },
    { label: 'Birthday', key: 'Birthday' },
    { label: 'Email', key: 'Email' },
    { label: 'Aadhaar No.', key: 'Aadhaar No.' }
  ];

  const handleImport = () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('import_file', file);
    formData.append('duplicate_record', existingDataOption === 'ignore' ? 'not_import' : 'overwrite');

    onImport(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Employee</DialogTitle>
      <DialogContent dividers>
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
                accept=".csv,.txt"
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

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
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
        </Box>

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
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Employee Id</TableCell>
                  <TableCell>First Na...</TableCell>
                  <TableCell>Department Id</TableCell>
                  <TableCell>Department Na...</TableCell>
                  <TableCell>Position Code</TableCell>
                  <TableCell>Position Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Date of Joint...</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>10001</TableCell>
                  <TableCell>Koi</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>HR</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Director</TableCell>
                  <TableCell>Male / Female</TableCell>
                  <TableCell>2016-10-14</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>10002</TableCell>
                  <TableCell>Koe</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>HR</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Director</TableCell>
                  <TableCell>Male / Female</TableCell>
                  <TableCell>2016-10-14</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>10003</TableCell>
                  <TableCell>Kosan</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>HR</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Manager Assis...</TableCell>
                  <TableCell>Male / Female</TableCell>
                  <TableCell>2016-10-14</TableCell>
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
            2. The Employee ID, First Name, Department ID, Area Code are Required fields
          </Typography>
          <Typography variant="body2" paragraph>
            3. The Card Number must be unique
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Note: Only 'txt' and 'csv' formats are supported
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