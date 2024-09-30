import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Define an interface for the Note object
interface NoteType {
  _id: string;
  title: string;
  content: string;
}

interface NoteProps {
  note: NoteType;
  deleteNote: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ note, deleteNote }) => (
  <TableRow>
    <TableCell>{note.title}</TableCell>
    <TableCell>{note.content}</TableCell>
    <TableCell>
      <IconButton component={Link} to={`/edit/${note._id}`} color="primary" size="small">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => { deleteNote(note._id) }} color="secondary" size="small">
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

function NotesList() {
  const [notes, setNotes] = useState<NoteType[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/notes/')
      .then(response => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const deleteNote = (id: string) => {
    axios.delete(`http://localhost:5000/api/notes/${id}`)
      .then(response => { console.log(response.data) });

    setNotes(notes.filter(el => el._id !== id));
  }

  const noteList = () => {
    return notes.map(currentnote => {
      return <Note note={currentnote} deleteNote={deleteNote} key={currentnote._id}/>;
    })
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notes
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="notes table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noteList()}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Button component={Link} to="/create" variant="contained" color="primary">
          Create New Note
        </Button>
      </Box>
    </Box>
  );
}

export default NotesList;