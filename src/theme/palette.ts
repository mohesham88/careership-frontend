import type { PaletteOptions } from "@mui/material";

export const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#262d4a",
    contrastText: "#fff",
  },
  secondary: {
    main: "#267B8D",
    contrastText: "#fff",
  },
  success: {
    main: "#76AB4E",
    contrastText: "#fff",
  },
  background: {
    default: "#f4f6fa",
    paper: "#fff",
  },
  text: {
    primary: "#262d4a",
    secondary: "#4a5568",
  },
};

export const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#262d4a",
    contrastText: "#fff",
  },
  secondary: {
    main: "#267B8D",
    contrastText: "#fff",
  },
  success: {
    main: "#76AB4E",
    contrastText: "#1a1a1a",
  },
  background: {
    default: "#181c2a",
    paper: "#232a45",
  },
  text: {
    primary: "#fff",
    secondary: "#b0b8d1",
  },
};
