import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Button, Appbar} from 'react-native-paper';
import {API_URL} from '../service/api';
import EventItem from './EventItem'; // Assuming EventItem is in the same directory

const AccueilScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const logoSource = require('../images/logo.png');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/evenements`, {
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
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <View style={styles.logos}>
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Button
            style={styles.btss}
            onPress={() => navigation.navigate('Connexion')}>
            Se connecter
          </Button>
          <Appbar.Content />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <View style={styles.logos}>
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Button
            style={styles.btss}
            onPress={() => navigation.navigate('Connexion')}>
            Se connecter
          </Button>
          <Appbar.Content />
        </Appbar.Header>
        <FlatList
          data={events}
          renderItem={({item}) => (
            <EventItem event={item} navigation={navigation} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
  },
  logos: {
    width: 60,
    height: 60,
    marginRight: 200,
    backgroundColor: 'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  btss: {
    backgroundColor: 'green',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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

export default AccueilScreen;
