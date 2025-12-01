// API Configuration
import { Platform } from 'react-native';

export const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api'
  : 'http://169.254.194.154:3000/api';

// Change this to your actual backend IP address
// For Android emulator use: http://10.0.2.2:3000/api
// For iOS simulator use: http://localhost:3000/api
// For real device use: http://YOUR_COMPUTER_IP:3000/api

export const COLORS = {
  primary: '#2196F3',
  secondary: '#FF9800',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FFC107',
  info: '#00BCD4',
  light: '#F5F5F5',
  dark: '#212121',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  border: '#E0E0E0',
};

export const PROPERTY_TYPES = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  VILLA: 'Villa',
  LAND: 'Terrain',
  OFFICE: 'Bureau',
  COMMERCIAL: 'Local Commercial',
};

export const TRANSACTION_TYPES = {
  SALE: 'Vente',
  RENT: 'Location',
  SEASONAL_RENT: 'Location Saisonnière',
};

export const CITIES = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Sousse',
  'Sfax',
  'Monastir',
  'Bizerte',
  'Gabès',
  'Kairouan',
  'Mahdia',
  'Gafsa',
  'Kasserine',
  'Béja',
  'Jendouba',
  'Le Kef',
  'Siliana',
  'Zaghouan',
  'Medenine',
  'Tataouine',
  'Tozeur',
  'Kebili',
  'Sidi Bouzid',
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return new Date(date).toLocaleDateString('fr-FR');
};
