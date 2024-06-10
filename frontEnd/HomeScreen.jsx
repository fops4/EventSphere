import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import {
  Card,
  IconButton,
  Title,
  Paragraph,
  Button,
  Appbar,
} from 'react-native-paper';
import {API_URL} from '../service/api';

const EventItem = ({event}) => {
  const {
    type,
    date,
    title,
    localisation,
    description,
    subscribers,
    image,
    seats,
    amount,
  } = event;
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleReserve = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          reserveur: userInfo.id,
          evenement_id: event.id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        Alert.alert('Succès', 'Réservation effectuée avec succès');
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la réservation de l'événement",
        );
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Événement : ${title}\nDate : ${new Date(
          date,
        ).toLocaleString()}\nLocalisation : ${localisation}\nDescription : ${description}`,
        url: image,
        title: 'Partager cet événement',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors du partage');
    }
  };

  return (
    <View style={styles.section}>
      <Card style={styles.card}>
        <Card.Content style={styles.btn_modale}>
          <Title>{title}</Title>
          <Title>{type}</Title>
        </Card.Content>
        <Card.Cover source={{uri: image}} style={styles.eventImage} />
        <Card.Content>
          <Paragraph>{localisation}</Paragraph>
          <Paragraph>{new Date(date).toLocaleString()}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => setModalVisible(true)}>Voir</Button>
          <Button onPress={handleShare}>Partager</Button>
        </Card.Actions>
      </Card>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Image source={{uri: image}} style={styles.eventImageM} />
          <Card.Content style={styles.brakes}>
            <Card style={styles.brake}>
              <Paragraph>Plus vite</Paragraph>
            </Card>
            <Card style={styles.brake}>
              <Paragraph>Toutes les places seront bientôt réservées</Paragraph>
            </Card>
          </Card.Content>
          <View style={styles.zones}>
            <Title>{type}</Title>
          </View>
          <Card.Content style={styles.btn_modale}>
            <Title style={styles.titre}>{title}</Title>
          </Card.Content>
          <Card.Content style={styles.btn}>
            <IconButton icon="calendar" color="orange" size={24} />
            <View style={styles.zone}>
              <Paragraph>{new Date(date).toLocaleString()}</Paragraph>
            </View>
          </Card.Content>
          <Card.Content style={styles.btn}>
            <IconButton icon="map-marker" color="green" size={24} />
            <View style={styles.zone}>
              <Paragraph>{localisation}</Paragraph>
            </View>
          </Card.Content>
          <Card.Content style={styles.btn}>
            <IconButton icon="currency-usd" color="green" size={24} />
            <View style={styles.zone}>
              <Paragraph>{amount} FCFA</Paragraph>
            </View>
          </Card.Content>
          <Card.Content style={styles.description}>
            <Paragraph style={styles.tests}>
              À propos de cet événement
            </Paragraph>
            <Paragraph>{description}</Paragraph>
          </Card.Content>
          <Card.Content style={styles.btn_modale}>
            <Title>{seats} participants</Title>
          </Card.Content>
          <Card.Actions style={styles.btn_modale}>
            <Button onPress={() => setModalVisible(false)}>Fermer</Button>
            <Button onPress={handleReserve}>Réserver</Button>
          </Card.Actions>
        </View>
      </Modal>
    </View>
  );
};

const HomeScreen = ({route, navigation, title = 'Title'}) => {
  const [userInfo, setUserInfo] = useState(route.params?.userInfo || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const logoSource = require('../images/logo.png');

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userInfo?.id) return;

      try {
        const response = await fetch(
          `${API_URL}/evenements/non-createur/${userInfo.id}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await response.json();
        if (response.ok) {
          setEvents(data.evenements);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userInfo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.logos}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.Action icon="menu" />
        <Appbar.Content />
      </Appbar.Header>
      <FlatList
        data={events}
        renderItem={({item}) => <EventItem event={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
  },
  logos: {
    width: 60,
    height: 60,
    marginRight: 280,
    backgroundColor: 'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    marginBottom: 16,
  },
  resultsList: {
    flex: 1,
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
  userInfo: {
    marginBottom: 20,
  },
  userText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
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

export default HomeScreen;
