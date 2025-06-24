import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { handleOAuthCallback } from "../../utils/oauth";

export default function OAuthCallback() {
  useEffect(() => {
    handleOAuthCallback();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">Completing authentication...</Typography>
    </Box>
  );
}
