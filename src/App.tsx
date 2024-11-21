import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { Box, PaletteMode } from "@mui/material";

const App: React.FC = () => {
  const [mode] = useState<PaletteMode>("dark");

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#7C3AED" : "#6D28D9", // Purple shade
            light: mode === "dark" ? "#8B5CF6" : "#7C3AED",
            dark: mode === "dark" ? "#5B21B6" : "#5B21B6",
          },
          secondary: {
            main: mode === "dark" ? "#EC4899" : "#DB2777", // Pink shade
          },
          background: {
            default: mode === "dark" ? "#0F172A" : "#F8FAFC", // Slate colors
            paper: mode === "dark" ? "#1E293B" : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#F1F5F9" : "#0F172A",
            secondary: mode === "dark" ? "#CBD5E1" : "#475569",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: "3.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
            "@media (max-width:600px)": {
              fontSize: "2.5rem",
            },
          },
          h2: {
            fontSize: "2.25rem",
            fontWeight: 600,
            lineHeight: 1.3,
            "@media (max-width:600px)": {
              fontSize: "1.875rem",
            },
          },
          h3: {
            fontSize: "1.875rem",
            fontWeight: 600,
            lineHeight: 1.3,
            "@media (max-width:600px)": {
              fontSize: "1.5rem",
            },
          },
          body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
          },
          button: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "0.5rem",
                padding: "0.5rem 1.5rem",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
