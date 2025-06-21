import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      setTokens: (access: string, refresh: string) => {
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        });
      },
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
