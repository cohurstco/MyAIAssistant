import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NoteTaker
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Notes
          </Button>
          <Button color="inherit" component={RouterLink} to="/create">
            Create Note
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;