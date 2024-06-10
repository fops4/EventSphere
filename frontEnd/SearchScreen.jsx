import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  Share
} from 'react-native';
import { TextInput, Card, Title, Paragraph, Text, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../service/api';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
        } else {
          throw new Error('Failed to fetch user info');
        }
      } catch (error) {
        setError(error.message);
        Alert.alert('Erreur', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleReserve = async (eventId) => {
    if (!userInfo) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reserveur: userInfo.id,
          evenement_id: eventId,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        Alert.alert('Succès', 'Réservation effectuée avec succès');
        setModalVisible(false); // Close the modal after successful reservation
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la réservation de l'événement");
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/recherche?query=${encodeURIComponent(query)}`, {
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

  const handleShare = async (event) => {
    try {
      await Share.share({
        message: `Événement : ${event.title}\nDate : ${new Date(event.date).toLocaleString()}\nLocalisation : ${event.localisation}\nDescription : ${event.description}`,
        url: event.image,
        title: 'Partager cet événement'
      });
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors du partage');
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
        <Button onPress={() => handleShare(item)}>Partager</Button>
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
        <Image source={{uri: selectedEvent.image}} style={styles.eventImageM} />
        <Card.Content style={styles.brakes}>
          <Card style={styles.brake}>
            <Paragraph>Plus vite</Paragraph>
          </Card>
          <Card style={styles.brake}>
            <Paragraph>Toutes les places seront bientôt réservées</Paragraph>
          </Card>
        </Card.Content>
        <View style={styles.zones}>
          <Title>{selectedEvent.type}</Title>
        </View>
        <Card.Content style={styles.btn_modale}>
          <Title style={styles.titre}>{selectedEvent.title}</Title>
        </Card.Content>
        <Card.Content style={styles.btn}>
          <IconButton icon="calendar" color="orange" size={24} />
          <View style={styles.zone}>
            <Paragraph>{selectedEvent.date}</Paragraph>
          </View>
        </Card.Content>
        <Card.Content style={styles.btn}>
          <IconButton icon="map-marker" color="green" size={24} />
          <View style={styles.zone}>
            <Paragraph>{selectedEvent.localisation}</Paragraph>
          </View>
        </Card.Content>
        <Card.Content style={styles.btn}>
          <IconButton icon="currency-usd" color="green" size={24} />
          <View style={styles.zone}>
            <Paragraph>{selectedEvent.amount}</Paragraph>
          </View>
        </Card.Content>
        <Card.Content style={styles.description}>
          <Paragraph style={styles.tests}>
            À propos de cet événement
          </Paragraph>
          <Paragraph>{selectedEvent.description}</Paragraph>
        </Card.Content>

        <Card.Content style={styles.btn_modale}>
          <Title>{selectedEvent.seats} participants</Title>
        </Card.Content>
        <Card.Actions style={styles.btn_modale}>
          <Button onPress={() => setModalVisible(false)}>Fermer</Button>
          <Button onPress={() => handleReserve(selectedEvent.id)}>Réserver</Button>
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
  card: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    marginBottom: 16,
  },
  cards: {
    marginBottom: 16,
  },
  event: {
    flexDirection: 'row',
  },
  eventIm: {
    width: '30%',
    height: '100%',
  },
  eventIn: {
    width: '70%',
    height: '100%',
  },
  eventImage: {
    margin: 5,
    width: 370,
    height: 200,
  },
  eventImageM: {
    width: 330,
    height: 200,
    marginBottom: 50,
    borderRadius: 5,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  btn_modale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flexDirection: 'row',
  },
  zones: {
    backgroundColor: 'green',
    padding: 5,
    marginTop: 8,
    borderRadius: 5,
    position: 'absolute',
    top: 12,
    right: 22,
  },
  zone: {
    marginTop: 15,
  },
  brake: {
    margin: 5,
    padding: 3,
  },
  brakes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 230,
    right: -15,
  },
  titre: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#000',
  },
  tests: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    marginTop: 10,
  },
});

export default SearchScreen;
