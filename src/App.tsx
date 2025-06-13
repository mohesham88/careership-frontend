import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { darkMode, toggleDarkMode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar darkMode={darkMode} onDarkModeToggle={toggleDarkMode} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
              />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? <Profile /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <div>Home Page</div>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
