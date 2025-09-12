import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, InputGroup, Form } from 'react-bootstrap';
import { Plus, Search, Eye, Edit, Trash2, QrCode } from 'lucide-react';

const Inventario: React.FC = () => {
  const items = [
    {
      id: 'ITEM-001',
      tipo: 'Bomba',
      marca: 'Grundfos',
      modelo: 'CR 32-4',
      nro_serie: 'GR123456',
      codigo_qr: 'QR001',
      estado: 'operativo',
      sitio: 'Planta Principal'
    },
    {
      id: 'ITEM-002',
      tipo: 'Motor',
      marca: 'Siemens',
      modelo: '1LA7 090-4',
      nro_serie: 'SI789012',
      codigo_qr: 'QR002',
      estado: 'mantenimiento',
      sitio: 'Sector A'
    },
    {
      id: 'ITEM-003',
      tipo: 'Válvula',
      marca: 'Fisher',
      modelo: 'V150',
      nro_serie: 'FI345678',
      codigo_qr: 'QR003',
      estado: 'fuera_de_servicio',
      sitio: 'Sector B'
    }
  ];

  const getStatusBadge = (estado: string) => {
    const variants = {
      operativo: 'success',
      mantenimiento: 'warning',
      fuera_de_servicio: 'danger',
      baja: 'secondary'
    };
    return variants[estado as keyof typeof variants] || 'secondary';
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Inventario</h1>
          <p className="text-muted">Gestión de equipos y materiales</p>
        </div>
        <Button variant="primary-custom">
          <Plus className="me-2" size={16} />
          Agregar Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-custom mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control placeholder="Buscar por tipo, marca, modelo..." />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option value="">Todos los estados</option>
                <option value="operativo">Operativo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="fuera_de_servicio">Fuera de Servicio</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option value="">Todos los sitios</option>
                <option value="planta">Planta Principal</option>
                <option value="sector-a">Sector A</option>
                <option value="sector-b">Sector B</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" className="w-100">
                Filtrar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="card-custom">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Items del Inventario</h5>
            <div className="d-flex gap-2">
              <Button variant="outline-info" size="sm">
                <QrCode className="me-1" size={14} />
                Escanear QR
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
                <th>Tipo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>N° Serie</th>
                <th>Código QR</th>
                <th>Estado</th>
                <th>Sitio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <code>{item.id}</code>
                  </td>
                  <td>{item.tipo}</td>
                  <td>{item.marca}</td>
                  <td>{item.modelo}</td>
                  <td>
                    <code>{item.nro_serie}</code>
                  </td>
                  <td>
                    <Badge bg="info" className="badge-custom">
                      {item.codigo_qr}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadge(item.estado)} className="badge-custom">
                      {item.estado.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>{item.sitio}</td>
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

export default Inventario;
