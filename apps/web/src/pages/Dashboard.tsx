import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  TriangleAlert, 
  Boxes, 
  Wrench, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  // Datos para gráficos
  const incidentsData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Incidencias',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const maintenanceData = {
    labels: ['Completados', 'Pendientes', 'Vencidos', 'Cancelados'],
    datasets: [
      {
        data: [45, 25, 15, 5],
        backgroundColor: [
          '#27ae60',
          '#f39c12',
          '#e74c3c',
          '#7f8c8d',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const efficiencyData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Eficiencia (%)',
        data: [92, 94, 88, 96, 93, 89, 95],
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const stats = [
    {
      title: 'Incidencias Activas',
      value: '12',
      icon: TriangleAlert,
      color: 'danger',
      change: '+2 esta semana'
    },
    {
      title: 'Items en Inventario',
      value: '1,247',
      icon: Boxes,
      color: 'info',
      change: '+15 este mes'
    },
    {
      title: 'Mantenimientos Pendientes',
      value: '8',
      icon: Wrench,
      color: 'warning',
      change: '3 vencidos'
    },
    {
      title: 'Eficiencia General',
      value: '94.2%',
      icon: TrendingUp,
      color: 'success',
      change: '+2.1% vs mes anterior'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'incident',
      title: 'Falla en bomba principal',
      time: 'Hace 2 horas',
      status: 'critical',
      icon: AlertCircle
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Mantenimiento preventivo completado',
      time: 'Hace 4 horas',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'inventory',
      title: 'Nuevo item agregado al inventario',
      time: 'Hace 6 horas',
      status: 'info',
      icon: Boxes
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Mantenimiento programado para mañana',
      time: 'Hace 1 día',
      status: 'warning',
      icon: Clock
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="h3 mb-0">Dashboard</h1>
        <p className="text-muted">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Col key={index} md={6} lg={3} className="mb-3">
              <Card className="card-custom h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="card-title text-muted text-uppercase small mb-1">
                        {stat.title}
                      </h6>
                      <h3 className="card-value text-primary-custom mb-1">
                        {stat.value}
                      </h3>
                      <small className={`text-${stat.color}`}>
                        {stat.change}
                      </small>
                    </div>
                    <div className={`text-${stat.color}`}>
                      <Icon size={32} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Gráficos */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Tendencia de Incidencias</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line data={incidentsData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Estado de Mantenimientos</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut data={maintenanceData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6}>
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Eficiencia Semanal</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px' }}>
                <Bar data={efficiencyData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Actividad Reciente</h5>
            </Card.Header>
            <Card.Body>
              <div className="list-group list-group-flush">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="list-group-item px-0 border-0">
                      <div className="d-flex align-items-center">
                        <div className={`text-${activity.status} me-3`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{activity.title}</h6>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                        <span className={`badge bg-${activity.status} badge-custom`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Quick Actions */}
        <Col lg={12}>
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2 d-md-flex">
                <button className="btn btn-outline-primary">
                  <TriangleAlert className="me-2" size={16} />
                  Reportar Incidencia
                </button>
                <button className="btn btn-outline-info">
                  <Boxes className="me-2" size={16} />
                  Agregar Item
                </button>
                <button className="btn btn-outline-warning">
                  <Wrench className="me-2" size={16} />
                  Programar Mantenimiento
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
