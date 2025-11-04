import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const chartWidth = width - 32;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  trendValue?: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendValue, onPress }) => (
  <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
    <View style={styles.statContent}>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trend === 'up' ? 'trending-up' : 'trending-down'} 
              size={14} 
              color={trend === 'up' ? '#27ae60' : '#e74c3c'} 
            />
            <Text style={[styles.trendText, { color: trend === 'up' ? '#27ae60' : '#e74c3c' }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => setRefreshing(false), 2000);
  };

  // Datos de estadísticas principales
  const mainStats = [
    {
      title: 'Incidencias Activas',
      value: 12,
      icon: 'warning-outline',
      color: '#e74c3c',
      trend: 'down',
      trendValue: '-15%',
    },
    {
      title: 'Velocidad de Resolución',
      value: '4.2h',
      icon: 'time-outline',
      color: '#27ae60',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Equipos Operativos',
      value: '95%',
      icon: 'hardware-chip-outline',
      color: '#3498db',
      trend: 'up',
      trendValue: '+3%',
    },
    {
      title: 'Sitios Monitoreados',
      value: 15,
      icon: 'location-outline',
      color: '#9b59b6',
      trend: 'up',
      trendValue: '+1',
    },
  ];

  // Datos para gráfico de incidencias por día
  const incidentData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      data: [8, 12, 6, 15, 9, 4, 7],
      color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
      strokeWidth: 3
    }]
  };

  // Datos para gráfico de tipos de incidencias
  const incidentTypeData = [
    {
      name: 'Mecánicas',
      population: 35,
      color: '#e74c3c',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Eléctricas',
      population: 25,
      color: '#f39c12',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Ambientales',
      population: 20,
      color: '#27ae60',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Seguridad',
      population: 20,
      color: '#3498db',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  // Datos para gráfico de rendimiento por zona
  const zonePerformanceData = {
    labels: ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'],
    datasets: [{
      data: [85, 92, 78, 88, 95],
      color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    }]
  };

  // Zonas de riesgo
  const riskZones = [
    { name: 'Zona A - Trituradora', risk: 'Alto', incidents: 8, color: '#e74c3c' },
    { name: 'Zona B - Transporte', risk: 'Medio', incidents: 4, color: '#f39c12' },
    { name: 'Zona C - Almacén', risk: 'Bajo', incidents: 2, color: '#27ae60' },
    { name: 'Zona D - Procesamiento', risk: 'Alto', incidents: 6, color: '#e74c3c' },
    { name: 'Zona E - Oficinas', risk: 'Bajo', incidents: 1, color: '#27ae60' },
  ];

  // Métricas de rendimiento
  const performanceMetrics = [
    { label: 'Tiempo Promedio de Resolución', value: '4.2h', target: '6h', status: 'excellent' },
    { label: 'Tasa de Resolución', value: '94%', target: '90%', status: 'good' },
    { label: 'Disponibilidad de Equipos', value: '95%', target: '95%', status: 'good' },
    { label: 'Cumplimiento de Mantenimiento', value: '88%', target: '90%', status: 'warning' },
  ];

  const quickActions = [
    {
      title: 'Nueva Incidencia',
      icon: 'add-circle-outline',
      color: '#e74c3c',
      onPress: () => console.log('Nueva incidencia'),
    },
    {
      title: 'Escanear QR',
      icon: 'qr-code-outline',
      color: '#3498db',
      onPress: () => console.log('Escanear QR'),
    },
    {
      title: 'Ver Mapa',
      icon: 'map-outline',
      color: '#27ae60',
      onPress: () => console.log('Ver mapa'),
    },
    {
      title: 'Reportes',
      icon: 'bar-chart-outline',
      color: '#9b59b6',
      onPress: () => console.log('Reportes'),
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header con selector de tiempo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Dashboard Minero</Text>
          <View style={styles.timeRangeSelector}>
            {['day', 'week', 'month'].map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.timeRangeButton,
                  selectedTimeRange === range && styles.timeRangeButtonActive
                ]}
                onPress={() => setSelectedTimeRange(range)}
              >
                <Text style={[
                  styles.timeRangeText,
                  selectedTimeRange === range && styles.timeRangeTextActive
                ]}>
                  {range === 'day' ? 'Día' : range === 'week' ? 'Semana' : 'Mes'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Resumen operacional y métricas de rendimiento</Text>
      </View>

      {/* Estadísticas principales con tendencias */}
      <View style={styles.statsContainer}>
        {mainStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            trendValue={stat.trendValue}
          />
        ))}
      </View>

      {/* Gráfico de incidencias por día */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Incidencias por Día</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={incidentData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(127, 140, 141, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#e74c3c'
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      {/* Gráfico de tipos de incidencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribución de Incidencias por Tipo</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={incidentTypeData}
            width={chartWidth}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      </View>

      {/* Zonas de riesgo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Análisis de Riesgo por Zona</Text>
        <View style={styles.riskZonesContainer}>
          {riskZones.map((zone, index) => (
            <View key={index} style={styles.riskZoneItem}>
              <View style={styles.riskZoneHeader}>
                <Text style={styles.riskZoneName}>{zone.name}</Text>
                <View style={[styles.riskBadge, { backgroundColor: zone.color }]}>
                  <Text style={styles.riskBadgeText}>{zone.risk}</Text>
                </View>
              </View>
              <View style={styles.riskZoneStats}>
                <View style={styles.riskStat}>
                  <Ionicons name="warning" size={16} color={zone.color} />
                  <Text style={styles.riskStatText}>{zone.incidents} incidencias</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Gráfico de rendimiento por zona */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rendimiento por Zona (%)</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={zonePerformanceData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(127, 140, 141, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            style={styles.chart}
          />
        </View>
      </View>

      {/* Métricas de rendimiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas de Rendimiento</Text>
        <View style={styles.metricsContainer}>
          {performanceMetrics.map((metric, index) => (
            <View key={index} style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={[
                  styles.metricStatus, 
                  metric.status === 'excellent' ? styles.statusexcellent :
                  metric.status === 'good' ? styles.statusgood : styles.statuswarning
                ]}>
                  <Ionicons 
                    name={metric.status === 'excellent' ? 'checkmark-circle' : 
                          metric.status === 'good' ? 'checkmark' : 'warning'} 
                    size={16} 
                    color="#fff" 
                  />
                </View>
              </View>
              <View style={styles.metricValues}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricTarget}>Meta: {metric.target}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={28} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actividad reciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="warning" size={16} color="#e74c3c" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nueva incidencia en Zona A</Text>
              <Text style={styles.activityTime}>Hace 2 horas</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Mantenimiento Zona C completado</Text>
              <Text style={styles.activityTime}>Hace 4 horas</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="alert" size={16} color="#f39c12" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Alerta de temperatura en Zona D</Text>
              <Text style={styles.activityTime}>Hace 6 horas</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#2c3e50',
  },
  timeRangeText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  riskZonesContainer: {
    marginTop: 8,
  },
  riskZoneItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  riskZoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskZoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  riskZoneStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskStatText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 6,
  },
  metricsContainer: {
    marginTop: 8,
  },
  metricItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  metricStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusexcellent: {
    backgroundColor: '#27ae60',
  },
  statusgood: {
    backgroundColor: '#3498db',
  },
  statuswarning: {
    backgroundColor: '#f39c12',
  },
  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  metricTarget: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
