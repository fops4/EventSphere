import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { Card, IconButton, Title, Paragraph, Button } from 'react-native-paper';

const EventItem = ({ navigation, event }) => {
  const { type, date, title, localisation, description, subscribers, image, amount, seats } = event;
  const [modalVisible, setModalVisible] = useState(false);

  const handleReserve = async () => {
    navigation.navigate('Connexion');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Événement : ${title}\nDate : ${new Date(date).toLocaleString()}\nLocalisation : ${localisation}\nDescription : ${description}`,
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
        <Card.Cover source={{ uri: image }} style={styles.eventImage} />
        <Card.Content>
          <Paragraph>Localisation: {localisation}</Paragraph>
          <Paragraph>Date et heure: {new Date(date).toLocaleString()}</Paragraph>
          <Paragraph>Nombre de participants: {subscribers}</Paragraph>
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
          <Image source={{ uri: image }} style={styles.eventImageM} />
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  btn_modale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  brakes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 230,
    right: -15,
  },
  brake: {
    margin: 5,
    padding: 3,
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

export default EventItem;
