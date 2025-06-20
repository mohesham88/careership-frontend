import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useThemeStore } from "./store/themeStore";
import { useAuthStore } from "./store/authStore";
import NotFound from "./pages/NotFound";
import { PublicRoute } from "./utils/PublicRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Public routes that don't require authentication
const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
];

// Protected routes that require authentication
const protectedRoutes = [
  {
    path: "/",
    element: <div>Home Page</div>,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/projects/:id",
    element: <ProjectDetail />,
  },
  {
    path: "/projects/:projectId/tasks/:taskId",
    element: <TaskDetail />,
  },
  // Add more protected routes here
  // Example:
  // {
  //   path: "/profile",
  //   element: <Profile />,
  // },
];

// Component to handle public routes

function App() {
  const { darkMode, toggleDarkMode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar darkMode={darkMode} onDarkModeToggle={toggleDarkMode} />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<PublicRoute>{route.element}</PublicRoute>}
                  />
                ))}

                {/* Protected Routes */}
                {protectedRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                  />
                ))}

                {/* Catch all route - redirect to NotFound */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
