// screens/PaymentScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { API_URL } from '../service/api';

const PaymentScreen = () => {
  const route = useRoute();
  const { amount } = route.params;
  const { confirmPayment, retrievePaymentIntent } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePayPress = async () => {
    console.log("PaymentScreen: handlePayPress called with amount:", amount);
    setLoading(true);

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
      }
    } catch (error) {
      console.log("Payment error:", error.message);
      Alert.alert('Payment error', error.message);
    } finally {
      setLoading(false);
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
