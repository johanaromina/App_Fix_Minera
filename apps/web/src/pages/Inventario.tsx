import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, InputGroup, Form, Modal, Tabs, Tab } from 'react-bootstrap';
import { Plus, Search, Eye, Edit, Trash2, QrCode, Thermometer, Gauge, Zap, Droplets, Wind, Activity } from 'lucide-react';
import { inventarioService, InventarioItem } from '../services/inventarioService';
import { sensoresService, Sensor } from '../services/sensoresService';
import { mantenimientoService } from '../services/mantenimientoService';

const Inventario: React.FC = () => {
  // Common states
  const [loading, setLoading] = useState(true);
  const [sitios, setSitios] = useState<any[]>([]);

  // Inventory states
  const [items, setItems] = useState<InventarioItem[]>([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showInventoryViewModal, setShowInventoryViewModal] = useState(false);
  const [showInventoryEditModal, setShowInventoryEditModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventarioItem | null>(null);
  const [inventoryFormData, setInventoryFormData] = useState<{
    tipo: string;
    marca: string;
    modelo: string;
    nro_serie: string;
    codigo_qr: string;
    sitio_id: string;
    estado: 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja';
  }>({
    tipo: '',
    marca: '',
    modelo: '',
    nro_serie: '',
    codigo_qr: '',
    sitio_id: '',
    estado: 'operativo'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterSitio, setFilterSitio] = useState('');

  // Sensors states
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [showSensorViewModal, setShowSensorViewModal] = useState(false);
  const [showSensorEditModal, setShowSensorEditModal] = useState(false);
  const [showSensorLecturasModal, setShowSensorLecturasModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [lecturas, setLecturas] = useState<any[]>([]);
  const [sensorFormData, setSensorFormData] = useState<{
    sitio_id: string;
    tipo: 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo';
    descripcion: string;
    activo: boolean;
  }>({
    sitio_id: '',
    tipo: 'temperatura',
    descripcion: '',
    activo: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, sensoresData, sitiosData] = await Promise.all([
        inventarioService.getAll(),
        sensoresService.getAll(),
        mantenimientoService.getSitios()
      ]);
      
      setItems(itemsData);
      setSensores(sensoresData);
      setSitios(sitiosData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Inventory handlers
  const handleInventorySubmit = async () => {
    try {
      await inventarioService.create({
        ...inventoryFormData,
        sitio_id: parseInt(inventoryFormData.sitio_id),
        marca: inventoryFormData.marca || undefined,
        modelo: inventoryFormData.modelo || undefined,
        nro_serie: inventoryFormData.nro_serie || undefined
      });
      alert('Item agregado exitosamente');
      setShowInventoryModal(false);
      resetInventoryForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al agregar el item');
    }
  };

  const handleInventoryEdit = (item: InventarioItem) => {
    setSelectedInventoryItem(item);
    setInventoryFormData({
      tipo: item.tipo,
      marca: item.marca || '',
      modelo: item.modelo || '',
      nro_serie: item.nro_serie || '',
      codigo_qr: item.codigo_qr,
      sitio_id: item.sitio_id.toString(),
      estado: item.estado
    });
    setShowInventoryEditModal(true);
  };

  const handleInventoryEditSubmit = async () => {
    if (!selectedInventoryItem) return;
    
    try {
      await inventarioService.update(selectedInventoryItem.id, {
        ...inventoryFormData,
        sitio_id: parseInt(inventoryFormData.sitio_id),
        marca: inventoryFormData.marca || undefined,
        modelo: inventoryFormData.modelo || undefined,
        nro_serie: inventoryFormData.nro_serie || undefined
      });
      alert('Item actualizado exitosamente');
      setShowInventoryEditModal(false);
      resetInventoryForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar el item');
    }
  };

  const handleInventoryDelete = async (id: string) => {
    if (!confirm('¿Está seguro que desea eliminar este item?')) return;
    
    try {
      await inventarioService.delete(id);
      alert('Item eliminado exitosamente');
      loadData();
    } catch (error) {
      alert('Error al eliminar el item');
    }
  };

  const handleInventoryView = async (item: InventarioItem) => {
    setSelectedInventoryItem(item);
    setShowInventoryViewModal(true);
  };

  const resetInventoryForm = () => {
    setInventoryFormData({
      tipo: '',
      marca: '',
      modelo: '',
      nro_serie: '',
      codigo_qr: '',
      sitio_id: '',
      estado: 'operativo'
    });
  };

  // Sensor handlers
  const handleSensorSubmit = async () => {
    try {
      await sensoresService.create({
        tipo: sensorFormData.tipo,
        sitio_id: parseInt(sensorFormData.sitio_id),
        descripcion: sensorFormData.descripcion || undefined,
        activo: sensorFormData.activo
      });
      alert('Sensor agregado exitosamente');
      setShowSensorModal(false);
      resetSensorForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al agregar el sensor');
    }
  };

  const handleSensorEdit = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setSensorFormData({
      sitio_id: sensor.sitio_id.toString(),
      tipo: sensor.tipo as 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo',
      descripcion: sensor.descripcion || '',
      activo: sensor.activo
    });
    setShowSensorEditModal(true);
  };

  const handleSensorEditSubmit = async () => {
    if (!selectedSensor) return;
    
    try {
      await sensoresService.update(selectedSensor.id, {
        ...sensorFormData,
        sitio_id: parseInt(sensorFormData.sitio_id),
        descripcion: sensorFormData.descripcion || undefined
      });
      alert('Sensor actualizado exitosamente');
      setShowSensorEditModal(false);
      resetSensorForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar el sensor');
    }
  };

  const handleSensorDelete = async (id: string) => {
    if (!confirm('¿Está seguro que desea eliminar este sensor?')) return;
    
    try {
      await sensoresService.delete(id);
      alert('Sensor eliminado exitosamente');
      loadData();
    } catch (error) {
      alert('Error al eliminar el sensor');
    }
  };

  const handleSensorView = async (sensor: Sensor) => {
    setSelectedSensor(sensor);
    
    // Load lecturas
    try {
      const lecturasData = await sensoresService.getLecturas(sensor.id, 50);
      setLecturas(lecturasData);
    } catch (error) {
      console.error('Error loading lecturas:', error);
    }
    
    setShowSensorViewModal(true);
  };

  const handleSensorLecturas = async (sensor: Sensor) => {
    setSelectedSensor(sensor);
    try {
      const lecturasData = await sensoresService.getLecturas(sensor.id, 100);
      setLecturas(lecturasData);
      setShowSensorLecturasModal(true);
    } catch (error) {
      alert('Error al cargar las lecturas');
    }
  };

  const resetSensorForm = () => {
    setSensorFormData({
      sitio_id: '',
      tipo: 'temperatura',
      descripcion: '',
      activo: true
    });
  };

  const getStatusBadge = (estado: string) => {
    const variants = {
      operativo: 'success',
      mantenimiento: 'warning',
      fuera_de_servicio: 'danger',
      baja: 'secondary'
    };
    return variants[estado as keyof typeof variants] || 'secondary';
  };

  const getSensorIcon = (tipo: string) => {
    const icons: { [key: string]: any } = {
      temperatura: Thermometer,
      vibracion: Activity,
      energia: Zap,
      presion: Gauge,
      humedad: Droplets,
      flujo: Wind
    };
    const Icon = icons[tipo] || Activity;
    return <Icon size={16} />;
  };

  const getSensorColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      temperatura: 'danger',
      vibracion: 'warning',
      energia: 'info',
      presion: 'primary',
      humedad: 'primary',
      flujo: 'secondary'
    };
    return colors[tipo] || 'secondary';
  };

  // Filter inventory
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nro_serie?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === '' || item.estado === filterEstado;
    const matchesSitio = filterSitio === '' || item.sitio_id.toString() === filterSitio;
    
    return matchesSearch && matchesEstado && matchesSitio;
  });

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Tipo', 'Marca', 'Modelo', 'N° Serie', 'QR', 'Estado', 'Sitio'],
      ...filteredItems.map(item => [
        item.id,
        item.tipo,
        item.marca || '',
        item.modelo || '',
        item.nro_serie || '',
        item.codigo_qr,
        item.estado,
        item.sitio_nombre || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header mb-4">
        <h1 className="h3 mb-0">Inventario</h1>
        <p className="text-muted">Gestión de equipos, materiales y sensores IoT</p>
      </div>

      <Tabs defaultActiveKey="inventario" className="mb-4">
        {/* INVENTARIO TAB */}
        <Tab eventKey="inventario" title="Equipos y Materiales">
          <div className="mb-3 d-flex justify-content-end">
            <Button variant="primary-custom" onClick={() => setShowInventoryModal(true)}>
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
                    <Form.Control 
                      placeholder="Buscar por tipo, marca, modelo..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="operativo">Operativo</option>
                    <option value="mantenimiento">En Mantenimiento</option>
                    <option value="fuera_de_servicio">Fuera de Servicio</option>
                    <option value="baja">Baja</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    value={filterSitio}
                    onChange={(e) => setFilterSitio(e.target.value)}
                  >
                    <option value="">Todos los sitios</option>
                    {sitios.map(sitio => (
                      <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button variant="outline-secondary" className="w-100" onClick={() => {
                    setSearchTerm('');
                    setFilterEstado('');
                    setFilterSitio('');
                  }}>
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Inventory Table */}
          <Card className="card-custom">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Items del Inventario</h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-info" size="sm" disabled>
                    <QrCode className="me-1" size={14} />
                    Escanear QR
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={handleExport}>
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
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4">
                        <div className="text-muted">No hay items de inventario</div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td><code>{item.id}</code></td>
                        <td>{item.tipo}</td>
                        <td>{item.marca || '-'}</td>
                        <td>{item.modelo || '-'}</td>
                        <td><code>{item.nro_serie || '-'}</code></td>
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
                        <td>{item.sitio_nombre}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm" onClick={() => handleInventoryView(item)}>
                              <Eye size={14} />
                            </Button>
                            <Button variant="outline-warning" size="sm" onClick={() => handleInventoryEdit(item)}>
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleInventoryDelete(item.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* SENSORES IOT TAB */}
        <Tab eventKey="sensores" title="Sensores IoT">
          <div className="mb-3 d-flex justify-content-end">
            <Button variant="primary-custom" onClick={() => setShowSensorModal(true)}>
              <Plus className="me-2" size={16} />
              Agregar Sensor
            </Button>
          </div>

          {/* Sensors Grid */}
          <Row>
            {sensores.length === 0 ? (
              <Col xs={12}>
                <Card className="card-custom text-center py-4">
                  <div className="text-muted">No hay sensores registrados</div>
                </Card>
              </Col>
            ) : (
              sensores.map((sensor) => (
                <Col key={sensor.id} md={6} lg={4} className="mb-3">
                  <Card className="card-custom h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <Badge bg={getSensorColor(sensor.tipo)} className="me-2" style={{ padding: '8px' }}>
                          {getSensorIcon(sensor.tipo)}
                        </Badge>
                        <div className="flex-grow-1">
                          <h6 className="mb-0 text-capitalize">{sensor.tipo}</h6>
                          <small className="text-muted">{sensor.sitio_nombre}</small>
                        </div>
                        {sensor.activo ? (
                          <Badge bg="success">Activo</Badge>
                        ) : (
                          <Badge bg="secondary">Inactivo</Badge>
                        )}
                      </div>
                      
                      {sensor.descripcion && (
                        <p className="small text-muted mb-3">{sensor.descripcion}</p>
                      )}
                      
                      <div className="d-flex gap-1">
                        <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleSensorView(sensor)}>
                          <Eye size={14} />
                        </Button>
                        <Button variant="outline-info" size="sm" className="flex-grow-1" onClick={() => handleSensorLecturas(sensor)}>
                          <Activity size={14} />
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={() => handleSensorEdit(sensor)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleSensorDelete(sensor.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Tab>
      </Tabs>

      {/* ADD INVENTORY MODAL */}
      <Modal show={showInventoryModal} onHide={() => { setShowInventoryModal(false); resetInventoryForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Item de Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo *</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.tipo}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, tipo: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.marca}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, marca: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Modelo</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.modelo}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, modelo: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>N° Serie</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.nro_serie}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, nro_serie: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Código QR *</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.codigo_qr}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, codigo_qr: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sitio *</Form.Label>
                <Form.Select
                  value={inventoryFormData.sitio_id}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, sitio_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={inventoryFormData.estado}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, estado: e.target.value as 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja' })}
                >
                  <option value="operativo">Operativo</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="fuera_de_servicio">Fuera de Servicio</option>
                  <option value="baja">Baja</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowInventoryModal(false); resetInventoryForm(); }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleInventorySubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT INVENTORY MODAL */}
      <Modal show={showInventoryEditModal} onHide={() => { setShowInventoryEditModal(false); resetInventoryForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Item de Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo *</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.tipo}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, tipo: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.marca}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, marca: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Modelo</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.modelo}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, modelo: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>N° Serie</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.nro_serie}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, nro_serie: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Código QR *</Form.Label>
                <Form.Control
                  type="text"
                  value={inventoryFormData.codigo_qr}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, codigo_qr: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sitio *</Form.Label>
                <Form.Select
                  value={inventoryFormData.sitio_id}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, sitio_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={inventoryFormData.estado}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, estado: e.target.value as 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja' })}
                >
                  <option value="operativo">Operativo</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="fuera_de_servicio">Fuera de Servicio</option>
                  <option value="baja">Baja</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowInventoryEditModal(false); resetInventoryForm(); }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleInventoryEditSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* VIEW INVENTORY MODAL */}
      <Modal show={showInventoryViewModal} onHide={() => setShowInventoryViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInventoryItem && (
            <Row>
              <Col md={6}>
                <p><strong>ID:</strong> <code>{selectedInventoryItem.id}</code></p>
                <p><strong>Tipo:</strong> {selectedInventoryItem.tipo}</p>
                <p><strong>Marca:</strong> {selectedInventoryItem.marca || '-'}</p>
                <p><strong>Modelo:</strong> {selectedInventoryItem.modelo || '-'}</p>
              </Col>
              <Col md={6}>
                <p><strong>N° Serie:</strong> <code>{selectedInventoryItem.nro_serie || '-'}</code></p>
                <p><strong>Código QR:</strong> <Badge bg="info">{selectedInventoryItem.codigo_qr}</Badge></p>
                <p><strong>Estado:</strong> <Badge bg={getStatusBadge(selectedInventoryItem.estado)} className="badge-custom">{selectedInventoryItem.estado.replace('_', ' ').toUpperCase()}</Badge></p>
                <p><strong>Sitio:</strong> {selectedInventoryItem.sitio_nombre}</p>
              </Col>
              <Col md={12}>
                <p><strong>Fecha Creación:</strong> {new Date(selectedInventoryItem.created_at).toLocaleString()}</p>
                <p><strong>Última Actualización:</strong> {new Date(selectedInventoryItem.updated_at).toLocaleString()}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInventoryViewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ADD SENSOR MODAL */}
      <Modal show={showSensorModal} onHide={() => { setShowSensorModal(false); resetSensorForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Sensor IoT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sitio *</Form.Label>
                <Form.Select
                  value={sensorFormData.sitio_id}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, sitio_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo *</Form.Label>
                <Form.Select
                  value={sensorFormData.tipo}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, tipo: e.target.value as 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo' })}
                  required
                >
                  <option value="temperatura">Temperatura</option>
                  <option value="vibracion">Vibración</option>
                  <option value="energia">Energía</option>
                  <option value="presion">Presión</option>
                  <option value="humedad">Humedad</option>
                  <option value="flujo">Flujo</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={sensorFormData.descripcion}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, descripcion: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  label="Activo"
                  checked={sensorFormData.activo}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, activo: e.target.checked })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowSensorModal(false); resetSensorForm(); }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSensorSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT SENSOR MODAL */}
      <Modal show={showSensorEditModal} onHide={() => { setShowSensorEditModal(false); resetSensorForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Sensor IoT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sitio *</Form.Label>
                <Form.Select
                  value={sensorFormData.sitio_id}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, sitio_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo *</Form.Label>
                <Form.Select
                  value={sensorFormData.tipo}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, tipo: e.target.value as 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo' })}
                  required
                >
                  <option value="temperatura">Temperatura</option>
                  <option value="vibracion">Vibración</option>
                  <option value="energia">Energía</option>
                  <option value="presion">Presión</option>
                  <option value="humedad">Humedad</option>
                  <option value="flujo">Flujo</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={sensorFormData.descripcion}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, descripcion: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  label="Activo"
                  checked={sensorFormData.activo}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, activo: e.target.checked })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowSensorEditModal(false); resetSensorForm(); }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSensorEditSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* VIEW SENSOR MODAL */}
      <Modal show={showSensorViewModal} onHide={() => setShowSensorViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Sensor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSensor && (
            <Row>
              <Col md={6}>
                <p><strong>ID:</strong> <code>{selectedSensor.id}</code></p>
                <p><strong>Tipo:</strong> 
                  <Badge bg={getSensorColor(selectedSensor.tipo)} className="ms-2">
                    {getSensorIcon(selectedSensor.tipo)}
                    <span className="ms-1 text-capitalize">{selectedSensor.tipo}</span>
                  </Badge>
                </p>
                <p><strong>Sitio:</strong> {selectedSensor.sitio_nombre}</p>
                <p><strong>Estado:</strong> {selectedSensor.activo ? <Badge bg="success">Activo</Badge> : <Badge bg="secondary">Inactivo</Badge>}</p>
              </Col>
              <Col md={6}>
                {selectedSensor.descripcion && (
                  <p><strong>Descripción:</strong> {selectedSensor.descripcion}</p>
                )}
                <p><strong>Fecha Creación:</strong> {new Date(selectedSensor.created_at).toLocaleString()}</p>
                <p><strong>Última Actualización:</strong> {new Date(selectedSensor.updated_at).toLocaleString()}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSensorViewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* LECTURAS MODAL */}
      <Modal show={showSensorLecturasModal} onHide={() => setShowSensorLecturasModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lecturas del Sensor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSensor && (
            <>
              <div className="mb-3">
                <strong>Tipo:</strong> <span className="text-capitalize">{selectedSensor.tipo}</span> - 
                <strong className="ms-2">Sitio:</strong> {selectedSensor.sitio_nombre}
              </div>
              {lecturas.length === 0 ? (
                <p className="text-muted">No hay lecturas registradas</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Fecha/Hora</th>
                        <th>Valor</th>
                        <th>Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lecturas.map(lectura => (
                        <tr key={lectura.id}>
                          <td>{new Date(lectura.timestamp).toLocaleString()}</td>
                          <td>{lectura.valor}</td>
                          <td>{lectura.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSensorLecturasModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inventario;
