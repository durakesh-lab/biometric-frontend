import React from "react";
import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";

const chipSx = {
  borderRadius: 999,
  fontWeight: 700,
  backgroundColor: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(15, 23, 42, 0.06)",
};

export default function DashboardHeader({ userdata, summary, scope }) {
  const firstName = userdata?.firstName || userdata?.username || "there";
  const companyLabel = scope?.companyName || "All companies";
  const branchLabel = scope?.branchName || "All branches";
  const counts = summary?.counts || {};
  const present = counts.present ?? 0;
  const totalEmployees = counts.totalEmployees ?? 0;
  const onLeave = counts.onLeave ?? 0;
  const coverage = totalEmployees ? Math.round((present / totalEmployees) * 100) : 0;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 320,
        boxSizing: "border-box",
        borderRadius: 4,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(14, 159, 110, 0.08)",
        background:
          "linear-gradient(180deg, rgba(236, 253, 245, 0.96) 0%, rgba(255, 255, 255, 0.96) 72%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at top right, rgba(14, 159, 110, 0.16) 0, transparent 28%), radial-gradient(circle at 18% 24%, rgba(34, 197, 94, 0.12) 0, transparent 20%)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Avatar
            sx={{
              width: 54,
              height: 54,
              color: "#0E9F6E",
              bgcolor: "rgba(255, 255, 255, 0.82)",
              border: "1px solid rgba(14, 159, 110, 0.12)",
              boxShadow: "0 14px 30px rgba(14, 159, 110, 0.10)",
            }}
          >
            <WorkspacePremiumOutlinedIcon />
          </Avatar>

          <Chip label={companyLabel} sx={chipSx} />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              letterSpacing: "0.18em",
              color: "text.secondary",
              fontWeight: 800,
            }}
          >
            Live overview
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mt: 0.5,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0F172A",
            }}
          >
            Hello {firstName}!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "text.secondary",
              lineHeight: 1.75,
              maxWidth: 320,
            }}
          >
            Today&apos;s attendance snapshot is ready for {branchLabel}. Use the cards on the
            right to review the active workforce at a glance.
          </Typography>
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        sx={{ position: "relative", zIndex: 1, mt: 2 }}
      >
        <Chip
          icon={<Groups2OutlinedIcon />}
          label={`${present}/${totalEmployees || 0} present`}
          sx={chipSx}
        />
        <Chip
          icon={<EventBusyOutlinedIcon />}
          label={`${coverage}% coverage`}
          sx={chipSx}
        />
        <Chip
          icon={<BeachAccessOutlinedIcon />}
          label={`${onLeave} on leave`}
          sx={chipSx}
        />
      </Stack>

      <Box sx={{ position: "relative", zIndex: 1, mt: 2, display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: 999,
            px: 2.25,
            boxShadow: "none",
            background: "linear-gradient(135deg, #0E9F6E 0%, #0B8F64 100%)",
            "&:hover": {
              boxShadow: "none",
              background: "linear-gradient(135deg, #0B8F64 0%, #0A7C57 100%)",
            },
          }}
        >
          Review attendance
        </Button>
      </Box>
    </Box>
  );
}
