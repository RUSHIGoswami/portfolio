import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { Box, IconButton } from '@mui/material';
import { useState, useMemo } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const [mode, setMode] = useState('dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#7C3AED' : '#6D28D9', // Purple shade
            light: mode === 'dark' ? '#8B5CF6' : '#7C3AED',
            dark: mode === 'dark' ? '#5B21B6' : '#5B21B6',
          },
          secondary: {
            main: mode === 'dark' ? '#EC4899' : '#DB2777', // Pink shade
          },
          background: {
            default: mode === 'dark' ? '#0F172A' : '#F8FAFC', // Slate colors
            paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#F1F5F9' : '#1E293B',
            secondary: mode === 'dark' ? '#CBD5E1' : '#475569',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 800,
          },
          h2: {
            fontWeight: 700,
          },
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        components: {
          MuiContainer: {
            styleOverrides: {
              root: {
                '@media (min-width: 1200px)': {
                  maxWidth: '1400px',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            width: '100%', 
            margin: 0, 
            padding: 0,
            overflow: 'hidden',
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: mode === 'dark' 
                ? 'radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(15, 23, 42, 0) 70%)'
                : 'radial-gradient(circle at center, rgba(109, 40, 217, 0.05) 0%, rgba(248, 250, 252, 0) 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Navbar colorMode={{ mode, toggleColorMode }} />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
