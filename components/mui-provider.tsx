"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { ReactNode } from "react";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#02A6FB",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4BB8FC",
      contrastText: "#000000",
    },
    success: {
      main: "#4BB8FC",
      contrastText: "#000000",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#595959",
    },
    divider: "rgba(0,0,0,0.12)",
  },
  typography: {
    fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          minHeight: 48,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.35)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#02A6FB",
            borderWidth: 1.5,
          },
        },
        input: {
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 40,
          fontWeight: 700,
          borderRadius: 999,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
      },
    },
  },
});

export function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
