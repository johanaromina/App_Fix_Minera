import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function DrawerLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/dashboard' },
    { name: 'Incidencias', icon: 'warning-outline', route: '/incidencias' },
    { name: 'Inventario', icon: 'cube-outline', route: '/inventario' },
    { name: 'Mantenimiento', icon: 'construct-outline', route: '/mantenimiento' },
    { name: 'Mapa', icon: 'map-outline', route: '/mapa' },
    { name: 'Perfil', icon: 'person-outline', route: '/profile' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes('admin')) return 'Administrador';
    if (roles.includes('supervisor')) return 'Supervisor';
    if (roles.includes('tecnico')) return 'Técnico';
    if (roles.includes('operador')) return 'Operador';
    return 'Usuario';
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#ecf0f1',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setIsDrawerOpen(true)}
              style={styles.menuButton}
            >
              <Ionicons name="menu" size={24} color="#ecf0f1" />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen 
          name="dashboard" 
          options={{
            title: 'Dashboard',
            headerTitle: 'Sistema Minero',
          }}
        />
        <Stack.Screen 
          name="incidencias" 
          options={{
            title: 'Incidencias',
            headerTitle: 'Gestión de Incidencias',
          }}
        />
        <Stack.Screen 
          name="inventario" 
          options={{
            title: 'Inventario',
            headerTitle: 'Control de Inventario',
          }}
        />
        <Stack.Screen 
          name="mantenimiento" 
          options={{
            title: 'Mantenimiento',
            headerTitle: 'Planes de Mantenimiento',
          }}
        />
        <Stack.Screen 
          name="mapa" 
          options={{
            title: 'Mapa',
            headerTitle: 'Vista de Sitios',
          }}
        />
        <Stack.Screen 
          name="profile" 
          options={{
            title: 'Perfil',
            headerTitle: 'Mi Perfil',
          }}
        />
      </Stack>

      {/* Drawer Modal */}
      <Modal
        visible={isDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color="#ecf0f1" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
                  <Text style={styles.userRole}>
                    {getRoleDisplayName(user?.roles || [])}
                  </Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsDrawerOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#ecf0f1" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerContent}>
              <Text style={styles.sectionTitle}>Navegación</Text>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    router.push(item.route);
                    setIsDrawerOpen(false);
                  }}
                >
                  <Ionicons name={item.icon as any} size={24} color="#bdc3c7" />
                  <Text style={styles.menuItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  drawerContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#34495e',
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 11,
    color: '#bdc3c7',
  },
  closeButton: {
    padding: 4,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
    paddingHorizontal: 20,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  menuItemText: {
    fontSize: 16,
    color: '#bdc3c7',
    marginLeft: 16,
    fontWeight: '500',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2c3e50',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
});
