import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Paragraph, Chip, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function MantenimientoScreen() {
  const mantenimientos = [
    {
      id: 'MANT-001',
      plan: 'Mantenimiento Preventivo Bomba',
      sitio: 'Planta Principal',
      item: 'Bomba Grundfos CR 32-4',
      fecha_plan: '2024-01-20',
      fecha_ejecucion: null,
      resultado: 'pendiente',
      responsable: 'Carlos López',
    },
    {
      id: 'MANT-002',
      plan: 'Revisión Motor Siemens',
      sitio: 'Sector A',
      item: 'Motor 1LA7 090-4',
      fecha_plan: '2024-01-18',
      fecha_ejecucion: '2024-01-18',
      resultado: 'ok',
      responsable: 'María García',
    },
    {
      id: 'MANT-003',
      plan: 'Calibración Válvulas',
      sitio: 'Sector B',
      item: 'Válvula Fisher V150',
      fecha_plan: '2024-01-15',
      fecha_ejecucion: '2024-01-15',
      resultado: 'con_observaciones',
      responsable: 'Juan Pérez',
    },
  ];

  const getResultColor = (resultado: string) => {
    const colors = {
      ok: '#27ae60',
      con_observaciones: '#f39c12',
      pendiente: '#3498db',
      cancelado: '#95a5a6',
    };
    return colors[resultado as keyof typeof colors] || '#95a5a6';
  };

  const getResultText = (resultado: string) => {
    const texts = {
      ok: 'Completado',
      con_observaciones: 'Con Observaciones',
      pendiente: 'Pendiente',
      cancelado: 'Cancelado',
    };
    return texts[resultado as keyof typeof texts] || resultado;
  };

  const renderMantenimiento = ({ item }: { item: any }) => (
    <Card style={styles.mantenimientoCard}>
      <Card.Content>
        <View style={styles.mantenimientoHeader}>
          <Text style={styles.mantenimientoId}>{item.id}</Text>
          <Chip
            style={[styles.resultChip, { backgroundColor: getResultColor(item.resultado) }]}
            textStyle={styles.chipText}
          >
            {getResultText(item.resultado)}
          </Chip>
        </View>
        
        <Title style={styles.mantenimientoPlan}>{item.plan}</Title>
        <Paragraph style={styles.mantenimientoItem}>{item.item}</Paragraph>
        
        <View style={styles.mantenimientoInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.sitio}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.responsable}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>
              Plan: {item.fecha_plan}
              {item.fecha_ejecucion && ` | Ejec: ${item.fecha_ejecucion}`}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mantenimiento</Title>
        <Paragraph style={styles.subtitle}>
          Programación y seguimiento de mantenimientos
        </Paragraph>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialIcons name="schedule" size={24} color="#f39c12" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialIcons name="build" size={24} color="#3498db" />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>En Proceso</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialIcons name="check-circle" size={24} color="#27ae60" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </Card.Content>
        </Card>
      </View>

      <FlatList
        data={mantenimientos}
        renderItem={renderMantenimiento}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        label="Programar Mantenimiento"
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  mantenimientoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  mantenimientoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mantenimientoId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  resultChip: {
    height: 24,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mantenimientoPlan: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  mantenimientoItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  mantenimientoInfo: {
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
