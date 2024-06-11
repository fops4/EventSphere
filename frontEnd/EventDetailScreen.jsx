import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '../service/api';
import { LineChart } from 'react-native-chart-kit';
import { FlatList } from 'react-native';

const EventDetailScreen = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { eventId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Event Details
        const eventResponse = await fetch(`${API_URL}/evenement/${eventId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!eventResponse.ok) {
          throw new Error(`Erreur: ${await eventResponse.text()}`);
        }

        const eventDetailsData = await eventResponse.json();
        setEventDetails(eventDetailsData.evenement);

        // Fetch Statistics
        const statsResponse = await fetch(`${API_URL}/evenement/${eventId}/statistiques`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!statsResponse.ok) {
          throw new Error(`Erreur: ${await statsResponse.text()}`);
        }

        const statisticsData = await statsResponse.json();
        setStatistics(statisticsData);

        // Fetch Reservations
        const reservationsResponse = await fetch(`${API_URL}/evenement/${eventId}/reservations`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!reservationsResponse.ok) {
          throw new Error(`Erreur: ${await reservationsResponse.text()}`);
        }

        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData.reservations);
      } catch (error) {
        setError(error.message);
        Alert.alert('Erreur', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handlePayPress = () => {
    if (eventDetails && eventDetails.amount) {
      navigation.navigate('PaymentScreen', { amount: eventDetails.amount });
    } else {
      Alert.alert('Erreur', "Le montant de l'événement n'est pas défini");
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

  const data = [
    { type: 'details' },
    { type: 'chart' },
    ...reservations.map((res, index) => ({ type: 'reservation', data: res, key: `res-${index}` }))
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'details':
        return (
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
        );
      case 'chart':
        return (
          statistics && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Évolution des inscriptions</Text>
              <LineChart
                data={{
                  labels: statistics.dailySubscriptions.map(ds => ds.date),
                  datasets: [
                    {
                      data: statistics.dailySubscriptions.map(ds => ds.subscriptions),
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 30}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          )
        );
      case 'reservation':
        return (
          <View style={styles.reservationItem}>
            <Text style={styles.reservationName}>{item.data.username}</Text>
            <Text style={styles.reservationEmail}>{item.data.email}</Text>
            <Text style={styles.reservationDate}>
              Date de réservation: {new Date(item.data.reservation_date).toLocaleString()}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
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
  chartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reservationItem: {
    marginBottom: 16,
  },
  reservationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reservationEmail: {
    fontSize: 14,
    color: 'gray',
  },
  reservationDate: {
    fontSize: 14,
    color: 'gray',
  },
});

export default EventDetailScreen;
