import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput, Button, Card, Text} from 'react-native-paper';
import {resetPassword} from '../service/api';

const EditPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const handleReset = async () => {
    if (password === cpassword) {
      try {
        const result = await resetPassword(email, password);
        if (result.success) {
          navigation.navigate('Connexion');
          setEmail('');
          setPassword('');
          setCpassword('');
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Erreur lors de la connexion');
      }
    } else {
      console.error('Les mots de passe ne correspondent pas');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Adresse E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        style={styles.input}
        right={<TextInput.Icon icon="email" />}
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
    justifyContent: 'center',
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
