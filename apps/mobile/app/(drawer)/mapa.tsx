import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapaScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -33.4489,
    longitude: -70.6693,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const sitios = [
    {
      id: 'SITIO-001',
      nombre: 'Planta Principal',
      descripcion: 'Sitio principal de extracción',
      estado: 'operativo',
      equipos: 15,
      lat: -33.4489,
      lng: -70.6693
    },
    {
      id: 'SITIO-002',
      nombre: 'Sector A',
      descripcion: 'Zona de procesamiento',
      estado: 'mantenimiento',
      equipos: 8,
      lat: -33.4500,
      lng: -70.6700
    },
    {
      id: 'SITIO-003',
      nombre: 'Sector B',
      descripcion: 'Área de almacenamiento',
      estado: 'operativo',
      equipos: 12,
      lat: -33.4400,
      lng: -70.6600
    }
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'operativo': return '#27ae60'; // Verde para operativo
      case 'mantenimiento': return '#f39c12'; // Naranja para mantenimiento
      case 'fuera_de_servicio': return '#e74c3c'; // Rojo para fuera de servicio
      case 'inactivo': return '#7f8c8d'; // Gris para inactivo
      default: return '#7f8c8d';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'Operativo';
      case 'mantenimiento': return 'Mantenimiento';
      case 'fuera_de_servicio': return 'Fuera de Servicio';
      case 'inactivo': return 'Inactivo';
      default: return estado;
    }
  };

  // Obtener ubicación del usuario
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita acceso a la ubicación para mostrar el mapa');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  };

  // Navegar a un sitio específico
  const navigateToSite = (lat: number, lng: number, nombre: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    });
  };

  // Centrar mapa en un sitio
  const centerOnSite = (lat: number, lng: number) => {
    setMapRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mapa</Title>
        <Paragraph style={styles.subtitle}>Visualización geográfica de sitios y equipos</Paragraph>
        <Button
          mode="contained"
          onPress={getCurrentLocation}
          style={styles.addButton}
          icon="my-location"
        >
          Mi Ubicación
        </Button>
      </View>

      <View style={styles.content}>
        {/* Mapa interactivo */}
        <Card style={styles.mapCard}>
          <Card.Content style={styles.mapContent}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={mapRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                onRegionChangeComplete={setMapRegion}
                mapType="standard"
              >
                {/* Marcador de ubicación del usuario */}
                {userLocation && (
                  <Marker
                    coordinate={{
                      latitude: userLocation.coords.latitude,
                      longitude: userLocation.coords.longitude,
                    }}
                    title="Mi Ubicación"
                    description="Tu posición actual"
                    pinColor="blue"
                  />
                )}

                {/* Marcadores de sitios */}
                {sitios.map((sitio) => (
                  <Marker
                    key={sitio.id}
                    coordinate={{
                      latitude: sitio.lat,
                      longitude: sitio.lng,
                    }}
                    title={sitio.nombre}
                    description={`${sitio.descripcion} - ${sitio.equipos} equipos`}
                    pinColor={getStatusColor(sitio.estado)}
                    onPress={() => centerOnSite(sitio.lat, sitio.lng)}
                  >
                    <Callout>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>{sitio.nombre}</Text>
                        <Text style={styles.calloutDescription}>{sitio.descripcion}</Text>
                        <Text style={styles.calloutEquipos}>{sitio.equipos} equipos activos</Text>
                        <Button
                          mode="contained"
                          compact
                          onPress={() => navigateToSite(sitio.lat, sitio.lng, sitio.nombre)}
                          style={styles.calloutButton}
                        >
                          Navegar
                        </Button>
                      </View>
                    </Callout>
                  </Marker>
                ))}
              </MapView>
            </View>
          </Card.Content>
        </Card>

        {/* Lista de sitios */}
        <View style={styles.sitesSection}>
          <Title style={styles.sectionTitle}>Sitios Activos</Title>
          {sitios.map((sitio) => (
            <Card key={sitio.id} style={styles.siteCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={styles.siteId}>{sitio.id}</Text>
                  <Chip
                    style={[styles.chip, { backgroundColor: getStatusColor(sitio.estado) }]}
                    textStyle={styles.chipText}
                  >
                    {getStatusText(sitio.estado)}
                  </Chip>
                </View>
                
                <Title style={styles.siteTitle}>{sitio.nombre}</Title>
                <Paragraph style={styles.siteDescription}>{sitio.descripcion}</Paragraph>
                
                <View style={styles.siteDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="build" size={16} color="#7f8c8d" />
                    <Text style={styles.detailText}>{sitio.equipos} equipos activos</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="location-on" size={16} color="#7f8c8d" />
                    <Text style={styles.detailText}>{sitio.lat}, {sitio.lng}</Text>
                  </View>
                </View>
              </Card.Content>
              
              <Card.Actions style={styles.cardActions}>
                <Button 
                  mode="contained" 
                  compact 
                  onPress={() => centerOnSite(sitio.lat, sitio.lng)}
                  buttonColor="#7f8c8d"
                  textColor="#fff"
                  style={styles.actionButton}
                >
                  Centrar
                </Button>
                <Button 
                  mode="contained" 
                  compact 
                  onPress={() => navigateToSite(sitio.lat, sitio.lng, sitio.nombre)}
                  buttonColor="#3498db"
                  textColor="#fff"
                  style={styles.actionButton}
                >
                  Navegar
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        {/* Leyenda */}
        <Card style={styles.legendCard}>
          <Card.Content>
            <Title style={styles.legendTitle}>Leyenda</Title>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#27ae60' }]} />
                <Text style={styles.legendText}>Operativo</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f39c12' }]} />
                <Text style={styles.legendText}>Mantenimiento</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.legendText}>Falla</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#3498db' }]} />
                <Text style={styles.legendText}>Sensor IoT</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#bdc3c7',
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#3498db',
  },
  content: {
    padding: 16,
  },
  mapCard: {
    marginBottom: 16,
    elevation: 2,
  },
  mapContent: {
    padding: 0,
  },
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  calloutContainer: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  calloutEquipos: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 8,
  },
  calloutButton: {
    borderRadius: 4,
  },
  sitesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  siteCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  siteId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chip: {
    height: 30,
    minWidth: 50,
    paddingHorizontal: 4,
  },
  chipText: {
    fontSize: 7,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  siteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  siteDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  siteDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cardActions: {
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
    elevation: 2,
  },
  legendCard: {
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
