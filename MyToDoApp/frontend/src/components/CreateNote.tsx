import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container 
} from '@mui/material';

function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const note = {
      title: title,
      content: content
    }

    console.log(note);

    axios.post('http://localhost:5000/api/notes/add', note)
      .then(res => console.log(res.data));

    navigate('/');
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Note
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            margin="normal"
            required
            multiline
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              fullWidth
            >
              Create Note
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default CreateNote;