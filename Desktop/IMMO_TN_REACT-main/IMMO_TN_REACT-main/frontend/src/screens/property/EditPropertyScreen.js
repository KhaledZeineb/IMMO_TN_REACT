import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, PROPERTY_TYPES, TRANSACTION_TYPES, CITIES } from '../../utils/constants';
import api from '../../services/api';

export default function EditPropertyScreen({ route, navigation }) {
  const { propertyId } = route.params;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    transaction_type: 'SALE',
    price: '',
    city: 'Tunis',
    address: '',
    surface: '',
    bedrooms: '2',
    bathrooms: '1',
    latitude: '',
    longitude: '',
    image: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${propertyId}`);
      const property = response.data;
      
      // Load images array
      let loadedImages = [];
      if (property.images && Array.isArray(property.images) && property.images.length > 0) {
        loadedImages = property.images;
      } else if (property.image) {
        loadedImages = [property.image];
      }
      setImages(loadedImages);
      
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || 'APARTMENT',
        transaction_type: property.transaction_type || 'SALE',
        price: property.price?.toString() || '',
        city: property.city || 'Tunis',
        address: property.address || '',
        surface: property.surface?.toString() || '',
        bedrooms: property.bedrooms?.toString() || '2',
        bathrooms: property.bathrooms?.toString() || '1',
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        image: loadedImages[0] || '',
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      Alert.alert('Erreur', 'Impossible de charger la propriété');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [16, 9],
      quality: 0.5, // Reduced quality to avoid large payloads
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      const totalImages = images.length + newImages.length;
      
      if (totalImages > 10) {
        Alert.alert('Limite atteinte', 'Vous pouvez ajouter maximum 10 photos par propriété');
        return;
      }
      
      setImages([...images, ...newImages]);
      if (images.length === 0 && newImages.length > 0) {
        setFormData({ ...formData, image: newImages[0] });
      }
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (index === 0 && newImages.length > 0) {
      setFormData({ ...formData, image: newImages[0] });
    } else if (newImages.length === 0) {
      setFormData({ ...formData, image: '' });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.address) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins une photo');
      return;
    }

    setSaving(true);
    try {
      const propertyData = {
        ...formData,
        images: images,
        image: images[0]
      };
      await api.put(`/properties/${propertyId}`, propertyData);
      Alert.alert('Succès', 'Propriété modifiée avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating property:', error);
      Alert.alert('Erreur', 'Impossible de modifier la propriété');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier la propriété</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Multiple Images Section */}
        <View style={styles.imagesSection}>
          <View style={styles.imagesSectionHeader}>
            <Text style={styles.label}>Photos ({images.length})</Text>
            <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              <Text style={styles.addImageText}>Ajouter des photos</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imageThumb} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.mainImageBadge}>
                      <Text style={styles.mainImageText}>Principal</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImages}>
              <Ionicons name="images-outline" size={60} color={COLORS.gray} />
              <Text style={styles.imagePlaceholderText}>Ajouter des photos</Text>
              <Text style={styles.imagePlaceholderSubText}>Montrez différentes pièces de votre propriété</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Ex: Appartement moderne à Tunis"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Décrivez votre propriété..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  style={styles.picker}
                >
                  {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                    <Picker.Item key={key} label={value} value={key} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Transaction</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.transaction_type}
                  onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
                  style={styles.picker}
                >
                  {Object.entries(TRANSACTION_TYPES).map(([key, value]) => (
                    <Picker.Item key={key} label={value} value={key} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prix (TND) *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Ex: 250000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ville</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
                style={styles.picker}
              >
                {CITIES.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Ex: Avenue Habib Bourguiba"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localisation GPS</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={() => setShowMapPicker(true)}
            >
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.locationButtonText}>
                {formData.latitude && formData.longitude 
                  ? `${parseFloat(formData.latitude).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(4)}`
                  : 'Choisir sur la carte'
                }
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Surface (m²)</Text>
              <TextInput
                style={styles.input}
                value={formData.surface}
                onChangeText={(text) => setFormData({ ...formData, surface: text })}
                placeholder="120"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Chambres</Text>
              <TextInput
                style={styles.input}
                value={formData.bedrooms}
                onChangeText={(text) => setFormData({ ...formData, bedrooms: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Salles de bain</Text>
              <TextInput
                style={styles.input}
                value={formData.bathrooms}
                onChangeText={(text) => setFormData({ ...formData, bathrooms: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={styles.submitButtonText}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showMapPicker && Platform.OS === 'web' && (
        <View style={styles.mapModal}>
          <View style={styles.mapModalContent}>
            <View style={styles.mapModalHeader}>
              <Text style={styles.mapModalTitle}>Choisir la localisation</Text>
              <TouchableOpacity onPress={() => setShowMapPicker(false)}>
                <Ionicons name="close" size={28} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <Text style={styles.mapInstructions}>
                Entrez les coordonnées GPS de votre propriété
              </Text>
              <View style={styles.coordinatesInput}>
                <View style={styles.coordRow}>
                  <Text style={styles.coordLabel}>Latitude:</Text>
                  <TextInput
                    style={styles.coordInput}
                    value={formData.latitude}
                    onChangeText={(text) => setFormData({ ...formData, latitude: text })}
                    placeholder="Ex: 36.8065"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.coordRow}>
                  <Text style={styles.coordLabel}>Longitude:</Text>
                  <TextInput
                    style={styles.coordInput}
                    value={formData.longitude}
                    onChangeText={(text) => setFormData({ ...formData, longitude: text })}
                    placeholder="Ex: 10.1815"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              <View style={styles.presetLocations}>
                <Text style={styles.presetTitle}>Ou choisir une zone:</Text>
                <TouchableOpacity 
                  style={styles.presetButton}
                  onPress={() => setFormData({ ...formData, latitude: '36.8065', longitude: '10.1815' })}
                >
                  <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.presetText}>Tunis Centre</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.presetButton}
                  onPress={() => setFormData({ ...formData, latitude: '36.8785', longitude: '10.3250' })}
                >
                  <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.presetText}>La Marsa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.presetButton}
                  onPress={() => setFormData({ ...formData, latitude: '36.8334', longitude: '10.2381' })}
                >
                  <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.presetText}>Lac 2</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.presetButton}
                  onPress={() => setFormData({ ...formData, latitude: '36.8686', longitude: '10.3411' })}
                >
                  <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.presetText}>Sidi Bou Said</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.confirmLocationButton}
                onPress={() => setShowMapPicker(false)}
              >
                <Text style={styles.confirmLocationText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  content: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 20,
  },
  imagesSection: {
    marginBottom: 20,
  },
  imagesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addImageText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    marginRight: 15,
    position: 'relative',
  },
  imageThumb: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  mainImageText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
    fontWeight: '600',
  },
  imagePlaceholderSubText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: COLORS.light,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    gap: 10,
  },
  locationButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  mapModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  mapModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mapModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  mapContainer: {
    padding: 20,
  },
  mapInstructions: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  coordinatesInput: {
    gap: 15,
    marginBottom: 20,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coordLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    width: 90,
  },
  coordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.light,
  },
  presetLocations: {
    gap: 10,
    marginBottom: 20,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 5,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    gap: 10,
  },
  presetText: {
    fontSize: 15,
    color: COLORS.dark,
  },
  confirmLocationButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmLocationText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
