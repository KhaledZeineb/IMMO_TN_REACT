import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, formatPrice } from '../../utils/constants';
import api from '../../services/api';

// Import Leaflet for web
let MapContainer, TileLayer, Marker, Popup, Polyline, useMap;
if (Platform.OS === 'web') {
  const leaflet = require('react-leaflet');
  MapContainer = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  Marker = leaflet.Marker;
  Popup = leaflet.Popup;
  Polyline = leaflet.Polyline;
  useMap = leaflet.useMap;
  
  // Import Leaflet CSS
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Fix Leaflet default icon issue
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }
}

// Component to recenter map when property is selected
function MapController({ selectedProperty }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedProperty && Platform.OS === 'web') {
      map.setView(
        [parseFloat(selectedProperty.latitude), parseFloat(selectedProperty.longitude)],
        16,
        { animate: true }
      );
    }
  }, [selectedProperty, map]);
  
  return null;
}

export default function MapScreen({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [trackingLocation, setTrackingLocation] = useState(false);

  useEffect(() => {
    fetchProperties();
    startLocationTracking();
    
    const unsubscribe = navigation.addListener('focus', () => {
      // Clear route when screen is focused again
      setSelectedProperty(null);
      setShowRoute(false);
      setRouteCoordinates([]);
      setRouteInfo(null);
    });
    
    return () => {
      // Cleanup location tracking
      if (Platform.OS === 'web' && navigator.geolocation) {
        navigator.geolocation.clearWatch(window.locationWatchId);
      }
      unsubscribe();
    };
  }, [navigation]);

  const startLocationTracking = () => {
    if (Platform.OS === 'web' && navigator.geolocation) {
      setTrackingLocation(true);
      
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location error:', error);
          setUserLocation({ latitude: 36.8065, longitude: 10.1815 });
        }
      );
      
      // Watch position for real-time updates
      window.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setUserLocation({ latitude: 36.8065, longitude: 10.1815 });
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      const data = Array.isArray(response.data) ? response.data : [];
      const validProperties = data.filter(
        p => p?.latitude && p?.longitude && 
        !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude))
      );
      setProperties(validProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const onPropertyPress = async (property) => {
    setSelectedProperty(property);
    setShowRoute(true);
    
    // Fetch road-based route from OSRM (Open Source Routing Machine)
    if (userLocation) {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${property.longitude},${property.latitude}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoordinates(coords);
          
          // Calculate distance and duration
          const distanceKm = (route.distance / 1000).toFixed(2);
          const durationMin = Math.round(route.duration / 60);
          setRouteInfo({ distance: distanceKm, duration: durationMin });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback to straight line
        setRouteCoordinates([
          [userLocation.latitude, userLocation.longitude],
          [parseFloat(property.latitude), parseFloat(property.longitude)]
        ]);
        setRouteInfo(null);
      }
    }
  };

  const getRoutePoints = () => {
    if (routeCoordinates.length > 0) {
      return routeCoordinates;
    }
    
    if (!userLocation || !selectedProperty) return [];
    
    return [
      [userLocation.latitude, userLocation.longitude],
      [parseFloat(selectedProperty.latitude), parseFloat(selectedProperty.longitude)]
    ];
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Web Map View with Leaflet
  if (Platform.OS === 'web' && properties.length > 0) {
    const center = userLocation 
      ? [userLocation.latitude, userLocation.longitude]
      : [36.8065, 10.1815];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carte</Text>
          <View style={styles.headerStats}>
            <View style={styles.statBadge}>
              <Ionicons name="home" size={16} color={COLORS.primary} />
              <Text style={styles.statText}>{properties.length}</Text>
            </View>
            {selectedProperty && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSelectedProperty(null);
                  setShowRoute(false);
                }}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.danger} />
                <Text style={styles.clearText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {selectedProperty && (
          <View style={styles.propertyCard}>
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>{selectedProperty.title}</Text>
                <Text style={styles.cardSubtitle}>{selectedProperty.city}</Text>
                {routeInfo && (
                  <View style={styles.routeInfo}>
                    <View style={styles.routeInfoItem}>
                      <Ionicons name="navigate" size={14} color={COLORS.primary} />
                      <Text style={styles.routeInfoText}>{routeInfo.distance} km</Text>
                    </View>
                    <View style={styles.routeInfoItem}>
                      <Ionicons name="time" size={14} color={COLORS.secondary} />
                      <Text style={styles.routeInfoText}>{routeInfo.duration} min</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardPrice}>{formatPrice(selectedProperty.price)}</Text>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('PropertyDetails', { propertyId: selectedProperty.id })}
                >
                  <Text style={styles.detailsButtonText}>Détails</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        <div style={{ flex: 1, width: '100%' }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController selectedProperty={selectedProperty} />
            
            {/* User location marker */}
            {userLocation && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
              >
                <Popup>
                  <div>
                    <strong>📍 Votre position</strong>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Property markers */}
            {properties.map((property) => (
              <Marker
                key={property.id}
                position={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                eventHandlers={{
                  click: () => onPropertyPress(property)
                }}
              >
                <Popup>
                  <div style={{ cursor: 'pointer' }} onClick={() => onPropertyPress(property)}>
                    <strong>{property.title}</strong>
                    <br />
                    <span style={{ color: COLORS.gray }}>{property.city}</span>
                    <br />
                    <strong style={{ color: COLORS.primary }}>{formatPrice(property.price)}</strong>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Route/Trajectory line with road-based routing */}
            {showRoute && selectedProperty && userLocation && (
              <Polyline
                positions={getRoutePoints()}
                color={COLORS.primary}
                weight={5}
                opacity={0.8}
                dashArray={routeCoordinates.length > 0 ? null : "10, 10"}
              />
            )}
          </MapContainer>
        </div>
      </View>
    );
  }

  // Empty state or mobile placeholder
  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Ionicons name="map-outline" size={80} color={COLORS.gray} />
        <Text style={styles.emptyText}>
          {properties.length === 0 ? 'Aucune propriété trouvée' : 'Carte disponible sur mobile'}
        </Text>
      </View>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  statText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
  propertyCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
    textAlign: 'center',
  },
});
