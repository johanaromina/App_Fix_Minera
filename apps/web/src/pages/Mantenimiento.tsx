import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Plus, Calendar, Wrench, CheckCircle, Clock } from 'lucide-react';
import { mantenimientoService } from '../services/mantenimientoService';

const Mantenimiento: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEjecutarModal, setShowEjecutarModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<any>(null);
  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);
  const [sitios, setSitios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    plan_id: '',
    sitio_id: '',
    item_id: '',
    fecha_plan: new Date().toISOString().split('T')[0],
    observacion: ''
  });
  const [ejecutarFormData, setEjecutarFormData] = useState({
    fecha_ejecucion: new Date().toISOString().slice(0, 16),
    resultado: 'ok',
    observacion: ''
  });

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [mantenimientosData, planesData, sitiosData] = await Promise.all([
          mantenimientoService.getAll(),
          mantenimientoService.getPlanes(),
          mantenimientoService.getSitios()
        ]);
        
        // Transformar datos para el formato esperado
        const transformedData = mantenimientosData.map((m: any) => ({
          id: m.id,
          plan: m.plan_nombre || 'Sin plan',
          sitio: m.sitio_nombre || `Sitio ${m.sitio_id}`,
          item: m.item_id ? `${m.item_tipo || ''} ${m.item_marca || ''} ${m.item_modelo || ''}`.trim() : '-',
          fecha_plan: m.fecha_plan ? new Date(m.fecha_plan).toISOString().split('T')[0] : '-',
          fecha_ejecucion: m.fecha_ejecucion ? new Date(m.fecha_ejecucion).toISOString().split('T')[0] : null,
          resultado: m.resultado || 'pendiente',
          responsable: '-'
        }));
        
        setMantenimientos(transformedData);
        setPlanes(planesData);
        setSitios(sitiosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plan_id || !formData.sitio_id || !formData.fecha_plan) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar que sitio_id sea un número válido
    const sitioIdNum = parseInt(formData.sitio_id, 10);
    if (isNaN(sitioIdNum) || sitioIdNum <= 0) {
      alert('Por favor selecciona un sitio válido');
      return;
    }

    try {
      await mantenimientoService.create({
        plan_id: formData.plan_id,
        sitio_id: sitioIdNum,
        item_id: formData.item_id && formData.item_id.trim() !== '' ? formData.item_id : undefined,
        fecha_plan: formData.fecha_plan,
        observacion: formData.observacion && formData.observacion.trim() !== '' ? formData.observacion : undefined
      });

      alert('Mantenimiento programado exitosamente');
      setShowModal(false);
      
      // Recargar datos
      const data = await mantenimientoService.getAll();
      const transformedData = data.map((m: any) => ({
        id: m.id,
        plan: m.plan_nombre || 'Sin plan',
        sitio: m.sitio_nombre || `Sitio ${m.sitio_id}`,
        item: m.item_id ? `${m.item_tipo || ''} ${m.item_marca || ''} ${m.item_modelo || ''}`.trim() : '-',
        fecha_plan: m.fecha_plan ? new Date(m.fecha_plan).toISOString().split('T')[0] : '-',
        fecha_ejecucion: m.fecha_ejecucion ? new Date(m.fecha_ejecucion).toISOString().split('T')[0] : null,
        resultado: m.resultado || 'pendiente',
        responsable: '-'
      }));
      setMantenimientos(transformedData);

      // Reset form
      setFormData({
        plan_id: '',
        sitio_id: '',
        item_id: '',
        fecha_plan: new Date().toISOString().split('T')[0],
        observacion: ''
      });
    } catch (error: any) {
      console.error('Error creando mantenimiento:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al programar el mantenimiento';
      alert(errorMessage);
    }
  };

  const handleViewClick = async (mantenimiento: any) => {
    try {
      // Cargar los datos completos del mantenimiento desde la API
      const mantenimientoCompleto = await mantenimientoService.getById(mantenimiento.id);
      setSelectedMantenimiento({
        ...mantenimientoCompleto,
        plan: mantenimiento.plan,
        sitio: mantenimiento.sitio,
        item: mantenimiento.item
      });
      setShowViewModal(true);
    } catch (error) {
      console.error('Error cargando detalles:', error);
      // Si falla, usar los datos que ya tenemos
      setSelectedMantenimiento(mantenimiento);
      setShowViewModal(true);
    }
  };

  const handleEjecutarClick = (mantenimiento: any) => {
    setSelectedMantenimiento(mantenimiento);
    setEjecutarFormData({
      fecha_ejecucion: new Date().toISOString().slice(0, 16),
      resultado: 'ok',
      observacion: ''
    });
    setShowEjecutarModal(true);
  };

  const handleEjecutarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMantenimiento) return;

    try {
      await mantenimientoService.update(selectedMantenimiento.id, {
        fecha_ejecucion: ejecutarFormData.fecha_ejecucion + ':00',
        resultado: ejecutarFormData.resultado as any,
        observacion: ejecutarFormData.observacion
      });

      alert('Mantenimiento ejecutado exitosamente');
      setShowEjecutarModal(false);
      setSelectedMantenimiento(null);
      
      // Recargar datos
      const data = await mantenimientoService.getAll();
      const transformedData = data.map((m: any) => ({
        id: m.id,
        plan: m.plan_nombre || 'Sin plan',
        sitio: m.sitio_nombre || `Sitio ${m.sitio_id}`,
        item: m.item_id ? `${m.item_tipo || ''} ${m.item_marca || ''} ${m.item_modelo || ''}`.trim() : '-',
        fecha_plan: m.fecha_plan ? new Date(m.fecha_plan).toISOString().split('T')[0] : '-',
        fecha_ejecucion: m.fecha_ejecucion ? new Date(m.fecha_ejecucion).toISOString().split('T')[0] : null,
        resultado: m.resultado || 'pendiente',
        responsable: '-'
      }));
      setMantenimientos(transformedData);
    } catch (error) {
      console.error('Error ejecutando mantenimiento:', error);
      alert('Error al ejecutar el mantenimiento');
    }
  };

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

  // Calcular estadísticas
  const stats = {
    pendientes: mantenimientos.filter(m => m.resultado === 'pendiente').length,
    enProceso: mantenimientos.filter(m => m.resultado === 'con_observaciones').length,
    completados: mantenimientos.filter(m => m.resultado === 'ok').length,
    estaSemana: mantenimientos.filter(m => {
      if (!m.fecha_plan) return false;
      const fecha = new Date(m.fecha_plan);
      const hoy = new Date();
      const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
      return fecha >= inicioSemana;
    }).length
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Mantenimiento</h1>
          <p className="text-muted">Programación y seguimiento de mantenimientos</p>
        </div>
        <Button variant="primary-custom" onClick={() => setShowModal(true)}>
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
              <h4 className="text-warning">{stats.pendientes}</h4>
              <small className="text-muted">Pendientes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <Wrench className="text-info mb-2" size={32} />
              <h4 className="text-info">{stats.enProceso}</h4>
              <small className="text-muted">En Proceso</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <CheckCircle className="text-success mb-2" size={32} />
              <h4 className="text-success">{stats.completados}</h4>
              <small className="text-muted">Completados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom text-center">
            <Card.Body>
              <Calendar className="text-primary mb-2" size={32} />
              <h4 className="text-primary">{stats.estaSemana}</h4>
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
          {loading ? (
            <div className="p-4 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
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
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewClick(mantenimiento)}
                      >
                        <Wrench size={14} />
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleEjecutarClick(mantenimiento)}
                      >
                        <CheckCircle size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para programar mantenimiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Programar Mantenimiento</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Plan de Mantenimiento *</Form.Label>
              <Form.Select
                value={formData.plan_id}
                onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                required
              >
                <option value="">Seleccione un plan</option>
                {planes.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - {plan.frecuencia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sitio *</Form.Label>
              <Form.Select
                value={formData.sitio_id}
                onChange={(e) => setFormData({ ...formData, sitio_id: e.target.value })}
                required
              >
                <option value="">Seleccione un sitio</option>
                {sitios.map((sitio) => (
                  <option key={sitio.id} value={sitio.id}>
                    {sitio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Item de Inventario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Opcional: código del item"
                value={formData.item_id}
                onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha Programada *</Form.Label>
              <Form.Control
                type="date"
                value={formData.fecha_plan}
                onChange={(e) => setFormData({ ...formData, fecha_plan: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Notas adicionales..."
                value={formData.observacion}
                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Programar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para ver detalles del mantenimiento */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Mantenimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMantenimiento && (
            <div>
              <h5>Información General</h5>
              <hr />
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>ID:</strong><br />
                  <code>{selectedMantenimiento.id}</code>
                </div>
                <div className="col-md-6">
                  <strong>Plan:</strong><br />
                  {selectedMantenimiento.plan}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Sitio:</strong><br />
                  {selectedMantenimiento.sitio}
                </div>
                <div className="col-md-6">
                  <strong>Item:</strong><br />
                  {selectedMantenimiento.item || '-'}
                </div>
              </div>

              <h5 className="mt-4">Fechas</h5>
              <hr />
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Fecha Programada:</strong><br />
                  {selectedMantenimiento.fecha_plan}
                </div>
                <div className="col-md-6">
                  <strong>Fecha de Ejecución:</strong><br />
                  {selectedMantenimiento.fecha_ejecucion ? (
                    new Date(selectedMantenimiento.fecha_ejecucion).toLocaleString('es-ES')
                  ) : (
                    <span className="text-muted">No ejecutado</span>
                  )}
                </div>
              </div>

              <h5 className="mt-4">Estado y Observaciones</h5>
              <hr />
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Resultado:</strong><br />
                  <Badge bg={getResultBadge(selectedMantenimiento.resultado)} className="badge-custom">
                    {getResultText(selectedMantenimiento.resultado)}
                  </Badge>
                </div>
              </div>
              {selectedMantenimiento.observacion && (
                <div className="mb-3">
                  <strong>Observaciones:</strong><br />
                  <div className="p-3 bg-light border rounded">
                    {selectedMantenimiento.observacion}
                  </div>
                </div>
              )}
              {!selectedMantenimiento.observacion && (
                <div className="text-muted">
                  No hay observaciones registradas
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ejecutar mantenimiento */}
      <Modal show={showEjecutarModal} onHide={() => setShowEjecutarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ejecutar Mantenimiento</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEjecutarSubmit}>
          <Modal.Body>
            {selectedMantenimiento && (
              <>
                <div className="mb-3">
                  <strong>Plan:</strong> {selectedMantenimiento.plan}<br />
                  <strong>Sitio:</strong> {selectedMantenimiento.sitio}
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Ejecución *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={ejecutarFormData.fecha_ejecucion}
                    onChange={(e) => setEjecutarFormData({ 
                      ...ejecutarFormData, 
                      fecha_ejecucion: e.target.value 
                    })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Resultado *</Form.Label>
                  <Form.Select
                    value={ejecutarFormData.resultado}
                    onChange={(e) => setEjecutarFormData({ 
                      ...ejecutarFormData, 
                      resultado: e.target.value 
                    })}
                    required
                  >
                    <option value="ok">Completado (OK)</option>
                    <option value="con_observaciones">Con Observaciones</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe el resultado del mantenimiento..."
                    value={ejecutarFormData.observacion}
                    onChange={(e) => setEjecutarFormData({ 
                      ...ejecutarFormData, 
                      observacion: e.target.value 
                    })}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEjecutarModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Confirmar Ejecución
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Mantenimiento;
