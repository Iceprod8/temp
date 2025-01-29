import React, { Suspense } from "react";
import { AppContextProvider } from "@inplan/AppContext";
import { SnackbarProvider } from "@inplan/contexts/SnackbarContext";
import { ModalProvider } from "@inplan/contexts/ModalContext";
import { ThemeProvider, useTheme } from "@inplan/contexts/ThemeContext";
import DebugFooter from "@inplan/DebugFooter";
import GlobalRouter from "@inplan/Router";
import Button from "@mui/material/Button";

function App() {
  return (
    <AppContextProvider>
      <GlobalRouter />
      <DebugFooter />
    </AppContextProvider>
  );
}

function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <div style={{ padding: "20px" }}>
      <Button variant="contained" onClick={toggleTheme}>
        Toggle Theme
      </Button>
      <p>
        The current theme mode is <strong>{mode}</strong>.
      </p>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <ModalProvider>
          <ThemeToggle />
          <Suspense fallback="...loading">
            <App />
          </Suspense>
        </ModalProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
