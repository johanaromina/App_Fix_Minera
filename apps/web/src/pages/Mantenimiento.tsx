import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Plus, Calendar, Wrench, CheckCircle, Clock } from 'lucide-react';

const Mantenimiento: React.FC = () => {
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

  const getResultBadge = (resultado: string) => {
    const variants = {
      ok: 'success',
      con_observaciones: 'warning',
      pendiente: 'info',
      cancelado: 'secondary'
    };
    return variants[resultado as keyof typeof variants] || 'secondary';
  };

  const getResultText = (resultado: string) => {
    const texts = {
      ok: 'Completado',
      con_observaciones: 'Con Observaciones',
      pendiente: 'Pendiente',
      cancelado: 'Cancelado'
    };
    return texts[resultado as keyof typeof texts] || resultado;
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Mantenimiento</h1>
          <p className="text-muted">Programación y seguimiento de mantenimientos</p>
        </div>
        <Button variant="primary-custom">
          <Plus className="me-2" size={16} />
          Programar Mantenimiento
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <Clock className="text-warning mb-2" size={32} />
              <h4 className="text-warning">5</h4>
              <small className="text-muted">Pendientes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <Wrench className="text-info mb-2" size={32} />
              <h4 className="text-info">3</h4>
              <small className="text-muted">En Proceso</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <CheckCircle className="text-success mb-2" size={32} />
              <h4 className="text-success">12</h4>
              <small className="text-muted">Completados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <Calendar className="text-primary mb-2" size={32} />
              <h4 className="text-primary">8</h4>
              <small className="text-muted">Esta Semana</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="card-custom">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Lista de Mantenimientos</h5>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm">
                Filtrar
              </Button>
              <Button variant="outline-secondary" size="sm">
                Exportar
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive className="table-custom mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan</th>
                <th>Sitio</th>
                <th>Item</th>
                <th>Fecha Plan</th>
                <th>Fecha Ejecución</th>
                <th>Resultado</th>
                <th>Responsable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((mantenimiento) => (
                <tr key={mantenimiento.id}>
                  <td>
                    <code>{mantenimiento.id}</code>
                  </td>
                  <td>{mantenimiento.plan}</td>
                  <td>{mantenimiento.sitio}</td>
                  <td>{mantenimiento.item}</td>
                  <td>{mantenimiento.fecha_plan}</td>
                  <td>
                    {mantenimiento.fecha_ejecucion || (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <Badge bg={getResultBadge(mantenimiento.resultado)} className="badge-custom">
                      {getResultText(mantenimiento.resultado)}
                    </Badge>
                  </td>
                  <td>{mantenimiento.responsable}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm">
                        <Wrench size={14} />
                      </Button>
                      <Button variant="outline-success" size="sm">
                        <CheckCircle size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Mantenimiento;
