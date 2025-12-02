import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, formatPrice } from '../../utils/constants';
import api from '../../services/api';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });
    
    return unsubscribe;
  }, [navigation]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await api.delete(`/favorites/${propertyId}`);
      setFavorites(favorites.filter(fav => fav.property_id !== propertyId));
      Alert.alert('Succès', 'Retiré des favoris');
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Erreur', 'Impossible de retirer des favoris');
    }
  };

  const renderProperty = ({ item }) => {
    // Get first image from images array or fallback to single image field
    const displayImage = item.images && Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : (item.image || 'https://via.placeholder.com/300x200');
    
    // Count total images for badge
    const imageCount = item.images && Array.isArray(item.images) ? item.images.length : (item.image ? 1 : 0);
    
    return (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.property_id })}
    >
      <Image
        source={{ uri: displayImage }}
        style={styles.propertyImage}
      />
      {imageCount > 1 && (
        <View style={styles.imageCountBadge}>
          <Ionicons name="images" size={12} color={COLORS.white} />
          <Text style={styles.imageCountText}>{imageCount}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation();
          removeFavorite(item.property_id);
        }}
      >
        <Ionicons name="heart" size={24} color={COLORS.danger} />
      </TouchableOpacity>
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.propertyDetails}>
          <Ionicons name="location-outline" size={14} color={COLORS.gray} />
          <Text style={styles.propertyLocation}>{item.city}</Text>
        </View>
        <Text style={styles.propertyPrice}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={favorites}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyText}>Aucun favori</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez des propriétés à vos favoris pour les retrouver facilement
            </Text>
          </View>
        }
      />
    </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  listContent: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  propertyCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    zIndex: 1,
  },
  imageCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  propertyInfo: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyLocation: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 3,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 5,
  },
});
