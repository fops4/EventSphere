import axios from 'axios';

export const API_URL = 'http://192.168.134.47:3000/api';


export const creerUtilisateur = async (selectedImage, username, email, password) => {
  console.log( selectedImage, username, email, password)
  try {
    const response = await axios.post(`${API_URL}/signUp`, {
      selectedImage,
      username,
      email,
      password
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur';
    return { success: false, message: errorMessage };
  }
};

export const connecterUtilisateur = async (email, password) => {
  console.log(email, password)
  try {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion de l\'utilisateur';
    return { success: false, message: errorMessage };
  }
};

export const resetPassword = async (email, password) => {
  
  try {
    const response = await axios.post(`${API_URL}/resetpassword`, {
      email,
      password
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur lors de la renitialisation du mot de passe';
    return { success: false, message: errorMessage };
  }
};

export const updateProfile = async (email, username, selectedImage) => {
  
  try {
    const response = await axios.post(`${API_URL}/updateprofile`, {
      email, username, selectedImage
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur lors de la mise a jour';
    return { success: false, message: errorMessage };
  }
};

export const creerEvenement = async (event) => {
  console.log('Données envoyées:', event);

  try {
    const response = await axios.post(`${API_URL}/creerevenement`, event);
    console.log('Réponse serveur:', response.data);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Erreur serveur:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Erreur lors de la création de l\'événement';
    return { success: false, message: errorMessage };
  }
};