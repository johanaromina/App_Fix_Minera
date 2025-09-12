import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const Incidencias: React.FC = () => {
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

  const getPriorityBadge = (prioridad: string) => {
    const variants = {
      critica: 'danger',
      alta: 'warning',
      media: 'info',
      baja: 'secondary'
    };
    return variants[prioridad as keyof typeof variants] || 'secondary';
  };

  const getStatusBadge = (estado: string) => {
    const variants = {
      abierta: 'danger',
      en_proceso: 'warning',
      cerrada: 'success',
      cancelada: 'secondary'
    };
    return variants[estado as keyof typeof variants] || 'secondary';
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Incidencias</h1>
          <p className="text-muted">Gestión de incidencias y reportes</p>
        </div>
        <Button variant="primary-custom">
          <Plus className="me-2" size={16} />
          Nueva Incidencia
        </Button>
      </div>

      <Card className="card-custom">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Lista de Incidencias</h5>
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
                <th>Título</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Sitio</th>
                <th>Fecha</th>
                <th>Reportado por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((incidencia) => (
                <tr key={incidencia.id}>
                  <td>
                    <code>{incidencia.id}</code>
                  </td>
                  <td>
                    <div className="fw-medium">{incidencia.titulo}</div>
                  </td>
                  <td>
                    <Badge bg={getPriorityBadge(incidencia.prioridad)} className="badge-custom">
                      {incidencia.prioridad.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadge(incidencia.estado)} className="badge-custom">
                      {incidencia.estado.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>{incidencia.sitio}</td>
                  <td>{incidencia.fecha}</td>
                  <td>{incidencia.reportado}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm">
                        <Eye size={14} />
                      </Button>
                      <Button variant="outline-warning" size="sm">
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <Trash2 size={14} />
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

export default Incidencias;
