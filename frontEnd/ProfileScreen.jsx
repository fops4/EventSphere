import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Text, Avatar, Button, Title} from 'react-native-paper';
import {useAuth} from '../service/AuthContext';
import {API_URL} from '../service/api';
import {useFocusEffect} from '@react-navigation/native';

const ProfileScreen = ({navigation, route}) => {
  const [userInfo, setUserInfo] = useState(route.params?.userInfo || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user, logout} = useAuth();

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      setError(error.message);
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigation.navigate('Connexion');
    } else {
      Alert.alert('Erreur', 'Déconnexion échouée. Veuillez réessayer.');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, []),
  );

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
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={100}
          source={
            userInfo && userInfo.selectedImage
              ? {uri: userInfo.selectedImage}
              : require('../images/Utilisateur.png')
          }
        />
        <Text style={styles.userName}>
          {userInfo?.username || 'Nom Utilisateur'}
        </Text>
        <Text style={styles.userEmail}>
          {userInfo?.email || 'Email non disponible'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateEventScreen')}>
        <Text style={styles.addButtonText}>+ Organiser</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>
        Personnalisez vos recommandations d'événements en fonction de vos
        intérêts.
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ville principale</Text>
        <Text style={styles.sectionContent}>Mfoundi</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditProfileScreen')}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Modifier le profil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditPasswordScreen')}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Modifier le Mot de passe</Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications push</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facebook</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> A propos</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evaluez-nous</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proposer des ameliorations</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mentions legales</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment utiliser l'application</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remerciements</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EventSphere</Text>
        <Text style={styles.sectionTitle}>Version 1.2.2</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.section}>
        <Title style={styles.sectionTitle}>Deconnexion</Title>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}></Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
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

export default ProfileScreen;
