import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface VectorStoreItem {
  id: string;
  content: string;
}

const ViewVectorStore: React.FC = () => {
  const [vectorStoreContents, setVectorStoreContents] = useState<VectorStoreItem[]>([]);

  useEffect(() => {
    fetchVectorStoreContents();
  }, []);

  const fetchVectorStoreContents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/view_vectorstore');
      const data = await response.json();
      setVectorStoreContents(data.contents.map((content: string, index: number) => ({
        id: index.toString(),
        content,
      })));
    } catch (error) {
      console.error('Error fetching vector store contents:', error);
    }
  };

  const renderItem = ({ item }: { item: VectorStoreItem }) => (
    <View style={styles.item}>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vector Store Contents</Text>
      {vectorStoreContents.length > 0 ? (
        <FlatList
          data={vectorStoreContents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>The vector store is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default ViewVectorStore;
