import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TextInput, Button, Card, Text, IconButton, Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import { updateProfile, API_URL } from '../service/api';

const EditProfileScreen = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(route.params?.userInfo || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

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
          setUsername(data.user.username); // Set initial username
          setEmail(data.user.email); // Set initial email
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

  const handleImageUpload = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    })
      .then(response => {
        setSelectedImage(response.path);
      })
      .catch(error => {
        console.log('Erreur ImagePicker : ', error);
      });
  };

  const handleCameraPhoto = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
    })
      .then(response => {
        setSelectedImage(response.path);
      })
      .catch(error => {
        console.log('Erreur ImagePicker : ', error);
      });
  };

  const handleSave = async () => {
    console.log(userInfo.email, username, selectedImage);
    try {
      const result = await updateProfile(userInfo.email, username, selectedImage);
      if (result.success) {
        navigation.navigate('Profile');
        setEmail('');
        setUsername('');
        setSelectedImage(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour du profil');
    }
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
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
      {selectedImage && (
          <View style={styles.videoView}>
            <Image source={{ uri: selectedImage }} style={styles.profileImage} />
          </View>
        )}
        <Avatar.Image
          size={100}
          source={
            userInfo?.selectedImage
              ? { uri: userInfo.selectedImage }
              : require('../images/Utilisateur.png')
          }
        />
        <Text style={styles.updateImageText}>Actualiser l'image</Text>
        <TouchableOpacity style={styles.btn_cu}>
          <IconButton
            icon="camera-outline"
            color="red"
            size={24}
            onPress={handleCameraPhoto}
          />
          <IconButton
            icon="upload-outline"
            color="red"
            size={24}
            onPress={handleImageUpload}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  updateImageText: {
    color: '#007bff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
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
  btn_cu: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default EditProfileScreen;
