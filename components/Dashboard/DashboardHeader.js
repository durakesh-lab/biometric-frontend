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
        width: '100%',
        minHeight: 260,
        boxSizing: 'border-box',
        borderRadius: 2,
        backgroundColor: "#fff",
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}
    >
      {/* Compact accent band keeps the card intentional without wasting space */}
      <Box
        sx={{
          position: 'relative',
          height: 56,
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          background: 'linear-gradient(135deg, rgba(14, 159, 110, 0.16) 0%, rgba(14, 159, 110, 0.06) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'rgba(14, 159, 110, 0.14)',
            top: -72,
            right: -28
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.55)',
            bottom: -28,
            left: -18
          }
        }}
      >
        {/* Decorative accent only */}
      </Box>

      {/* Text + Button Area */}
      <Box sx={{ 
        px: 1, 
        pb: 1, 
        textAlign: "center" 
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          HELLO {userdata?.firstName && userdata?.firstName?.toUpperCase()}!
        </Typography>

        <Typography variant="body2" sx={{ 
          mb: 2, 
          color: "text.secondary",
          fontSize: { xs: '0.8rem', sm: '0.875rem' }
        }}>
          Good morning! You have 45 new applications.
          It&apos;s a lot of work for today! So let&apos;s get started.
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
