import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NotesList from './src/components/NotesList';
import CreateNote from './src/components/CreateNote';
import EditNote from './src/components/EditNote';

export type RootStackParamList = {
  NotesList: undefined;
  CreateNote: undefined;
  EditNote: { noteId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NotesList">
        <Stack.Screen 
          name="NotesList" 
          component={NotesList} 
          options={{ title: 'Notes' }}
        />
        <Stack.Screen 
          name="CreateNote" 
          component={CreateNote} 
          options={{ title: 'Create Note' }}
        />
        <Stack.Screen 
          name="EditNote" 
          component={EditNote} 
          options={{ title: 'Edit Note' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
