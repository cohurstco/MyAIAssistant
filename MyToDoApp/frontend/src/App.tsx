import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import Navbar from "./components/Navbar";
import NotesList from "./components/NotesList";
import EditNote from "./components/EditNote";
import CreateNote from "./components/CreateNote";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<NotesList />} />
              <Route path="/edit/:id" element={<EditNote />} />
              <Route path="/create" element={<CreateNote />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
