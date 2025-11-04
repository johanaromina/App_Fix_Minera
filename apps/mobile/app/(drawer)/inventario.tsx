import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function InventarioScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const items = [
    {
      id: 'ITEM-001',
      tipo: 'Bomba',
      marca: 'Grundfos',
      modelo: 'CR 32-4',
      nro_serie: 'GR123456',
      codigo_qr: 'QR001',
      estado: 'operativo',
      sitio: 'Planta Principal'
    },
    {
      id: 'ITEM-002',
      tipo: 'Motor',
      marca: 'Siemens',
      modelo: '1LA7 090-4',
      nro_serie: 'SI789012',
      codigo_qr: 'QR002',
      estado: 'mantenimiento',
      sitio: 'Sector A'
    },
    {
      id: 'ITEM-003',
      tipo: 'Válvula',
      marca: 'Fisher',
      modelo: 'V150',
      nro_serie: 'FI345678',
      codigo_qr: 'QR003',
      estado: 'fuera_de_servicio',
      sitio: 'Sector B'
    }
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'operativo': return '#27ae60'; // Verde para operativo
      case 'mantenimiento': return '#f39c12'; // Naranja para mantenimiento
      case 'fuera_de_servicio': return '#e74c3c'; // Rojo para fuera de servicio
      case 'baja': return '#7f8c8d'; // Gris para baja
      default: return '#7f8c8d';
    }
  };

  const filteredItems = items.filter(item =>
    item.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.modelo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Inventario</Title>
        <Paragraph style={styles.subtitle}>Gestión de equipos y materiales</Paragraph>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.addButton}
          icon="plus"
        >
          Agregar Item
        </Button>
      </View>

      <View style={styles.content}>
        <Searchbar
          placeholder="Buscar por tipo, marca, modelo..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {filteredItems.map((item) => (
          <Card key={item.id} style={styles.itemCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.itemId}>{item.id}</Text>
                <Chip
                  style={[styles.chip, { backgroundColor: getStatusColor(item.estado) }]}
                  textStyle={styles.chipText}
                >
                  {item.estado.replace('_', ' ').toUpperCase()}
                </Chip>
              </View>
              
              <Title style={styles.itemTitle}>{item.tipo} {item.marca}</Title>
              <Paragraph style={styles.itemModel}>{item.modelo}</Paragraph>
              
              <View style={styles.itemDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="fingerprint" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{item.nro_serie}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="qr-code" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{item.codigo_qr}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={16} color="#7f8c8d" />
                  <Text style={styles.detailText}>{item.sitio}</Text>
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
                <Button 
                  mode="contained" 
                  compact 
                  onPress={() => {}}
                  buttonColor="#27ae60"
                  textColor="#fff"
                  style={styles.actionButton}
                >
                  QR
                </Button>
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
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  itemCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemId: {
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
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemModel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  itemDetails: {
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
