import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapaScreen() {
  const sitios = [
    {
      id: 'SITIO-001',
      nombre: 'Planta Principal',
      equipos: 3,
      estado: 'operativo',
      lat: -33.4489,
      lng: -70.6693,
    },
    {
      id: 'SITIO-002',
      nombre: 'Sector A',
      equipos: 2,
      estado: 'mantenimiento',
      lat: -33.4500,
      lng: -70.6700,
    },
    {
      id: 'SITIO-003',
      nombre: 'Sector B',
      equipos: 1,
      estado: 'falla',
      lat: -33.4520,
      lng: -70.6710,
    },
  ];

  const getEstadoColor = (estado: string) => {
    const colors = {
      operativo: '#27ae60',
      mantenimiento: '#f39c12',
      falla: '#e74c3c',
    };
    return colors[estado as keyof typeof colors] || '#95a5a6';
  };

  const getEstadoText = (estado: string) => {
    const texts = {
      operativo: 'Operativo',
      mantenimiento: 'Mantenimiento',
      falla: 'Falla',
    };
    return texts[estado as keyof typeof texts] || estado;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mapa Interactivo</Title>
        <Paragraph style={styles.subtitle}>
          Visualización geográfica de sitios y equipos
        </Paragraph>
      </View>

      <View style={styles.mapContainer}>
        <Card style={styles.mapCard}>
          <Card.Content style={styles.mapContent}>
            <MaterialIcons name="map" size={64} color="#bdc3c7" />
            <Text style={styles.mapTitle}>Mapa Interactivo</Text>
            <Text style={styles.mapSubtitle}>
              Aquí se mostrará el mapa con React Native Maps
            </Text>
            <Text style={styles.mapNote}>
              Integración con React Native Maps pendiente
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.sitiosContainer}>
        <Title style={styles.sectionTitle}>Sitios Activos</Title>
        {sitios.map((sitio) => (
          <Card key={sitio.id} style={styles.sitioCard}>
            <Card.Content>
              <View style={styles.sitioHeader}>
                <View>
                  <Title style={styles.sitioNombre}>{sitio.nombre}</Title>
                  <Paragraph style={styles.sitioEquipos}>
                    {sitio.equipos} equipos activos
                  </Paragraph>
                </View>
                <Chip
                  style={[styles.estadoChip, { backgroundColor: getEstadoColor(sitio.estado) }]}
                  textStyle={styles.chipText}
                >
                  {getEstadoText(sitio.estado)}
                </Chip>
              </View>
              <View style={styles.sitioInfo}>
                <View style={styles.infoRow}>
                  <MaterialIcons name="place" size={16} color="#7f8c8d" />
                  <Text style={styles.infoText}>
                    {sitio.lat}, {sitio.lng}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.leyendaCard}>
        <Card.Content>
          <Title style={styles.leyendaTitle}>Leyenda</Title>
          <View style={styles.leyendaContainer}>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: '#27ae60' }]} />
              <Text style={styles.leyendaText}>Operativo</Text>
            </View>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: '#f39c12' }]} />
              <Text style={styles.leyendaText}>Mantenimiento</Text>
            </View>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: '#e74c3c' }]} />
              <Text style={styles.leyendaText}>Falla</Text>
            </View>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: '#3498db' }]} />
              <Text style={styles.leyendaText}>Sensor IoT</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#bdc3c7',
    fontSize: 16,
  },
  mapContainer: {
    padding: 16,
  },
  mapCard: {
    elevation: 2,
  },
  mapContent: {
    alignItems: 'center',
    padding: 40,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  mapNote: {
    fontSize: 12,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  sitiosContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 16,
  },
  sitioCard: {
    marginBottom: 12,
    elevation: 2,
  },
  sitioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sitioNombre: {
    fontSize: 16,
    color: '#2c3e50',
  },
  sitioEquipos: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  estadoChip: {
    height: 24,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sitioInfo: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  leyendaCard: {
    margin: 16,
    elevation: 2,
  },
  leyendaTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 12,
  },
  leyendaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leyendaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  leyendaText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
