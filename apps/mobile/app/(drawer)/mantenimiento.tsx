import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
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
      responsable: 'Carlos López'
    },
    {
      id: 'MANT-002',
      plan: 'Revisión Motor Siemens',
      sitio: 'Sector A',
      item: 'Motor 1LA7 090-4',
      fecha_plan: '2024-01-18',
      fecha_ejecucion: '2024-01-18',
      resultado: 'ok',
      responsable: 'María García'
    },
    {
      id: 'MANT-003',
      plan: 'Calibración Válvulas',
      sitio: 'Sector B',
      item: 'Válvula Fisher V150',
      fecha_plan: '2024-01-15',
      fecha_ejecucion: '2024-01-15',
      resultado: 'con_observaciones',
      responsable: 'Juan Pérez'
    }
  ];

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case 'ok': return '#27ae60'; // Verde para completado
      case 'con_observaciones': return '#f39c12'; // Naranja para con observaciones
      case 'pendiente': return '#3498db'; // Azul para pendiente
      case 'cancelado': return '#7f8c8d'; // Gris para cancelado
      default: return '#7f8c8d';
    }
  };

  const getResultText = (resultado: string) => {
    switch (resultado) {
      case 'ok': return 'Completado';
      case 'con_observaciones': return 'Con Observaciones';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return resultado;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mantenimiento</Title>
        <Paragraph style={styles.subtitle}>Programación y seguimiento de mantenimientos</Paragraph>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.addButton}
          icon="plus"
        >
          Programar Mantenimiento
        </Button>
      </View>

      <View style={styles.content}>
        {mantenimientos.map((mantenimiento) => (
          <Card key={mantenimiento.id} style={styles.maintenanceCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.maintenanceId}>{mantenimiento.id}</Text>
                <Chip
                  style={[styles.chip, { backgroundColor: getResultColor(mantenimiento.resultado) }]}
                  textStyle={styles.chipText}
                >
                  {getResultText(mantenimiento.resultado)}
                </Chip>
              </View>
              
              <Title style={styles.maintenanceTitle}>{mantenimiento.plan}</Title>
              <Paragraph style={styles.maintenanceItem}>{mantenimiento.item}</Paragraph>
              
              <View style={styles.maintenanceDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{mantenimiento.sitio}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{mantenimiento.responsable}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>Plan: {mantenimiento.fecha_plan}</Text>
                </View>
                {mantenimiento.fecha_ejecucion && (
                  <View style={styles.detailRow}>
                    <MaterialIcons name="check-circle" size={16} color="#7f8c8d" />
                    <Text style={styles.detailText}>Ejecutado: {mantenimiento.fecha_ejecucion}</Text>
                  </View>
                )}
              </View>
            </Card.Content>
            
              <Card.Actions style={styles.cardActions}>
                <Button 
                  mode="contained" 
                  compact 
                  onPress={() => {}}
                  buttonColor="#7f8c8d"
                  textColor="#fff"
                  style={styles.actionButton}
                >
                  Ver
                </Button>
                <Button 
                  mode="contained" 
                  compact 
                  onPress={() => {}}
                  buttonColor="#3498db"
                  textColor="#fff"
                  style={styles.actionButton}
                >
                  Editar
                </Button>
                {mantenimiento.resultado === 'pendiente' && (
                  <Button 
                    mode="contained" 
                    compact 
                    onPress={() => {}}
                    buttonColor="#27ae60"
                    textColor="#fff"
                    style={styles.actionButton}
                  >
                    Ejecutar
                  </Button>
                )}
              </Card.Actions>
          </Card>
        ))}
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
  maintenanceCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceId: {
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
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  maintenanceItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  maintenanceDetails: {
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
});
