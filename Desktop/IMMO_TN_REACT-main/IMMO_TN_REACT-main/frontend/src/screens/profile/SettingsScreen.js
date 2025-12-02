import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇹🇳' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('settings') || 'Paramètres'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Apparence
          </Text>
          <View style={[styles.settingItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.light }]}>
                <Ionicons 
                  name={isDarkMode ? "moon" : "sunny"} 
                  size={24} 
                  color={COLORS.primary} 
                />
              </View>
              <View>
                <Text style={[styles.settingItemTitle, { color: theme.colors.text }]}>
                  {t('theme') || 'Thème'}
                </Text>
                <Text style={[styles.settingItemSubtitle, { color: theme.colors.textSecondary }]}>
                  {isDarkMode ? (t('darkMode') || 'Mode sombre') : (t('lightMode') || 'Mode clair')}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: COLORS.primary }}
              thumbColor={isDarkMode ? COLORS.white : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('language') || 'Langue'}
          </Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: language === lang.code ? COLORS.primary : theme.colors.border,
                  borderWidth: language === lang.code ? 2 : 1,
                }
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <View style={styles.languageItemLeft}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: theme.colors.text }]}>
                  {lang.name}
                </Text>
              </View>
              {language === lang.code && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Application
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.light }]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Version
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Build
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                2025.11.30
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 28,
    marginRight: 15,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 12,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
