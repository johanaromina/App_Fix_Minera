import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Paragraph, Chip, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function IncidenciasScreen() {
  const incidencias = [
    {
      id: 'INC-001',
      titulo: 'Falla en bomba principal',
      prioridad: 'critica',
      estado: 'abierta',
      sitio: 'Planta Principal',
      fecha: '2024-01-15',
      reportado: 'Juan Pérez',
    },
    {
      id: 'INC-002',
      titulo: 'Fuga de agua en tubería',
      prioridad: 'alta',
      estado: 'en_proceso',
      sitio: 'Sector A',
      fecha: '2024-01-14',
      reportado: 'María García',
    },
    {
      id: 'INC-003',
      titulo: 'Ruido anormal en motor',
      prioridad: 'media',
      estado: 'cerrada',
      sitio: 'Sector B',
      fecha: '2024-01-13',
      reportado: 'Carlos López',
    },
  ];

  const getPriorityColor = (prioridad: string) => {
    const colors = {
      critica: '#e74c3c',
      alta: '#f39c12',
      media: '#3498db',
      baja: '#95a5a6',
    };
    return colors[prioridad as keyof typeof colors] || '#95a5a6';
  };

  const getStatusColor = (estado: string) => {
    const colors = {
      abierta: '#e74c3c',
      en_proceso: '#f39c12',
      cerrada: '#27ae60',
      cancelada: '#95a5a6',
    };
    return colors[estado as keyof typeof colors] || '#95a5a6';
  };

  const renderIncidencia = ({ item }: { item: any }) => (
    <Card style={styles.incidenciaCard}>
      <Card.Content>
        <View style={styles.incidenciaHeader}>
          <Text style={styles.incidenciaId}>{item.id}</Text>
          <View style={styles.chipsContainer}>
            <Chip
              style={[styles.chip, { backgroundColor: getPriorityColor(item.prioridad) }]}
              textStyle={styles.chipText}
            >
              {item.prioridad.toUpperCase()}
            </Chip>
            <Chip
              style={[styles.chip, { backgroundColor: getStatusColor(item.estado) }]}
              textStyle={styles.chipText}
            >
              {item.estado.replace('_', ' ').toUpperCase()}
            </Chip>
          </View>
        </View>
        
        <Title style={styles.incidenciaTitulo}>{item.titulo}</Title>
        
        <View style={styles.incidenciaInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.sitio}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.reportado}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.fecha}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Title style={styles.title}>Incidencias</Title>
          <Paragraph style={styles.subtitle}>
            Gestión de incidencias y reportes
          </Paragraph>
        </View>

        <FlatList
          data={incidencias}
          renderItem={renderIncidencia}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        label="Nueva Incidencia"
      />
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
  listContainer: {
    padding: 16,
  },
  incidenciaCard: {
    marginBottom: 16,
    elevation: 2,
  },
  incidenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidenciaId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 24,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidenciaTitulo: {
    fontSize: 16,
    marginBottom: 12,
    color: '#2c3e50',
  },
  incidenciaInfo: {
    gap: 8,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2c3e50',
  },
});
