import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SecurityScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Succès', 'Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de changer le mot de passe');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer définitivement votre compte? Cette action est irréversible et supprimera toutes vos données, propriétés et favoris.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete account...');
              const response = await api.delete('/auth/delete-account');
              console.log('Delete account response:', response.data);
              
              await logout();
              
              Alert.alert(
                'Compte supprimé',
                'Votre compte a été supprimé avec succès',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                      });
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              console.error('Error response:', error.response?.data);
              Alert.alert('Erreur', error.response?.data?.message || 'Impossible de supprimer le compte');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Security Info */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Sécurité du compte</Text>
          <Text style={styles.infoText}>
            Votre compte est protégé par un mot de passe crypté. Nous vous recommandons d'utiliser un mot de passe fort et unique.
          </Text>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowPasswordForm(!showPasswordForm)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="key-outline" size={24} color={COLORS.primary} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Changer le mot de passe</Text>
                <Text style={styles.menuItemSubtitle}>
                  Mettez à jour votre mot de passe régulièrement
                </Text>
              </View>
            </View>
            <Ionicons 
              name={showPasswordForm ? "chevron-up" : "chevron-forward"} 
              size={20} 
              color={COLORS.gray} 
            />
          </TouchableOpacity>

          {showPasswordForm && (
            <View style={styles.passwordForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe actuel</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Entrez votre mot de passe actuel"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nouveau mot de passe</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Entrez votre nouveau mot de passe"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmez votre nouveau mot de passe"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.submitButtonText}>Changer le mot de passe</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Authentification à deux facteurs</Text>
                <Text style={styles.menuItemSubtitle}>Bientôt disponible</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Bientôt</Text>
            </View>
          </View>
        </View>

        {/* Connected Devices */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Appareils connectés', 'Cette fonctionnalité sera bientôt disponible')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="phone-portrait-outline" size={24} color={COLORS.primary} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Appareils connectés</Text>
                <Text style={styles.menuItemSubtitle}>Gérer les sessions actives</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Security Measures */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={32} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Nos mesures de sécurité</Text>
          <View style={styles.securityList}>
            <View style={styles.securityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.securityItemText}>Cryptage des données sensibles</Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.securityItemText}>Connexions HTTPS sécurisées</Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.securityItemText}>Surveillance continue de la sécurité</Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.securityItemText}>Mises à jour régulières de sécurité</Text>
            </View>
          </View>
        </View>

        {/* Delete Account */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dangerMenuItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
              <View style={styles.menuItemText}>
                <Text style={styles.dangerMenuItemTitle}>Supprimer le compte</Text>
                <Text style={styles.menuItemSubtitle}>
                  Suppression définitive de toutes vos données
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: COLORS.light,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 15,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  passwordForm: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    gap: 15,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.light,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  securityList: {
    width: '100%',
    marginTop: 15,
    gap: 10,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  securityItemText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  dangerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFE5E5',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  dangerMenuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
});
