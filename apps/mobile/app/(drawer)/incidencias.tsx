import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Portal, PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function IncidenciasScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    prioridad: 'media',
    sitio: '',
    estado: 'abierta',
    fecha: new Date().toISOString().split('T')[0],
    reportado: 'Usuario Actual'
  });
  const incidencias = [
    {
      id: 'INC-001',
      titulo: 'Falla en bomba principal',
      prioridad: 'critica',
      estado: 'abierta',
      sitio: 'Planta Principal',
      fecha: '2024-01-15',
      reportado: 'Juan Pérez'
    },
    {
      id: 'INC-002',
      titulo: 'Fuga de agua en tubería',
      prioridad: 'alta',
      estado: 'en_proceso',
      sitio: 'Sector A',
      fecha: '2024-01-14',
      reportado: 'María García'
    },
    {
      id: 'INC-003',
      titulo: 'Ruido anormal en motor',
      prioridad: 'media',
      estado: 'cerrada',
      sitio: 'Sector B',
      fecha: '2024-01-13',
      reportado: 'Carlos López'
    }
  ];

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return '#e74c3c'; // Rojo para crítico
      case 'alta': return '#f39c12'; // Naranja para alta
      case 'media': return '#3498db'; // Azul para media
      case 'baja': return '#7f8c8d'; // Gris para baja
      default: return '#7f8c8d';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'abierta': return '#e74c3c'; // Rojo para abierta
      case 'en_proceso': return '#f39c12'; // Naranja para en proceso
      case 'cerrada': return '#27ae60'; // Verde para cerrada
      case 'cancelada': return '#7f8c8d'; // Gris para cancelada
      default: return '#7f8c8d';
    }
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim() || !formData.sitio.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevaIncidencia = {
      id: `INC-${String(incidencias.length + 1).padStart(3, '0')}`,
      titulo: formData.titulo,
      prioridad: formData.prioridad,
      estado: formData.estado,
      sitio: formData.sitio,
      fecha: formData.fecha,
      reportado: formData.reportado
    };

    Alert.alert(
      'Incidencia Creada',
      `Se ha creado la incidencia ${nuevaIncidencia.id} exitosamente`,
      [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setFormData({
              titulo: '',
              prioridad: 'media',
              sitio: '',
              estado: 'abierta',
              fecha: new Date().toISOString().split('T')[0],
              reportado: 'Usuario Actual'
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Incidencias</Title>
        <Paragraph style={styles.subtitle}>Gestión de incidencias y reportes</Paragraph>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          icon="plus"
        >
          Nueva Incidencia
        </Button>
      </View>

      <View style={styles.content}>
        {incidencias.map((incidencia) => (
          <Card key={incidencia.id} style={styles.incidentCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.incidentId}>{incidencia.id}</Text>
                <View style={styles.chipsContainer}>
                  <Chip
                    style={[styles.chip, { backgroundColor: getPriorityColor(incidencia.prioridad) }]}
                    textStyle={styles.chipText}
                  >
                    {incidencia.prioridad.toUpperCase()}
                  </Chip>
                  <Chip
                    style={[styles.chip, { backgroundColor: getStatusColor(incidencia.estado) }]}
                    textStyle={styles.chipText}
                  >
                    {incidencia.estado.replace('_', ' ').toUpperCase()}
                  </Chip>
                </View>
              </View>
              
              <Title style={styles.incidentTitle}>{incidencia.titulo}</Title>
              
              <View style={styles.incidentDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{incidencia.sitio}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{incidencia.reportado}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{incidencia.fecha}</Text>
                </View>
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
              </Card.Actions>
          </Card>
          ))}
      </View>

      {/* Modal para crear nueva incidencia */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Title style={styles.modalTitle}>Nueva Incidencia</Title>
              
              <TextInput
                style={styles.input}
                placeholder="Título de la incidencia *"
                value={formData.titulo}
                onChangeText={(text) => setFormData({ ...formData, titulo: text })}
              />

              <View style={styles.priorityContainer}>
                <Text style={styles.priorityLabel}>Prioridad:</Text>
                <View style={styles.priorityButtons}>
                  {[
                    { value: 'critica', label: 'CRÍTICA' },
                    { value: 'alta', label: 'ALTA' },
                    { value: 'media', label: 'MEDIA' },
                    { value: 'baja', label: 'BAJA' }
                  ].map((prioridad) => (
                    <Button
                      key={prioridad.value}
                      mode={formData.prioridad === prioridad.value ? "contained" : "outlined"}
                      onPress={() => setFormData({ ...formData, prioridad: prioridad.value })}
                      style={[styles.priorityButton, { 
                        backgroundColor: formData.prioridad === prioridad.value ? getPriorityColor(prioridad.value) : 'transparent',
                        borderColor: getPriorityColor(prioridad.value)
                      }]}
                      textColor={formData.prioridad === prioridad.value ? '#fff' : getPriorityColor(prioridad.value)}
                      compact
                    >
                      {prioridad.label}
                    </Button>
                  ))}
                </View>
              </View>

              <View style={styles.priorityContainer}>
                <Text style={styles.priorityLabel}>Estado:</Text>
                <View style={styles.priorityButtons}>
                  {[
                    { value: 'abierta', label: 'ABIERTA' },
                    { value: 'en_proceso', label: 'EN PROCESO' },
                    { value: 'cerrada', label: 'CERRADA' }
                  ].map((estado) => (
                    <Button
                      key={estado.value}
                      mode={formData.estado === estado.value ? "contained" : "outlined"}
                      onPress={() => setFormData({ ...formData, estado: estado.value })}
                      style={[styles.priorityButton, { 
                        backgroundColor: formData.estado === estado.value ? getStatusColor(estado.value) : 'transparent',
                        borderColor: getStatusColor(estado.value)
                      }]}
                      textColor={formData.estado === estado.value ? '#fff' : getStatusColor(estado.value)}
                      compact
                    >
                      {estado.label}
                    </Button>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Sitio/Localización *"
                value={formData.sitio}
                onChangeText={(text) => setFormData({ ...formData, sitio: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Fecha *"
                value={formData.fecha}
                onChangeText={(text) => setFormData({ ...formData, fecha: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Reportado por *"
                value={formData.reportado}
                onChangeText={(text) => setFormData({ ...formData, reportado: text })}
              />

              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={[styles.modalButton, styles.submitButton]}
                >
                  Crear Incidencia
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </Modal>
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
  incidentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
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
  incidentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  incidentDetails: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginBottom: 12,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityButton: {
    borderRadius: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  modalButton: {
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#3498db',
  },
});
