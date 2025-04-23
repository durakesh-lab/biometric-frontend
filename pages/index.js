// pages/index.js
import React from "react";
import { useRouter } from "next/router";
import { Button, Typography } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Biometric
      </Typography>
      <Button variant="contained" onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  );
}
