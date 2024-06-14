// Chemin : /src/screens/ReservedTicketsScreen.js
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  Share,
  TouchableOpacity,
} from 'react-native';
import {Text, Card, Title, Paragraph, Button} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import {API_URL} from '../service/api';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const ReservedTicketsScreen = ({navigation}) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const viewShotRef = useRef(); // Référence pour capturer la vue


    const fetchData = async () => {
      try {
        const userResponse = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(
            `Échec de la récupération des infos utilisateur : ${errorText}`,
          );
        }

        const userData = await userResponse.json();
        setUserInfo(userData.user);

        const reservationsResponse = await fetch(
          `${API_URL}/mes-reservations/${userData.user.id}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!reservationsResponse.ok) {
          const errorText = await reservationsResponse.text();
          throw new Error(
            `Échec de la récupération des réservations : ${errorText}`,
          );
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


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Gestion de l'annulation de la réservation
  const handleCancelReservation = async reservationId => {
    console.log(reservationId);
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erreur lors de l'annulation de la réservation : ${errorText}`,
        );
      }

      setReservations(reservations.filter(res => res.id !== reservationId));
      Alert.alert('Succès', 'Réservation annulée avec succès');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  // Gestion de l'affichage du ticket
  const handleViewTicket = reservation => {
    setSelectedTicket(reservation);
    setModalVisible(true);
  };

  // Gestion de la fermeture du modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  // Gestion du paiement
  const handlePayPress = amount => {
    if (amount) {
      navigation.navigate('PaymentScreen', {amount});
    } else {
      Alert.alert('Erreur', "Le montant de l'événement n'est pas défini");
    }
  };

  // Fonction pour capturer et exporter en PDF
  const captureAndSharePDF = async () => {
    try {
      console.log('Début de la capture de la vue...');
      const uri = await viewShotRef.current.capture(); // Capture la vue en image
      console.log("URI de l'image capturée:", uri);

      const pdfPath = await createPDF(uri); // Crée le PDF à partir de l'image
      console.log('Chemin du fichier PDF:', pdfPath);

      await Share.share({url: `file://${pdfPath}`}); // Partage le PDF
      console.log('Partage du PDF réussi');
    } catch (error) {
      console.error('Erreur lors de la capture ou du partage:', error);
      Alert.alert('Erreur', "Échec de la capture ou du partage de l'image");
    }
  };

  // Fonction pour créer un PDF
  const createPDF = async imagePath => {
    try {
      const base64Image = await RNFS.readFile(imagePath, 'base64');
      const htmlContent = `
        <html>
        <body style="text-align: center; font-family: Arial, sans-serif;">
          <h1>${selectedTicket.title}</h1>
          <p>${new Date(selectedTicket.date).toLocaleString()}</p>
          <p>${selectedTicket.description}</p>
          <p>${selectedTicket.localisation}</p>
          <p>Nom: ${userInfo.username}</p>
          <div style="text-align: center; margin-top: 20px;">
            <img src="data:image/png;base64,${base64Image}" style="width:200px; height:200px;"/>
          </div>
        </body>
        </html>`;

      const options = {
        html: htmlContent,
        fileName: 'ticket',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      return file.filePath;
    } catch (error) {
      console.error('Erreur lors de la création du PDF:', error);
      throw error;
    }
  };

  // Fonction pour capturer le QR code
  const captureQRCode = async () => {
    return new Promise((resolve, reject) => {
      viewShotRef.current
        .capture()
        .then(uri => {
          RNFS.readFile(uri, 'base64').then(resolve).catch(reject);
        })
        .catch(reject);
    });
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
        <Text style={styles.errorText}>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() =>setLoading}>
        <Text style={styles.sectionTitle}>Mes réservations</Text>
      </TouchableOpacity>
      {reservations.length > 0 ? (
        reservations.map(res => (
          <Card key={res.id} style={styles.card}>
            <Card.Cover source={{uri: res.image}} />
            <Card.Content>
              <Title>{res.title}</Title>
              <Paragraph>
                Date : {new Date(res.date).toLocaleString()}
              </Paragraph>
              <Paragraph>Description : {res.description}</Paragraph>
              <Paragraph>Localisation : {res.localisation}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCancelReservation(res.id)}>
                Annuler
              </Button>
              <Button onPress={() => handleViewTicket(res)}>
                Voir le ticket
              </Button>
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Text>Aucune réservation trouvée</Text>
      )}

      {selectedTicket && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}>
          <View style={styles.modalContainer}>
            <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
              <Card style={styles.modalCard}>
                <Card.Content>
                  <View style={styles.qrCodeContainer}>
                    <QRCode value={selectedTicket.id.toString()} size={200} />
                  </View>
                  <Text style={styles.ticketHeader}>Nom</Text>
                  <Text style={styles.ticketContent}>{userInfo.username}</Text>
                  <Text style={styles.ticketHeader}>Billet / place</Text>
                  <Text style={styles.ticketContent}>Admission générale</Text>
                  <Text style={styles.ticketHeader}>Événement</Text>
                  <Text style={styles.ticketContent}>
                    {selectedTicket.title}
                  </Text>
                  <Text style={styles.ticketHeader}>Date</Text>
                  <Text style={styles.ticketContent}>
                    {new Date(selectedTicket.date).toLocaleString()}
                  </Text>
                  <Text style={styles.ticketHeader}>Localisation</Text>
                  <Text style={styles.ticketContent}>
                    {selectedTicket.localisation}
                  </Text>
                  <Text style={styles.ticketHeader}>Résumé événement</Text>
                  <Text style={styles.ticketContent}>
                    {selectedTicket.description}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={captureAndSharePDF}>Exporter en PDF</Button>
                  <Button onPress={handleCloseModal}>Fermer</Button>
                </Card.Actions>
              </Card>
            </ViewShot>
          </View>
        </Modal>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ticketContent: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ReservedTicketsScreen;
