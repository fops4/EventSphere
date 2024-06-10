




// TicketDetailsScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const TicketDetailsScreen = ({ route, navigation }) => {
  const { ticket } = route.params;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{ticket.title}</Title>
          <Paragraph>{ticket.description}</Paragraph>
          <Card.Cover source={ticket.imageUrl} style={styles.image} />
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Retour
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    marginTop: 16,
    width: '100%',
    height: 200,
  },
  button: {
    marginTop: 16,
  },
});

export default TicketDetailsScreen;
