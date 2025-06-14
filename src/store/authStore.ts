import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { handleApiError } from "../services/api";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface ValidationError {
  [key: string]: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await api.post("/auth/login/", {
            email,
            password,
          });

          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          const apiError = handleApiError(error);
          if (apiError.status === 401) {
            throw new Error("Invalid email or password");
          }
          throw apiError;
        }
      },
      signup: async (data) => {
        try {
          const response = await api.post("/auth/register/", data);

          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          const apiError = handleApiError(error);
          if (apiError.status === 400) {
            // Handle validation errors
            const validationErrors = apiError.data as ValidationError;
            const errorMessages = Object.entries(validationErrors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("\n");
            throw new Error(errorMessages);
          }
          throw apiError;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
