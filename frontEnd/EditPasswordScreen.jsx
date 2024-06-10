import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {TextInput, Button, Card, Text} from 'react-native-paper';
import {resetPassword, API_URL} from '../service/api';

const EditPasswordScreen = ({route}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const [userInfo, setUserInfo] = useState(route.params?.userInfo || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch user info from backend
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include', // This will send cookies with the request
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
        } else {
          throw new Error('Failed to fetch user info');
        }
      } catch (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);


  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  const handleReset = async () => {
    if (password === cpassword) {
      try {
        const result = await resetPassword(userInfo.email, password);
        if (result.success) {
          navigation.navigate('Profile');
          setEmail('');
          setPassword('');
          setCpassword('');
        } else {
          setError(result.message);
        }
      } catch (error) {
        navigation.navigate('Profile');
        setError('Erreur lors de la connexion');
      }
    } else {
      console.error('Les mots de passe ne correspondent pas');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Ancien mot de passe"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        style={styles.input}
        right={<TextInput.Icon icon="eye" />}
      />
      <TextInput
        label="Nouveau mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        right={<TextInput.Icon icon="eye" />}
      />
      <TextInput
        label="Confirmer mot de passe"
        value={cpassword}
        onChangeText={setCpassword}
        secureTextEntry
        style={styles.input}
        right={<TextInput.Icon icon="eye" />}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleReset}>
        <Text style={styles.saveButtonText}>Sauvegarder les modifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  card: {
    width: '100%',
  },
  texte: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  texte1: {
    marginRight: 5,
  },
  texte2: {
    color: 'blue',
  },
  saveButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default EditPasswordScreen;
