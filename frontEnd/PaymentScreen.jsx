// screens/PaymentScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { API_URL } from '../service/api';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const route = useRoute();
  const { amount, reserveur, evenement_id } = route.params;
  const { confirmPayment, retrievePaymentIntent } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePayPress = async () => {
    console.log("PaymentScreen: handlePayPress called with amount:", amount);
    setLoading(true);
    console.log(amount, reserveur, evenement_id);

    try {
      // Créer un PaymentIntent sur votre serveur
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100, currency: 'usd' }), // montant en cents
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Network response error:', errorText);
        throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
      }

      const { clientSecret } = await response.json();
      console.log("Client Secret:", clientSecret);

      // Confirmer le paiement avec le clientSecret
      const { error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          // Informations de facturation optionnelles
          billingDetails: {
            email: 'user@example.com', // Remplacez par l'email réel de l'utilisateur
          },
        },
      });

      if (error) {
        console.log("Payment failed:", error.message);
        Alert.alert('Payment failed', error.message);
      } else {
        console.log("Payment successful");
        Alert.alert('Payment successful', 'Thank you for your purchase!');
        handleReserve ();
      }
    } catch (error) {
      console.log("Payment error:", error.message);
      Alert.alert('Payment error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reserveur,
          evenement_id,
          reservation_date: currentDate,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        Alert.alert('Succès', 'Réservation effectuée avec succès');
        navigation.navigate('ReservedTicketsScreen');
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la réservation de l'événement"
        );
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />
      <Button onPress={handlePayPress} loading={loading} mode="contained">
        Pay
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
});

export default PaymentScreen;
