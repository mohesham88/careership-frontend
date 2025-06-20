import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login/", credentials);
  return response.data;
};

const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post("/auth/register/", data);
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      // Invalidate and refetch user data if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      }
      throw error;
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      // Invalidate and refetch user data if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      // Handle validation errors
      if (error.response?.status === 400) {
        const validationErrors = error.response.data;
        const errorMessages = Object.entries(validationErrors)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join("\n");
        throw new Error(errorMessages);
      }
      throw error;
    },
  });
};
