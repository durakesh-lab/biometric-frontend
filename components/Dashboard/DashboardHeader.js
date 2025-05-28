import React from "react";
import { Box, Typography, Button } from "@mui/material";

/**
 * DashboardGreetingCard
 * 
 * Replicates a card design with a green wave top,
 * a centered illustration, greeting text, and a CTA button.
 */
export default function DashboardHeader({userdata}) {
  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 220 }, // Full width on mobile, 220px on desktop
        borderRadius: 2,
        backgroundColor: "#fff",
        p: { xs: 1, sm: 2 } // Adjust padding for mobile
      }}
    >
      {/* Top Green Section with Wave */}
      <Box sx={{ position: "relative", height: { xs: 80, sm: 124,lg:60 } }}>
        {/* Centered Illustration Overlapping the Wave */}
      </Box>

      {/* Text + Button Area */}
      <Box sx={{ 
        pt: { xs: 6, sm: 8 }, 
        px: { xs: 1, sm: 2 }, 
        pb: { xs: 1, sm: 2 }, 
        textAlign: "center" 
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
          HELLO {userdata?.firstName && userdata?.firstName?.toUpperCase()}!
        </Typography>

        <Typography variant="body2" sx={{ 
          mb: 2, 
          color: "text.secondary",
          fontSize: { xs: '0.8rem', sm: '0.875rem' } // Adjust text size for mobile
        }}>
          Good morning! You have 45 new applications.
          It's a lot of work for today! So let's get started.
        </Typography>

       <Button 
  variant="contained" 
  size="small"
  sx={{
    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
    textTransform: 'capitalize',
    boxShadow: 'none', // Removes button shadow
    '&:hover': {
      boxShadow: 'none', // Prevents shadow on hover too
    }
  }}
>
  Review it
</Button>
      </Box>
    </Box>
  );
}