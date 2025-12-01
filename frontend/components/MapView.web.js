import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Web fallback for react-native-maps
const MapView = ({ children, region, initialRegion, ...props }) => {
  return (
    <View style={[styles.mapContainer, props.style]}>
      <Text style={styles.text}>🗺️ Map View</Text>
      <Text style={styles.subText}>Map features are available on mobile</Text>
      <Text style={styles.infoText}>Download the mobile app for full map experience</Text>
    </View>
  );
};

// Mock Marker component for web
MapView.Marker = ({ children, ...props }) => null;
MapView.Callout = ({ children, ...props }) => null;

// Mock PROVIDER_GOOGLE constant
export const PROVIDER_GOOGLE = 'google';
export const Marker = MapView.Marker;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
  },
});

export default MapView;
