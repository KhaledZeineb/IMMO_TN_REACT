import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

const translations = {
  fr: {
    // Home Screen
    hello: 'Bonjour',
    findYourProperty: 'Trouvez votre propriété',
    searchPlaceholder: 'Rechercher une propriété...',
    all: 'Tous',
    noPropertyFound: 'Aucune propriété trouvée',
    
    // Property Types
    apartment: 'Appartement',
    house: 'Maison',
    villa: 'Villa',
    land: 'Terrain',
    office: 'Bureau',
    commercial: 'Local Commercial',
    
    // Transaction Types
    sale: 'Vente',
    rent: 'Location',
    seasonalRent: 'Location Saisonnière',
    
    // Profile
    profile: 'Profil',
    editProfile: 'Modifier le profil',
    myProperties: 'Mes propriétés',
    favorites: 'Favoris',
    security: 'Sécurité',
    notifications: 'Notifications',
    aiAssistant: 'Assistant IA',
    about: 'À propos',
    logout: 'Déconnexion',
    deleteAccount: 'Supprimer le compte',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    
    // Stats
    properties: 'Annonces',
    views: 'Vues',
    
    // Authentication
    loginRequired: 'Connexion requise',
    loginMessage: 'Vous devez vous connecter pour accéder à cette fonctionnalité.',
    login: 'Se connecter',
    register: 'Créer un compte',
    cancel: 'Annuler',
    
    // Security
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    deleteAccountConfirm: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte?',
    
    // Common
    success: 'Succès',
    error: 'Erreur',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
  },
  en: {
    // Home Screen
    hello: 'Hello',
    findYourProperty: 'Find your property',
    searchPlaceholder: 'Search for a property...',
    all: 'All',
    noPropertyFound: 'No property found',
    
    // Property Types
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    land: 'Land',
    office: 'Office',
    commercial: 'Commercial',
    
    // Transaction Types
    sale: 'Sale',
    rent: 'Rent',
    seasonalRent: 'Seasonal Rent',
    
    // Profile
    profile: 'Profile',
    editProfile: 'Edit Profile',
    myProperties: 'My Properties',
    favorites: 'Favorites',
    security: 'Security',
    notifications: 'Notifications',
    aiAssistant: 'AI Assistant',
    about: 'About',
    logout: 'Logout',
    deleteAccount: 'Delete Account',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    
    // Stats
    properties: 'Properties',
    views: 'Views',
    
    // Authentication
    loginRequired: 'Login Required',
    loginMessage: 'You must login to access this feature.',
    login: 'Login',
    register: 'Register',
    cancel: 'Cancel',
    
    // Security
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    deleteAccountConfirm: 'Are you sure you want to permanently delete your account?',
    
    // Common
    success: 'Success',
    error: 'Error',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
  },
  ar: {
    // Home Screen
    hello: 'مرحبا',
    findYourProperty: 'ابحث عن عقارك',
    searchPlaceholder: 'البحث عن عقار...',
    all: 'الكل',
    noPropertyFound: 'لم يتم العثور على عقار',
    
    // Property Types
    apartment: 'شقة',
    house: 'منزل',
    villa: 'فيلا',
    land: 'أرض',
    office: 'مكتب',
    commercial: 'محل تجاري',
    
    // Transaction Types
    sale: 'بيع',
    rent: 'إيجار',
    seasonalRent: 'إيجار موسمي',
    
    // Profile
    profile: 'الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    myProperties: 'عقاراتي',
    favorites: 'المفضلة',
    security: 'الأمان',
    notifications: 'الإشعارات',
    aiAssistant: 'المساعد الذكي',
    about: 'حول',
    logout: 'تسجيل الخروج',
    deleteAccount: 'حذف الحساب',
    language: 'اللغة',
    theme: 'المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    
    // Stats
    properties: 'إعلانات',
    views: 'مشاهدات',
    
    // Authentication
    loginRequired: 'تسجيل الدخول مطلوب',
    loginMessage: 'يجب عليك تسجيل الدخول للوصول إلى هذه الميزة.',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    cancel: 'إلغاء',
    
    // Security
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    deleteAccountConfirm: 'هل أنت متأكد من حذف حسابك نهائياً؟',
    
    // Common
    success: 'نجاح',
    error: 'خطأ',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    back: 'رجوع',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        forceUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem('language', lang);
      forceUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
