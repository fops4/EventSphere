import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { TextInput, Card, Title, Paragraph, Text, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://10.0.2.2:3000/api/recherche?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data.evenements);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erreur lors de la recherche des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.type}</Paragraph>
      </Card.Content>
      <Card.Cover source={{ uri: item.image }} style={styles.eventImage} />
      <Card.Content>
        <Paragraph>Localisation: {item.localisation}</Paragraph>
        <Paragraph>Date et heure: {new Date(item.date).toLocaleString()}</Paragraph>
        <Paragraph>Nombre de participants: {item.seats}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleOpenModal(item)}>Voir</Button>
        <Button>Partager</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label="Recherche"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
        left={<TextInput.Icon name={() => <Icon name="search" size={20} />} />}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur: {error}</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.resultsList}
        />
      ) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
        </View>
      )}
      {selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedEvent.image }} style={styles.eventImageM} />
            <View style={styles.modalContent}>
              <Title>{selectedEvent.title}</Title>
              <Paragraph>{selectedEvent.description}</Paragraph>
              <Paragraph>Localisation: {selectedEvent.localisation}</Paragraph>
              <Paragraph>Date et heure: {new Date(selectedEvent.date).toLocaleString()}</Paragraph>
              <Paragraph>Nombre de participants: {selectedEvent.seats}</Paragraph>
            </View>
            <Card.Actions style={styles.btn_modale}>
              <Button onPress={() => setModalVisible(false)}>Fermer</Button>
              <Button>Reserver</Button>
            </Card.Actions>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  resultsList: {
    flex: 1,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: 'gray',
  },
  card: {
    marginBottom: 16,
  },
  eventImage: {
    margin: 5,
    width: 370,
    height: 200,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  eventImageM: {
    width: 330,
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalContent: {
    marginBottom: 20,
  },
  btn_modale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default SearchScreen;
