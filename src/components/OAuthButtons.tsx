import { Button, Box, Typography, useTheme, alpha } from "@mui/material";
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import {
  initiateGoogleAuth,
  initiateGitHubAuth,
  REDIRECT_URI,
} from "../utils/oauth";
import { useGoogleAuth, useGitHubAuth } from "../hooks/useAuth";
import api from "../services/api";
import type { User } from "../types/user";
import { useActionData } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface OAuthButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function OAuthButtons({
  onSuccess,
  onError,
}: OAuthButtonsProps) {
  const googleAuth = useGoogleAuth();
  const githubAuth = useGitHubAuth();

  const handleGoogleAuth = async () => {
    try {
      const result = await initiateGoogleAuth();
      await googleAuth.mutateAsync({
        access_token: result.access_token || "",
        redirect_uri: REDIRECT_URI,
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Google authentication failed";
      onError?.(errorMessage);
    }
  };

  const handleGitHubAuth = async () => {
    try {
      const result = await initiateGitHubAuth();

      // Handle GitHub authorization code flow
      if (result.code) {
        await githubAuth.mutateAsync({
          code: result.code,
          state: result.state || "",
          redirect_uri: REDIRECT_URI,
        });
      } else {
        throw new Error("No access token or authorization code received");
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "GitHub authentication failed";
      onError?.(errorMessage);
    }
  };

  const isLoading = googleAuth.isPending || githubAuth.isPending;

  const theme = useTheme();
  const googleColor = "#4285f4";
  const githubColor = theme.palette.mode === "light" ? "#24292e" : "#c9d1d9";

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography
        variant="body2"
        sx={{ textAlign: "center", mb: 2, color: "text.secondary" }}
      >
        Or continue with
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleAuth}
          disabled={isLoading}
          sx={{
            borderColor: googleColor,
            color: googleColor,
            "&:hover": {
              borderColor: "#3367d6",
              backgroundColor: alpha(googleColor, 0.08),
            },
          }}
        >
          Continue with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GitHubIcon />}
          onClick={handleGitHubAuth}
          disabled={isLoading}
          sx={{
            borderColor: githubColor,
            color: githubColor,
            "&:hover": {
              borderColor: theme.palette.mode === "light" ? "#000" : "#fff",
              backgroundColor: alpha(githubColor, 0.08),
            },
          }}
        >
          Continue with GitHub
        </Button>
      </Box>
    </Box>
  );
}
