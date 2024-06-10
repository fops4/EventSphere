import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { TextInput, Card, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import { API_URL } from '../service/api';

const EditEventScreen = ({ route, navigation }) => {
  const { eventId } = route.params;

  const [title, setTitle] = useState('');
  const [type, setType] = useState('free');
  const [amount, setAmount] = useState(0);
  const [privacy, setPrivacy] = useState('public');
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeStart, setTimeStart] = useState(new Date());
  const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [showTimeEndPicker, setShowTimeEndPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [localisation, setLocalisation] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/evenement/${eventId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.evenement) {
          const event = data.evenement;
          setTitle(event.title || '');
          setType(event.type || 'free');
          setAmount(event.amount || 0); // Ensure amount is numeric
          setPrivacy(event.privacy || 'public');
          setDescription(event.description || '');
          setSeats(event.seats || '');
          setDate(new Date(event.date || new Date()));
          setTimeStart(new Date(event.timeStart || new Date()));
          setTimeEnd(new Date(event.timeEnd || new Date()));
          setImage(event.image || null);
          setLocalisation(event.localisation || '');
        } else {
          setError(data.message || "Erreur lors de la récupération des données de l'événement");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const validateFields = () => {
    if (!title || !description || !localisation || !date || !timeStart || !timeEnd || !seats || !type) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (type === 'paid' && (!amount || amount <= 0)) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide pour les événements payants');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const updatedEvent = {
      title,
      type,
      amount: parseFloat(amount) || 0, // Ensure amount is a number
      privacy,
      description,
      seats: parseInt(seats) || 0, // Ensure seats is a number
      date: date.toISOString(),
      timeStart: timeStart.toISOString(),
      timeEnd: timeEnd.toISOString(),
      image,
      localisation,
    };

    try {
      const response = await fetch(`${API_URL}/api/evenements/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Événement modifié avec succès');
        navigation.goBack();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const selectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeStartChange = (event, selectedTime) => {
    const currentTime = selectedTime || timeStart;
    setShowTimeStartPicker(false);
    setTimeStart(currentTime);
  };

  const handleTimeEndChange = (event, selectedTime) => {
    const currentTime = selectedTime || timeEnd;
    setShowTimeEndPicker(false);
    setTimeEnd(currentTime);
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

  return (
    <ScrollView style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.saveButton} onPress={selectImage}>
        <Text style={styles.saveButtonText}>Choisir la photo</Text>
      </TouchableOpacity>

      <Text>Type</Text>
      <Card>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Gratuit" value="free" />
          <Picker.Item label="Payant" value="paid" />
        </Picker>
      </Card>
      {type === 'paid' && (
        <TextInput
          style={styles.input}
          placeholder="Montant"
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={value => setAmount(value ? parseFloat(value) : '')}
        />
      )}

      <Text>Confidentialité</Text>
      <Card>
        <Picker
          selectedValue={privacy}
          onValueChange={(itemValue) => setPrivacy(itemValue)}
        >
          <Picker.Item label="Public" value="public" />
          <Picker.Item label="Privé" value="private" />
        </Picker>
      </Card>

      <TextInput
        style={styles.input}
        placeholder="Titre de l'événement"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Localisation"
        value={localisation}
        onChangeText={setLocalisation}
      />

      <Text>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Sélectionner une date"
          value={date.toDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text>Heure de début</Text>
      <TouchableOpacity onPress={() => setShowTimeStartPicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Sélectionner une heure de début"
          value={timeStart.toLocaleTimeString()}
          editable={false}
        />
      </TouchableOpacity>
      {showTimeStartPicker && (
        <DateTimePicker
          value={timeStart}
          mode="time"
          display="default"
          onChange={handleTimeStartChange}
        />
      )}

      <Text>Heure de fin</Text>
      <TouchableOpacity onPress={() => setShowTimeEndPicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Sélectionner une heure de fin"
          value={timeEnd.toLocaleTimeString()}
          editable={false}
        />
      </TouchableOpacity>
      {showTimeEndPicker && (
        <DateTimePicker
          value={timeEnd}
          mode="time"
          display="default"
          onChange={handleTimeEndChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Nombre de places"
        keyboardType="numeric"
        value={seats.toString()}
        onChangeText={value => setSeats(value ? parseInt(value) : '')}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Modifier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 20,
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

export default EditEventScreen;
