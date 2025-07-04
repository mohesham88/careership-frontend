import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.png";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

interface NavbarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function Navbar({ darkMode, onDarkModeToggle }: NavbarProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Teams", path: "/teams" },
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 240,
          bgcolor: "background.paper",
        },
      }}
    >
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              bgcolor:
                location.pathname === item.path
                  ? "action.selected"
                  : "transparent",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 700 : 400,
              }}
            />
          </ListItem>
        ))}
        {isAuthenticated ? (
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <ListItem onClick={() => handleNavigation("/login")}>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

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

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                disabled={location.pathname === item.path}
                sx={(theme) => ({
                  borderRadius: location.pathname === item.path ? 8 : undefined,
                  background:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? theme.palette.primary.dark
                        : theme.palette.primary.light
                      : undefined,
                  color:
                    location.pathname === item.path
                      ? theme.palette.primary.contrastText
                      : undefined,
                  fontWeight: location.pathname === item.path ? 900 : 400,
                })}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton color="inherit" onClick={onDarkModeToggle}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={{ p: 0 }}
            >
              <Avatar
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.secondary.main
                      : "primary.main",
                  width: 36,
                  height: 36,
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          )}

          {!isMobile &&
            (isAuthenticated ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            ))}

          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
      {renderMobileMenu()}
    </AppBar>
  );
}
