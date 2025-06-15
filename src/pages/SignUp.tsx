import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link as RouterLink } from "react-router-dom";

interface ValidationErrors {
  [key: string]: string[];
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState("");
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: ["Passwords do not match"],
      });
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        // Check if the error message contains field-specific errors
        if (err.message.includes(":")) {
          const fieldErrors: ValidationErrors = {};
          err.message.split("\n").forEach((line) => {
            const [field, message] = line.split(": ");
            if (field && message) {
              fieldErrors[field] = [message];
            }
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError("An unexpected error occurred");
      }
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName]?.[0] || "";
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {generalError && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {generalError}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="given-name"
              autoFocus
              value={formData.first_name}
              onChange={handleChange}
              error={!!getFieldError("first_name")}
              helperText={getFieldError("first_name")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!getFieldError("last_name")}
              helperText={getFieldError("last_name")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!getFieldError("email")}
              helperText={getFieldError("email")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!getFieldError("password")}
              helperText={getFieldError("password")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!getFieldError("confirmPassword")}
              helperText={getFieldError("confirmPassword")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
