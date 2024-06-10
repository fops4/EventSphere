import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {TextInput, Button, Card, Text} from 'react-native-paper';
import {connecterUtilisateur} from './../service/api';

const Connexion = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const result = await connecterUtilisateur(email, password);
      if (result.success) {
        setEmail('');
        setPassword('');
        navigation.navigate('Main');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erreur lors de la connexion');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Image style={styles.test} source={require('../images/test.png')} />
        <Text style={styles.slogan}>
          Plongez dans le monde des événements exceptionnels avec EventSphere
        </Text>
        <Card.Content>
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}
            style={styles.password}>
            <Text style={styles.texte2}>mot de passe oublie ?</Text>
          </TouchableOpacity>
          <View style={styles.texte}>
            <Text style={styles.texte1}>
              Vous n'avez pas encore de compte ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Inscription')}>
              <Text style={styles.texte2}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Connexion
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
  test: {
    marginTop: 10,
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 10,
  },
  slogan: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
  password: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Connexion;
