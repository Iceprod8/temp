import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode, // Either 'light' or 'dark'
      primary: {
        main: "#3192D1",
      },
      secondary: {
        main: "#0E5584",
      },
      tertiary: {
        main: "#E1CAA4",
      },
      quaternary: {
        main: "#F6DAAD",
      },
      error: {
        main: "#FF0000",
      },
      warning: {
        main: "#FFA500",
      },
      valid: {
        main: "#008000",
      },
      ...(mode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1E1E1E",
            },
            text: {
              primary: "#FFFFFF",
              secondary: "#B0B0B0",
            },
          }
        : {
            background: {
              default: "#F5F5F5",
              paper: "#FFFFFF",
            },
            text: {
              primary: "#000000",
              secondary: "#555555",
            },
          }),
    },
    typography: {
      fontFamily: "Source Sans Pro, sans-serif",
      h1: {
        fontSize: "6vw",
        fontWeight: 700,
        "@media (min-width:600px)": {
          fontSize: "4vw",
        },
        "@media (min-width:960px)": {
          fontSize: "3.5vw",
        },
      },
      h2: {
        fontSize: "4.5vw",
        fontWeight: 600,
        "@media (min-width:600px)": {
          fontSize: "3vw",
        },
        "@media (min-width:960px)": {
          fontSize: "2.5vw",
        },
      },
      h3: {
        fontSize: "3.5vw",
        fontWeight: 500,
        "@media (min-width:600px)": {
          fontSize: "2vw",
        },
        "@media (min-width:960px)": {
          fontSize: "1.5vw",
        },
      },
      body1: {
        fontSize: "1.5vw",
        "@media (min-width:600px)": {
          fontSize: "1.3vw",
        },
        "@media (min-width:960px)": {
          fontSize: "1.2vw",
        },
      },
      body2: {
        fontSize: "1.2vw",
      },
      caption: {
        fontSize: "1vw",
      },
    },
  });

export default getTheme;
