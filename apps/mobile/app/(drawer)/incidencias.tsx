import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function IncidenciasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incidencias</Text>
      <Text style={styles.subtitle}>Gestión de incidencias del sistema</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});
