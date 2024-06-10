// screens/EventDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../service/api';

const Etc = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const eventId = 6;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/evenement/${eventId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setEventDetails(data.evenement);
        } else {
          const errorText = await response.text();
          console.error('Fetch event details error:', errorText);
          throw new Error(`Failed to fetch event details: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        setError(error.message);
        Alert.alert('Erreur', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, []);

  const handlePayPress = () => {
    console.log("EventDetailsScreen: handlePayPress called");
    if (eventDetails && eventDetails.amount) {
      console.log("Navigating to PaymentScreen with amount:", eventDetails.amount);
      navigation.navigate('PaymentScreen', { amount: eventDetails.amount });
    } else {
      Alert.alert('Erreur', 'Le montant de l\'événement n\'est pas défini');
    }
  };

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

  if (!eventDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Détails de l'événement non disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: eventDetails.image }} style={styles.eventImage} />
        <Card.Content>
          <Title>{eventDetails.title}</Title>
          <Paragraph>{eventDetails.description}</Paragraph>
          <Paragraph>Localisation: {eventDetails.localisation}</Paragraph>
          <Paragraph>Date et heure: {new Date(eventDetails.date).toLocaleString()}</Paragraph>
          <Paragraph>Prix: {eventDetails.amount} FCFA</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handlePayPress}>Payer</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  card: {
    marginBottom: 16,
  },
  eventImage: {
    height: 200,
    marginBottom: 16,
  },
});

export default Etc;
