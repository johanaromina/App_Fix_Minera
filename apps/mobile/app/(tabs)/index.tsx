import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // La navegación se manejará automáticamente por el layout
  };

  const stats = [
    {
      title: 'Incidencias Activas',
      value: '12',
      icon: 'warning',
      color: '#34495e', // Gris oscuro
    },
    {
      title: 'Items en Inventario',
      value: '1,247',
      icon: 'inventory',
      color: '#2c3e50', // Azul oscuro
    },
    {
      title: 'Mantenimientos Pendientes',
      value: '8',
      icon: 'build',
      color: '#7f8c8d', // Gris medio
    },
    {
      title: 'Eficiencia General',
      value: '94.2%',
      icon: 'trending-up',
      color: '#27ae60', // Verde (mantenemos este)
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Title style={styles.welcomeText}>
              ¡Hola, {user?.nombre || 'Usuario'}!
            </Title>
            <Paragraph style={styles.subtitle}>
              Resumen del sistema
            </Paragraph>
          </View>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#ecf0f1"
            icon="logout"
          >
            Salir
          </Button>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Card key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statHeader}>
                <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
              </View>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Acciones Rápidas</Title>
          <View style={styles.actionsGrid}>
            <Button
              mode="contained"
              onPress={() => {}}
              style={[styles.actionButton, { backgroundColor: '#34495e' }]}
              buttonColor="#34495e"
              textColor="#ecf0f1"
              icon="warning"
            >
              Reportar Incidencia
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              style={[styles.actionButton, { backgroundColor: '#2c3e50' }]}
              buttonColor="#2c3e50"
              textColor="#ecf0f1"
              icon="inventory"
            >
              Escanear QR
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              style={[styles.actionButton, { backgroundColor: '#7f8c8d' }]}
              buttonColor="#7f8c8d"
              textColor="#2c3e50"
              icon="build"
            >
              Mantenimiento
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              style={[styles.actionButton, { backgroundColor: '#27ae60' }]}
              buttonColor="#27ae60"
              textColor="#ecf0f1"
              icon="map"
            >
              Ver Mapa
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    borderColor: '#ecf0f1',
    borderRadius: 8,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#bdc3c7',
    fontSize: 16,
  },
  statsContainer: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    borderLeftWidth: 4,
    elevation: 2,
  },
  statContent: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionsCard: {
    margin: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#2c3e50',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
