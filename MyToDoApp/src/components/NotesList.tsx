import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the RootStackParamList for navigation
type RootStackParamList = {
  NotesList: undefined;
  EditNote: { noteId: string };
  CreateNote: undefined;
};

type NoteListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NotesList'>;

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

const Note: React.FC<NoteProps> = ({ note, deleteNote }) => {
  const navigation = useNavigation<NoteListScreenNavigationProp>();

  return (
    <View style={styles.noteItem}>
      <View>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteContent}>{note.content}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditNote', { noteId: note._id })}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => deleteNote(note._id)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function NotesList() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const navigation = useNavigation<NoteListScreenNavigationProp>();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios.get<NoteType[]>('http://10.0.2.2:5000/api/notes/')
      .then((response: AxiosResponse<NoteType[]>) => {
        setNotes(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const deleteNote = (id: string) => {
    axios.delete(`http://10.0.2.2:5000/api/notes/${id}`)
      .then((response: AxiosResponse) => { 
        console.log(response.data);
        fetchNotes(); // Refresh the list after deletion
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      <FlatList
        data={notes}
        renderItem={({ item }) => <Note note={item} deleteNote={deleteNote} />}
        keyExtractor={item => item._id}
      />
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateNote')}
      >
        <Text style={styles.buttonText}>Create New Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  button: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default NotesList;
