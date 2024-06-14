import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  RefreshControl,
  FlatList,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { API_URL } from '../service/api';

const FavoritesScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState(route.params?.userInfo || null);
  const [events, setEvents] = useState([]);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    if (!userInfo?.id) return;
    setLoadingEvents(true); // Set loading true before fetching
    try {
      const response = await fetch(`${API_URL}/evenements/${userInfo.id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data.evenements);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingEvents(false); // Set loading false after fetching
    }
  };

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
      setLoadingUserInfo(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [userInfo])
  );
  const handleShare = async event => {
    try {
      await Share.share({
        message: `Événement : ${event.title}\nDate : ${new Date(
          event.date,
        ).toLocaleString()}\nLocalisation : ${
          event.localisation
        }\nDescription : ${event.description}`,
        url: event.image,
        title: 'Partager cet événement',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors du partage');
    }
  };

  const handleEdit = eventId => {
    navigation.navigate('EditEventScreen', {eventId});
  };

  const handleDelete = async eventId => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cet événement?',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/evenements/${eventId}`, {
                method: 'DELETE',
                credentials: 'include',
              });
              if (response.ok) {
                setEvents(events.filter(event => event.id !== eventId));
                Alert.alert('Succès', 'Événement supprimé avec succès');
              } else {
                const data = await response.json();
                Alert.alert('Erreur', data.message);
              }
            } catch (error) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ],
    );
  };

  const handleViewDetails = eventId => {
    navigation.navigate('EventDetailScreen', {eventId});
  };

  if (loadingUserInfo || loadingEvents) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setLoadingEvents}>
          <Text style={styles.sectionTitle}>Mes événements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate('CreateEventScreen')}>
          <Text style={styles.saveButtonText}>Organiser</Text>
        </TouchableOpacity>
        <View style={styles.section}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.container} >
        <Text style={styles.sectionTitle}>Mes événements</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate('CreateEventScreen')}>
          <Text style={styles.saveButtonText}>Organiser</Text>
        </TouchableOpacity>
        <View style={styles.section}>
          {events.length > 0 ? (
            events.map(item => (
              <Card key={item.id} style={styles.card}>
                <Card.Cover source={{uri: item.image}} />
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Paragraph>
                    Date: {new Date(item.date).toLocaleString()}
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => handleShare(item)}>Partager</Button>
                  <Button
                    style={styles.bts}
                    onPress={() => handleEdit(item.id)}>
                    Modifier
                  </Button>
                  <Button
                    style={styles.btss}
                    onPress={() => handleDelete(item.id)}>
                    Supprimer
                  </Button>
                  <Button>Voir les détails</Button>
                </Card.Actions>
              </Card>
            ))
          ) : (
            <Text>Aucun événement trouvé</Text>
          )}
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  bts: {
    backgroundColor: 'green',
  },
  btss: {
    backgroundColor: 'red',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
