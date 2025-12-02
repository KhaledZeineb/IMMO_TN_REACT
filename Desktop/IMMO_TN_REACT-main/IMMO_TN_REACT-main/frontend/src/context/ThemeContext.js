import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/constants';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = {
    colors: isDarkMode ? {
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      success: COLORS.success,
      danger: COLORS.danger,
      warning: COLORS.warning,
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#2C2C2C',
      light: '#2C2C2C',
    } : {
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      success: COLORS.success,
      danger: COLORS.danger,
      warning: COLORS.warning,
      background: COLORS.white,
      card: COLORS.white,
      text: COLORS.dark,
      textSecondary: COLORS.gray,
      border: COLORS.border,
      light: COLORS.light,
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
