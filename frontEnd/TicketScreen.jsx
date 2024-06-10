import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { API_URL } from '../service/api';

const TicketScreen = ({ navigation, route }) => {
  const { reservationId } = route.params;
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setReservation(data.reservation);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur lors de la récupération des détails de la réservation");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId]);

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
    <ScrollView style={styles.container}>
      {reservation && (
        <Card style={styles.ticketCard}>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={`${API_URL}/reservations/${reservation.id}`}
              size={120}
            />
          </View>
          <Card.Content style={styles.content}>
            <Avatar.Image size={60} source={{ uri: reservation.image }} style={styles.avatar} />
            <Title>{reservation.username}</Title>
            <Paragraph>Billet / place: Admission générale</Paragraph>
            <Title style={styles.eventTitle}>{reservation.title}</Title>
            <Paragraph>Date: {new Date(reservation.date).toLocaleString()}</Paragraph>
            <Paragraph>Localisation: {reservation.localisation}</Paragraph>
            <Paragraph>Résumé événement: {reservation.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('AddToCalendar', { reservation })}>
              Ajouter au calendrier
            </Button>
            <Button onPress={() => Alert.alert('Commande:', reservation.commandeId)}>
              Numéro de commande: {reservation.commandeId}
            </Button>
          </Card.Actions>
          <Card.Actions>
            <Button onPress={() => Alert.alert('Voir plus')}>
              Voir plus
            </Button>
            <Button onPress={() => navigation.navigate('CancelReservation', { reservationId })}>
              Annuler
            </Button>
          </Card.Actions>
        </Card>
      )}
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
  ticketCard: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  eventTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TicketScreen;
