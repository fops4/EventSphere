import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {TextInput, Button, Card, Text} from 'react-native-paper';
import {creerUtilisateur} from '../service/api';

const Inscription = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('null');

  const handleSignIn = async () => {
    if (password === cpassword) {
      try {
        const result = await creerUtilisateur(
          selectedImage,
          username,
          email,
          password,
        );
        if (result.success) {
          navigation.navigate('Main');
          setUsername('');
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
      <Card style={styles.card}>
        <Image style={styles.test} source={require('../images/test.png')} />
        <Text style={styles.slogan}>
          Créez, partagez et vivez des expériences inoubliables avec EventSphere
          !
        </Text>
        <Card.Content>
          <TextInput
            label="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
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
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            right={<TextInput.Icon icon="eye" />}
          />
          <TextInput
            label="Confirmer"
            value={cpassword}
            onChangeText={setCpassword}
            secureTextEntry
            style={styles.input}
            right={<TextInput.Icon icon="eye" />}
          />
          <View style={styles.texte}>
            <Text style={styles.texte1}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
              <Text style={styles.texte2}>Connexion</Text>
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={handleSignIn} style={styles.button}>
            S'inscrire
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  slogan: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  test: {
    marginTop: 10,
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 10,
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
});

export default Inscription;
