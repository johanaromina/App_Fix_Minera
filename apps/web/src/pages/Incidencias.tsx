import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { incidenciasService } from '../services/incidenciasService';

const Incidencias: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showObservacionModal, setShowObservacionModal] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = useState<any>(null);
  const [nuevaObservacion, setNuevaObservacion] = useState('');
  const [filters, setFilters] = useState({
    prioridad: '',
    estado: '',
    sitio: ''
  });
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    sitio: '',
    estado: 'abierta',
    fecha: new Date().toISOString().split('T')[0],
    reportado: 'Usuario Actual',
    equipoResponsable: '',
    tiempoEstimado: '',
    impacto: 'Medio',
    sectores: [] as string[],
    avances: [] as string[],
    bloqueos: [] as string[],
    alertas: [] as string[]
  });
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar incidencias desde la API
  useEffect(() => {
    const loadIncidencias = async () => {
      try {
        const data = await incidenciasService.getAll();
        // Transformar los datos para que coincidan con el formato esperado
        const transformedData = data.map((inc: any) => ({
          id: inc.id,
          titulo: inc.titulo,
          descripcion: inc.descripcion || '',
          prioridad: inc.prioridad,
          estado: inc.estado,
          sitio: inc.sitio_nombre || `Sitio ${inc.sitio_id}`,
          fecha: inc.fecha_creacion ? new Date(inc.fecha_creacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          reportado: inc.reporta_nombre || inc.usuario_reporta_id,
          observaciones: [],
          avances: [],
          bloqueos: [],
          sectores: [],
          alertas: [],
          equipoResponsable: '',
          tiempoEstimado: '',
          impacto: 'Medio'
        }));
        setIncidencias(transformedData);
      } catch (error) {
        console.error('Error cargando incidencias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidencias();
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.sitio.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevaIncidencia = {
      id: `INC-${String(incidencias.length + 1).padStart(3, '0')}`,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
      estado: formData.estado,
      sitio: formData.sitio,
      fecha: formData.fecha,
      reportado: formData.reportado,
      equipoResponsable: formData.equipoResponsable,
      tiempoEstimado: formData.tiempoEstimado,
      impacto: formData.impacto,
      sectores: formData.sectores,
      avances: formData.avances,
      bloqueos: formData.bloqueos,
      alertas: formData.alertas,
      observaciones: []
    };

    // Agregar la nueva incidencia a la lista
    setIncidencias([...incidencias, nuevaIncidencia]);

    alert(`Incidencia ${nuevaIncidencia.id} creada exitosamente`);
    setShowModal(false);
    setFormData({
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      sitio: '',
      estado: 'abierta',
      fecha: new Date().toISOString().split('T')[0],
      reportado: 'Usuario Actual',
      equipoResponsable: '',
      tiempoEstimado: '',
      impacto: 'Medio',
      sectores: [],
      avances: [],
      bloqueos: [],
      alertas: []
    });
  };

  // Filtrar incidencias
  const filteredIncidencias = incidencias.filter((incidencia) => {
    return (
      (!filters.prioridad || incidencia.prioridad === filters.prioridad) &&
      (!filters.estado || incidencia.estado === filters.estado) &&
      (!filters.sitio || incidencia.sitio.toLowerCase().includes(filters.sitio.toLowerCase()))
    );
  });

  // Exportar a CSV
  const handleExport = () => {
    const headers = ['ID', 'Título', 'Prioridad', 'Estado', 'Sitio', 'Fecha', 'Reportado por'];
    const csvContent = [
      headers.join(','),
      ...filteredIncidencias.map((inc) =>
        [
          inc.id,
          `"${inc.titulo}"`,
          inc.prioridad.toUpperCase(),
          inc.estado.replace('_', ' ').toUpperCase(),
          `"${inc.sitio}"`,
          inc.fecha,
          `"${inc.reportado}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `incidencias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      prioridad: '',
      estado: '',
      sitio: ''
    });
  };

  // Actualizar estado de incidencia
  const handleEstadoChange = (id: string, nuevoEstado: string) => {
    setIncidencias(incidencias.map(inc => 
      inc.id === id ? { ...inc, estado: nuevoEstado } : inc
    ));
  };

  // Ver incidencia
  const handleView = (incidencia: any) => {
    setSelectedIncidencia(incidencia);
    setShowViewModal(true);
  };

  // Editar incidencia
  const handleEdit = (incidencia: any) => {
    setSelectedIncidencia(incidencia);
    setFormData({
      titulo: incidencia.titulo || '',
      descripcion: incidencia.descripcion || '',
      prioridad: incidencia.prioridad || 'media',
      sitio: incidencia.sitio || '',
      estado: incidencia.estado || 'abierta',
      fecha: incidencia.fecha || new Date().toISOString().split('T')[0],
      reportado: incidencia.reportado || 'Usuario Actual',
      equipoResponsable: incidencia.equipoResponsable || '',
      tiempoEstimado: incidencia.tiempoEstimado || '',
      impacto: incidencia.impacto || 'Medio',
      sectores: incidencia.sectores || [],
      avances: incidencia.avances || [],
      bloqueos: incidencia.bloqueos || [],
      alertas: incidencia.alertas || []
    });
    setShowEditModal(true);
  };

  // Eliminar incidencia
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta incidencia?')) {
      setIncidencias(incidencias.filter(inc => inc.id !== id));
    }
  };

  // Guardar edición
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.sitio.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIncidencias(incidencias.map(inc =>
      inc.id === selectedIncidencia.id ? {
        ...inc,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad,
        estado: formData.estado,
        sitio: formData.sitio,
        fecha: formData.fecha,
        reportado: formData.reportado,
        equipoResponsable: formData.equipoResponsable,
        tiempoEstimado: formData.tiempoEstimado,
        impacto: formData.impacto,
        sectores: formData.sectores,
        avances: formData.avances,
        bloqueos: formData.bloqueos,
        alertas: formData.alertas
      } : inc
    ));

    alert('Incidencia actualizada exitosamente');
    setShowEditModal(false);
    setSelectedIncidencia(null);
    setFormData({
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      sitio: '',
      estado: 'abierta',
      fecha: new Date().toISOString().split('T')[0],
      reportado: 'Usuario Actual',
      equipoResponsable: '',
      tiempoEstimado: '',
      impacto: 'Medio',
      sectores: [],
      avances: [],
      bloqueos: [],
      alertas: []
    });
  };

  // Agregar observación
  const handleAgregarObservacion = () => {
    if (!nuevaObservacion.trim()) {
      alert('Por favor ingresa una observación');
      return;
    }

    const observacion = {
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'Usuario Actual',
      texto: nuevaObservacion
    };

    setIncidencias(incidencias.map(inc =>
      inc.id === selectedIncidencia.id ? {
        ...inc,
        observaciones: [...(inc.observaciones || []), observacion]
      } : inc
    ));

    // Actualizar la incidencia seleccionada
    setSelectedIncidencia({
      ...selectedIncidencia,
      observaciones: [...(selectedIncidencia.observaciones || []), observacion]
    });

    setNuevaObservacion('');
    setShowObservacionModal(false);
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Incidencias</h1>
          <p className="text-muted">Gestión de incidencias y reportes</p>
        </div>
        <Button variant="primary-custom" onClick={() => setShowModal(true)}>
          <Plus className="me-2" size={16} />
          Nueva Incidencia
        </Button>
      </div>

      <Card className="card-custom">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Lista de Incidencias</h5>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm" onClick={() => setShowFilterModal(true)}>
                Filtrar
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleExport}>
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
                {filteredIncidencias.map((incidencia) => (
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
                    <Form.Select
                      size="sm"
                      value={incidencia.estado}
                      onChange={(e) => handleEstadoChange(incidencia.id, e.target.value)}
                      style={{
                        width: 'auto',
                        display: 'inline-block',
                        minWidth: '120px',
                        backgroundColor: getStatusBadge(incidencia.estado) === 'danger' ? '#f8d7da' : 
                                       getStatusBadge(incidencia.estado) === 'warning' ? '#fff3cd' :
                                       getStatusBadge(incidencia.estado) === 'success' ? '#d1e7dd' : '#e9ecef',
                        borderColor: getStatusBadge(incidencia.estado) === 'danger' ? '#dc3545' : 
                                    getStatusBadge(incidencia.estado) === 'warning' ? '#ffc107' :
                                    getStatusBadge(incidencia.estado) === 'success' ? '#198754' : '#6c757d',
                        color: getStatusBadge(incidencia.estado) === 'danger' ? '#721c24' : 
                              getStatusBadge(incidencia.estado) === 'warning' ? '#856404' :
                              getStatusBadge(incidencia.estado) === 'success' ? '#0f5132' : '#495057',
                        fontWeight: 'bold'
                      }}
                    >
                      <option value="abierta">Abierta</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="cerrada">Cerrada</option>
                      <option value="cancelada">Cancelada</option>
                    </Form.Select>
                  </td>
                  <td>{incidencia.sitio}</td>
                  <td>{incidencia.fecha}</td>
                  <td>{incidencia.reportado}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" onClick={() => handleView(incidencia)}>
                        <Eye size={14} />
                      </Button>
                      <Button variant="outline-warning" size="sm" onClick={() => handleEdit(incidencia)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(incidencia.id)}>
                        <Trash2 size={14} />
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

      {/* Modal para crear nueva incidencia */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Incidencia</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título de la incidencia *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe la incidencia en detalle"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prioridad *</Form.Label>
              <div className="d-flex gap-2">
                {[
                  { value: 'critica', color: 'danger', label: 'CRÍTICA' },
                  { value: 'alta', color: 'warning', label: 'ALTA' },
                  { value: 'media', color: 'info', label: 'MEDIA' },
                  { value: 'baja', color: 'secondary', label: 'BAJA' }
                ].map((prioridad) => (
                  <Button
                    key={prioridad.value}
                    variant={formData.prioridad === prioridad.value ? prioridad.color : 'outline-secondary'}
                    onClick={() => setFormData({ ...formData, prioridad: prioridad.value })}
                    className="flex-fill"
                  >
                    {prioridad.label}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado *</Form.Label>
              <div className="d-flex gap-2">
                {[
                  { value: 'abierta', color: 'danger', label: 'ABIERTA' },
                  { value: 'en_proceso', color: 'warning', label: 'EN PROCESO' },
                  { value: 'cerrada', color: 'success', label: 'CERRADA' }
                ].map((estado) => (
                  <Button
                    key={estado.value}
                    variant={formData.estado === estado.value ? estado.color : 'outline-secondary'}
                    onClick={() => setFormData({ ...formData, estado: estado.value })}
                    className="flex-fill"
                  >
                    {estado.label}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sitio/Localización *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Planta Principal, Sector A"
                value={formData.sitio}
                onChange={(e) => setFormData({ ...formData, sitio: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reportado por *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={formData.reportado}
                onChange={(e) => setFormData({ ...formData, reportado: e.target.value })}
                required
              />
            </Form.Group>

            <hr />

            <h5 className="mb-3">Información Adicional</h5>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Equipo Responsable</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Mantenimiento, Operaciones"
                    value={formData.equipoResponsable}
                    onChange={(e) => setFormData({ ...formData, equipoResponsable: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tiempo Estimado</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 24 horas, 48 horas"
                    value={formData.tiempoEstimado}
                    onChange={(e) => setFormData({ ...formData, tiempoEstimado: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Impacto</Form.Label>
              <div className="d-flex gap-2">
                {[
                  { value: 'Alto', color: 'danger', label: 'ALTO' },
                  { value: 'Medio', color: 'warning', label: 'MEDIO' },
                  { value: 'Bajo', color: 'info', label: 'BAJO' }
                ].map((impacto) => (
                  <Button
                    key={impacto.value}
                    variant={formData.impacto === impacto.value ? impacto.color : 'outline-secondary'}
                    onClick={() => setFormData({ ...formData, impacto: impacto.value })}
                    className="flex-fill"
                  >
                    {impacto.label}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sectores Afectados (separados por comas)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Extracción, Procesamiento, Logística"
                value={formData.sectores.join(', ')}
                onChange={(e) => setFormData({ ...formData, sectores: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Avances (separados por puntos y comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Primera inspección realizada; Orden de reparación emitida"
                value={formData.avances.join('; ')}
                onChange={(e) => setFormData({ ...formData, avances: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bloqueos (separados por puntos y comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Falta de repuestos; Esperando técnico especializado"
                value={formData.bloqueos.join('; ')}
                onChange={(e) => setFormData({ ...formData, bloqueos: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alertas (separadas por puntos y comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Impacto en producción del 40%; Riesgo de seguridad"
                value={formData.alertas.join('; ')}
                onChange={(e) => setFormData({ ...formData, alertas: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Incidencia
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de filtros */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filtrar Incidencias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select
              value={filters.prioridad}
              onChange={(e) => setFilters({ ...filters, prioridad: e.target.value })}
            >
              <option value="">Todas</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="abierta">Abierta</option>
              <option value="en_proceso">En Proceso</option>
              <option value="cerrada">Cerrada</option>
              <option value="cancelada">Cancelada</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sitio</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por sitio..."
              value={filters.sitio}
              onChange={(e) => setFilters({ ...filters, sitio: e.target.value })}
            />
          </Form.Group>

          {(filters.prioridad || filters.estado || filters.sitio) && (
            <div className="text-muted small mb-3">
              {filteredIncidencias.length} incidencia(s) encontrada(s)
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={clearFilters}>
            Limpiar
          </Button>
          <Button variant="primary" onClick={() => setShowFilterModal(false)}>
            Aplicar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver incidencia */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Incidencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIncidencia && (
            <div>
              {/* Información Principal */}
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Información Principal</h5>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <strong>ID:</strong> <code>{selectedIncidencia.id}</code>
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Fecha:</strong> {selectedIncidencia.fecha}
                    </div>
                    <div className="col-12 mb-2">
                      <strong>Título:</strong> {selectedIncidencia.titulo}
                    </div>
                    <div className="col-12 mb-2">
                      <strong>Descripción:</strong> {selectedIncidencia.descripcion || 'Sin descripción'}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Prioridad:</strong>{' '}
                      <Badge bg={getPriorityBadge(selectedIncidencia.prioridad)} className="badge-custom">
                        {selectedIncidencia.prioridad.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Estado:</strong>{' '}
                      <Badge bg={getStatusBadge(selectedIncidencia.estado)} className="badge-custom">
                        {selectedIncidencia.estado.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Impacto:</strong>{' '}
                      <Badge bg={selectedIncidencia.impacto === 'Alto' ? 'danger' : selectedIncidencia.impacto === 'Medio' ? 'warning' : 'info'}>
                        {selectedIncidencia.impacto}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Detalles Adicionales */}
              <Card className="mb-3">
                <Card.Header className="bg-secondary text-white">
                  <h5 className="mb-0">Detalles Adicionales</h5>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <strong>Sitio:</strong> {selectedIncidencia.sitio}
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Equipo Responsable:</strong> {selectedIncidencia.equipoResponsable || 'No asignado'}
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Tiempo Estimado:</strong> {selectedIncidencia.tiempoEstimado || 'No definido'}
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Reportado por:</strong> {selectedIncidencia.reportado}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Sectores Afectados */}
              <Card className="mb-3">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">Sectores Afectados</h5>
                </Card.Header>
                <Card.Body>
                  {selectedIncidencia.sectores && selectedIncidencia.sectores.length > 0 ? (
                    selectedIncidencia.sectores.map((sector: string, index: number) => (
                      <Badge key={index} bg="primary" className="me-2 mb-2">
                        {sector}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">No hay sectores afectados</span>
                  )}
                </Card.Body>
              </Card>

              {/* Avances */}
              <Card className="mb-3">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Avances</h5>
                </Card.Header>
                <Card.Body>
                  {selectedIncidencia.avances && selectedIncidencia.avances.length > 0 ? (
                    <ul className="mb-0">
                      {selectedIncidencia.avances.map((avance: string, index: number) => (
                        <li key={index}>{avance}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">No hay avances registrados</span>
                  )}
                </Card.Body>
              </Card>

              {/* Bloqueos */}
              {selectedIncidencia.bloqueos && selectedIncidencia.bloqueos.length > 0 && (
                <Card className="mb-3">
                  <Card.Header className="bg-danger text-white">
                    <h5 className="mb-0">Bloqueos</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {selectedIncidencia.bloqueos.map((bloqueo: string, index: number) => (
                        <li key={index} className="text-danger">{bloqueo}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}

              {/* Alertas */}
              {selectedIncidencia.alertas && selectedIncidencia.alertas.length > 0 && (
                <Card className="mb-3">
                  <Card.Header className="bg-warning text-dark">
                    <h5 className="mb-0">Alertas</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {selectedIncidencia.alertas.map((alerta: string, index: number) => (
                        <li key={index} className="text-warning-emphasis">{alerta}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}

              {/* Observaciones */}
              <Card className="mb-3">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Observaciones</h5>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => setShowObservacionModal(true)}
                  >
                    + Agregar
                  </Button>
                </Card.Header>
                <Card.Body>
                  {selectedIncidencia.observaciones && selectedIncidencia.observaciones.length > 0 ? (
                    <div className="list-group">
                      {selectedIncidencia.observaciones.map((obs: any, index: number) => (
                        <div key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <strong>{obs.autor}</strong>
                            <small className="text-muted">{obs.fecha}</small>
                          </div>
                          <p className="mb-0 mt-1">{obs.texto}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">No hay observaciones registradas</span>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar observación */}
      <Modal show={showObservacionModal} onHide={() => setShowObservacionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Observación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Observación</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Ingresa tu observación..."
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowObservacionModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregarObservacion}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar incidencia */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Editar Incidencia</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título de la incidencia *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe la incidencia en detalle"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prioridad *</Form.Label>
              <div className="d-flex gap-2">
                {[
                  { value: 'critica', color: 'danger', label: 'CRÍTICA' },
                  { value: 'alta', color: 'warning', label: 'ALTA' },
                  { value: 'media', color: 'info', label: 'MEDIA' },
                  { value: 'baja', color: 'secondary', label: 'BAJA' }
                ].map((prioridad) => (
                  <Button
                    key={prioridad.value}
                    variant={formData.prioridad === prioridad.value ? prioridad.color : 'outline-secondary'}
                    onClick={() => setFormData({ ...formData, prioridad: prioridad.value })}
                    className="flex-fill"
                  >
                    {prioridad.label}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado *</Form.Label>
              <div className="d-flex gap-2">
                {[
                  { value: 'abierta', color: 'danger', label: 'ABIERTA' },
                  { value: 'en_proceso', color: 'warning', label: 'EN PROCESO' },
                  { value: 'cerrada', color: 'success', label: 'CERRADA' }
                ].map((estado) => (
                  <Button
                    key={estado.value}
                    variant={formData.estado === estado.value ? estado.color : 'outline-secondary'}
                    onClick={() => setFormData({ ...formData, estado: estado.value })}
                    className="flex-fill"
                  >
                    {estado.label}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sitio/Localización *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Planta Principal, Sector A"
                value={formData.sitio}
                onChange={(e) => setFormData({ ...formData, sitio: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reportado por *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={formData.reportado}
                onChange={(e) => setFormData({ ...formData, reportado: e.target.value })}
                required
              />
            </Form.Group>

            <hr />

            <h5 className="mb-3">Información Adicional</h5>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Equipo Responsable</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Mantenimiento, Operaciones"
                    value={formData.equipoResponsable}
                    onChange={(e) => setFormData({ ...formData, equipoResponsable: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tiempo Estimado</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 24 horas, 48 horas"
                    value={formData.tiempoEstimado}
                    onChange={(e) => setFormData({ ...formData, tiempoEstimado: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Impacto</Form.Label>
              <div className="d-flex gap-2">
                {[
                  { value: 'Alto', color: 'danger', label: 'ALTO' },
                  { value: 'Medio', color: 'warning', label: 'MEDIO' },
                  { value: 'Bajo', color: 'info', label: 'BAJO' }
                ].map((impacto) => (
                  <Button
                    key={impacto.value}
                    variant={formData.impacto === impacto.value ? impacto.color : 'outline-secondary'}
                    onClick={() => setFormData({ ...formData, impacto: impacto.value })}
                    className="flex-fill"
                  >
                    {impacto.label}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sectores Afectados (separados por comas)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Extracción, Procesamiento, Logística"
                value={formData.sectores.join(', ')}
                onChange={(e) => setFormData({ ...formData, sectores: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Avances (separados por puntos y comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Primera inspección realizada; Orden de reparación emitida"
                value={formData.avances.join('; ')}
                onChange={(e) => setFormData({ ...formData, avances: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bloqueos (separados por puntos y comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Falta de repuestos; Esperando técnico especializado"
                value={formData.bloqueos.join('; ')}
                onChange={(e) => setFormData({ ...formData, bloqueos: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alertas (separadas por puntos y comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ej: Impacto en producción del 40%; Riesgo de seguridad"
                value={formData.alertas.join('; ')}
                onChange={(e) => setFormData({ ...formData, alertas: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Incidencias;
