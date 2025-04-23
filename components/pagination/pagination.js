import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationControlled({totalPages,pageNumber}) {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center">
    <Pagination count={totalPages} page={pageNumber} onChange={handleChange} />
  </Stack>
  
  );
}
