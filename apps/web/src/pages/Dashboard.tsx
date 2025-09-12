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

const Dashboard: React.FC = () => {
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

      <Row>
        {/* Recent Activities */}
        <Col lg={8}>
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

        {/* Quick Actions */}
        <Col lg={4}>
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
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
