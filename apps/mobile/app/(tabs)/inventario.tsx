import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Paragraph, Chip, FAB, Searchbar } from 'react-native-paper';
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
      sitio: 'Planta Principal',
    },
    {
      id: 'ITEM-002',
      tipo: 'Motor',
      marca: 'Siemens',
      modelo: '1LA7 090-4',
      nro_serie: 'SI789012',
      codigo_qr: 'QR002',
      estado: 'mantenimiento',
      sitio: 'Sector A',
    },
    {
      id: 'ITEM-003',
      tipo: 'Válvula',
      marca: 'Fisher',
      modelo: 'V150',
      nro_serie: 'FI345678',
      codigo_qr: 'QR003',
      estado: 'fuera_de_servicio',
      sitio: 'Sector B',
    },
  ];

  const getStatusColor = (estado: string) => {
    const colors = {
      operativo: '#27ae60',
      mantenimiento: '#f39c12',
      fuera_de_servicio: '#e74c3c',
      baja: '#95a5a6',
    };
    return colors[estado as keyof typeof colors] || '#95a5a6';
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.itemCard}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.estado) }]}
            textStyle={styles.chipText}
          >
            {item.estado.replace('_', ' ').toUpperCase()}
          </Chip>
        </View>
        
        <Title style={styles.itemTipo}>{item.tipo}</Title>
        <Paragraph style={styles.itemMarca}>{item.marca} {item.modelo}</Paragraph>
        
        <View style={styles.itemInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="qr-code" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.codigo_qr}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.sitio}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="confirmation-number" size={16} color="#7f8c8d" />
            <Text style={styles.infoText}>{item.nro_serie}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Inventario</Title>
        <Paragraph style={styles.subtitle}>
          Gestión de equipos y materiales
        </Paragraph>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por tipo, marca, modelo..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <FAB
          icon="qrcode-scan"
          style={styles.fab}
          onPress={() => {}}
          label="Escanear QR"
        />
        <FAB
          icon="plus"
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => {}}
          label="Agregar Item"
        />
      </View>
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchbar: {
    elevation: 0,
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 16,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemTipo: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  itemMarca: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  itemInfo: {
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
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 12,
  },
  fab: {
    backgroundColor: '#2c3e50',
  },
  fabSecondary: {
    backgroundColor: '#3498db',
  },
});
