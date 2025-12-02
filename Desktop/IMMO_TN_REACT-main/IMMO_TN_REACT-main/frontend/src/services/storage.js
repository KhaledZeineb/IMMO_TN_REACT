import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In-memory fallback when localStorage is blocked by tracking prevention
let memoryStorage = {};

const storage = {
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          // Tracking prevention blocked localStorage, use memory
          console.warn('localStorage blocked, using memory fallback');
          memoryStorage[key] = value;
        }
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
      memoryStorage[key] = value;
    }
  },

  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        try {
          const item = localStorage.getItem(key);
          if (item) return item;
          // Fall back to memory if localStorage is empty
          return memoryStorage[key] || null;
        } catch (e) {
          // Tracking prevention blocked localStorage, use memory
          console.warn('localStorage blocked, using memory fallback');
          return memoryStorage[key] || null;
        }
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return memoryStorage[key] || null;
    }
  },

  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('localStorage blocked, using memory fallback');
        }
        delete memoryStorage[key];
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
      delete memoryStorage[key];
    }
  },
};

export default storage;
