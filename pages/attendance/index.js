import React from "react";
import { Box, Typography } from "@mui/material";
import Layout from "../../components/Layout/Layout";

export default function AttendancePage() {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Attendance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Coming soon — this section is being built.
        </Typography>
      </Box>
    </Layout>
  );
}
