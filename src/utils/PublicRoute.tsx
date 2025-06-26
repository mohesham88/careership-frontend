import { Navigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  // if the user is auth and tries to access the auth routes, redirect to home
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/signup"))
  ) {
    // If user is authenticated, redirect to home or the page they tried to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
