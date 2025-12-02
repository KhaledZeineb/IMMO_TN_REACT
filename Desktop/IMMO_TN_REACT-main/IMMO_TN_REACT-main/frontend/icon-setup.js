// Icon setup for React Native Paper on Web
// This file configures icon providers for react-native-paper

import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Map react-native-vector-icons to @expo/vector-icons for web
  const MaterialCommunityIcons = require('@expo/vector-icons/MaterialCommunityIcons').default;
  const MaterialIcons = require('@expo/vector-icons/MaterialIcons').default;
  
  // Make icons available globally for react-native-paper
  if (typeof window !== 'undefined') {
    window.MaterialCommunityIcons = MaterialCommunityIcons;
    window.MaterialIcons = MaterialIcons;
  }
}

export default {};
