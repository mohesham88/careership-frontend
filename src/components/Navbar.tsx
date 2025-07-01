import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import { Brightness4, Brightness7, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.png";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

interface NavbarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function Navbar({ darkMode, onDarkModeToggle }: NavbarProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component="img"
          src={logo}
          alt="CareerShip Logo"
          sx={{ height: 60, cursor: "pointer", mr: 2 }}
          onClick={() => navigate("/")}
        />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            disabled={location.pathname === '/'}
            sx={theme => ({
              borderRadius: location.pathname === '/' ? 8 : undefined,
              background: location.pathname === '/'
                ? (theme.palette.mode === 'dark'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light)
                : undefined,
              color: location.pathname === '/' ? theme.palette.primary.contrastText : undefined,
              fontWeight: location.pathname === '/' ? 900 : 400,
            })}
          >Home</Button>
          <Button
            color="inherit"
            onClick={() => navigate("/projects")}
            disabled={location.pathname.startsWith('/projects') && location.pathname === '/projects'}
            sx={theme => ({
              borderRadius: location.pathname === '/projects' ? 8 : undefined,
              background: location.pathname === '/projects'
                ? (theme.palette.mode === 'dark'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light)
                : undefined,
              color: location.pathname === '/projects' ? theme.palette.primary.contrastText : undefined,
              fontWeight: location.pathname === '/projects' ? 900 : 400,
            })}
          >Projects</Button>
          <Button
            color="inherit"
            onClick={() => navigate("/teams")}
            disabled={location.pathname.startsWith('/teams')}
            sx={theme => ({
              borderRadius: location.pathname.startsWith('/teams') ? 8 : undefined,
              background: location.pathname.startsWith('/teams')
                ? (theme.palette.mode === 'dark'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light)
                : undefined,
              color: location.pathname.startsWith('/teams') ? theme.palette.primary.contrastText : undefined,
              fontWeight: location.pathname.startsWith('/teams') ? 900 : 400,
            })}
          >Teams</Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton color="inherit" onClick={onDarkModeToggle}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => navigate("/profile")}
                sx={{ p: 0 }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
