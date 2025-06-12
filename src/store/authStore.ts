import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // This is a mock implementation
      if (email && password) {
        set({
          user: {
            id: "1",
            email,
            name: "Test User",
          },
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
