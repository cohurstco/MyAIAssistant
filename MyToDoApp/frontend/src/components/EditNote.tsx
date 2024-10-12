import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container 
} from '@mui/material';

function EditNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/notes/${id}`)
      .then(response => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch(function (error) {
        console.log(error);
      })
  }, [id]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const note = {
      title: title,
      content: content
    }

    console.log(note);

    axios.put(`http://localhost:5000/api/notes/${id}`, note)
      .then(res => console.log(res.data))
      .catch(error => console.error('Error updating note:', error));

    navigate('/');
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Note
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
            aria-label="Note title"
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
            aria-label="Note content"
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              fullWidth
            >
              Update Note
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default EditNote;