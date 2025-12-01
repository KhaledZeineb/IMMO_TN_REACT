import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

export default function AboutScreen({ navigation }) {
  const developers = [
    {
      name: 'Rayen Chraiet',
      role: 'Lead Developer & Project Manager',
      email: 'rayenchraiet2000@gmail.com',
      phone: '+216 94599198',
      linkedin: 'https://linkedin.com/in/rayen-chraiet-16b671337',
      github: 'https://github.com/chraietrayen',
    },
    {
      name: 'Sihem Barghouda',
      role: 'Backend Developer',
      email: 'sihem.barghouda@example.com',
    },
    {
      name: 'Zeineb Khaled',
      role: 'UI/UX Designer',
      email: 'zeineb.khaled@example.com',
    },
    {
      name: 'Eya Ben Slama',
      role: 'Frontend Developer',
      email: 'eya.benslama@example.com',
    },
    {
      name: 'Rim Ayari',
      role: 'QA Engineer',
      email: 'rim.ayari@example.com',
    },
  ];

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderDeveloper = (developer, index) => (
    <View key={index} style={styles.developerCard}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={40} color={COLORS.primary} />
      </View>
      <Text style={styles.developerName}>{developer.name}</Text>
      <Text style={styles.developerRole}>{developer.role}</Text>

      <View style={styles.contactButtons}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => openLink(`mailto:${developer.email}`)}
        >
          <Ionicons name="mail" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        {developer.phone && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => openLink(`tel:${developer.phone}`)}
          >
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {developer.linkedin && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => openLink(developer.linkedin)}
          >
            <Ionicons name="logo-linkedin" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {developer.github && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => openLink(developer.github)}
          >
            <Ionicons name="logo-github" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À propos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.appSection}>
        <Ionicons name="home" size={80} color={COLORS.primary} />
        <Text style={styles.appName}>IMMO_TN</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appDescription}>
          Une application mobile moderne pour la gestion immobilière en Tunisie
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fonctionnalités</Text>
        <View style={styles.featuresList}>
          {[
            'Recherche avancée de propriétés',
            'Carte interactive',
            'Messagerie en temps réel',
            'Assistant IA intelligent',
            'Gestion des favoris',
            'Notifications en temps réel',
            'Profil utilisateur personnalisable',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Équipe de Développement</Text>
        <View style={styles.developersGrid}>
          {developers.map((developer, index) => renderDeveloper(developer, index))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technologies</Text>
        <View style={styles.techGrid}>
          {[
            { name: 'React Native', icon: 'logo-react' },
            { name: 'Node.js', icon: 'logo-nodejs' },
            { name: 'MySQL', icon: 'server' },
            { name: 'OpenAI', icon: 'bulb' },
          ].map((tech, index) => (
            <View key={index} style={styles.techItem}>
              <Ionicons name={tech.icon} size={30} color={COLORS.primary} />
              <Text style={styles.techName}>{tech.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Développé avec ❤️ en Tunisie 🇹🇳</Text>
        <Text style={styles.footerText}>© 2025 IMMO_TN Team</Text>
        <Text style={styles.footerText}>Tous droits réservés</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  appSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
  },
  appVersion: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 5,
  },
  appDescription: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 15,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.dark,
  },
  developersGrid: {
    gap: 15,
  },
  developerCard: {
    backgroundColor: COLORS.light,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  developerRole: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 15,
    textAlign: 'center',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  techItem: {
    width: '47%',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  techName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    marginVertical: 2,
  },
});
