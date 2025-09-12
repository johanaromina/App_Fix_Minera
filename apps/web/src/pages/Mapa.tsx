import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapPin, Layers, Filter } from 'lucide-react';

const Mapa: React.FC = () => {
  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Mapa Interactivo</h1>
          <p className="text-muted">Visualización geográfica de sitios y equipos</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary">
            <Filter className="me-2" size={16} />
            Filtros
          </Button>
          <Button variant="outline-info">
            <Layers className="me-2" size={16} />
            Capas
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="card-custom">
            <Card.Body className="p-0">
              <div 
                className="d-flex align-items-center justify-content-center"
                style={{ height: '500px', backgroundColor: '#f8f9fa' }}
              >
                <div className="text-center">
                  <MapPin size={64} className="text-muted mb-3" />
                  <h5 className="text-muted">Mapa Interactivo</h5>
                  <p className="text-muted">
                    Aquí se mostrará el mapa con Leaflet
                  </p>
                  <small className="text-muted">
                    Integración con React Leaflet pendiente
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="card-custom mb-3">
            <Card.Header>
              <h6 className="mb-0">Sitios Activos</h6>
            </Card.Header>
            <Card.Body>
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Planta Principal</h6>
                    <small className="text-muted">3 equipos activos</small>
                  </div>
                  <Badge bg="success">Operativo</Badge>
                </div>
                <div className="list-group-item px-0 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Sector A</h6>
                    <small className="text-muted">2 equipos activos</small>
                  </div>
                  <Badge bg="warning">Mantenimiento</Badge>
                </div>
                <div className="list-group-item px-0 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Sector B</h6>
                    <small className="text-muted">1 equipo activo</small>
                  </div>
                  <Badge bg="danger">Falla</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="card-custom">
            <Card.Header>
              <h6 className="mb-0">Leyenda</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
                  <small>Operativo</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
                  <small>Mantenimiento</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-danger rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
                  <small>Falla</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-info rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
                  <small>Sensor IoT</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Mapa;
