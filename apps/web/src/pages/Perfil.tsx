import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, ListGroup, Form } from 'react-bootstrap';
import { User, Mail, Phone, Calendar, Briefcase, FileText, Heart, Building, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Perfil: React.FC = () => {
  const { user } = useAuthStore();
  const [perfilData, setPerfilData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    telefono: '',
    direccion: '',
    numeroObraSocial: ''
  });

  useEffect(() => {
    // Simular carga de datos del perfil
    // En producción, esto vendría de la API
    const mockData = {
      nombre: user?.nombre || 'Gerardo',
      email: user?.email || 'gerardo@mineria.com',
      puesto: 'Supervisor de Operaciones',
      departamento: 'Operaciones',
      tipoContrato: 'Tiempo Completo',
      fechaIngreso: '2023-06-15',
      diasVacaciones: 14,
      diasDisponibles: 10,
      regimenTrabajo: '14x14',
      proximaRota: '2024-12-15',
      obraSocial: 'OSDE 210',
      numeroObraSocial: '12345678',
      telefono: '+54 11 1234-5678',
      direccion: 'Calle Principal 123, Buenos Aires',
      estadoActual: 'Activo',
      ultimaModificacion: '2024-01-10',
      responsabilidades: [
        'Supervisar operaciones diarias de extracción',
        'Monitorear sistemas de seguridad',
        'Coordinar equipos de mantenimiento',
        'Reportar incidencias y anomalías'
      ],
      certificaciones: [
        { nombre: 'Seguridad Minera Nivel 2', fecha: '2024-03-01', vigencia: '2025-03-01' },
        { nombre: 'Primeros Auxilios', fecha: '2023-11-15', vigencia: '2024-11-15' }
      ]
    };
    setPerfilData(mockData);
    setEditFormData({
      telefono: mockData.telefono,
      direccion: mockData.direccion,
      numeroObraSocial: mockData.numeroObraSocial
    });
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setFotoPreview(fotoPerfil);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar valores originales
    setEditFormData({
      telefono: perfilData?.telefono || '',
      direccion: perfilData?.direccion || '',
      numeroObraSocial: perfilData?.numeroObraSocial || ''
    });
    setFotoPreview(null);
  };

  const handleSave = () => {
    // Aquí iría la llamada a la API para guardar
    const updatedData = {
      ...perfilData,
      ...editFormData,
      ultimaModificacion: new Date().toISOString().split('T')[0]
    };
    
    // Actualizar la foto si hay cambios
    const newFoto = fotoPreview || null;
    setPerfilData(updatedData);
    setFotoPerfil(newFoto);
    setIsEditing(false);
    setFotoPreview(null);
    alert('Información actualizada exitosamente');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!perfilData) {
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
      <div className="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Mi Perfil</h1>
          <p className="text-muted">Información personal y laboral</p>
        </div>
        <div>
          {!isEditing ? (
            <Button variant="primary" onClick={handleEdit}>
              <Edit className="me-2" size={18} />
              Editar
            </Button>
          ) : (
            <div>
              <Button variant="success" className="me-2" onClick={handleSave}>
                <Save className="me-2" size={18} />
                Guardar
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                <X className="me-2" size={18} />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      <Row>
        {/* Información Personal */}
        <Col md={4}>
          <Card className="card-custom mb-4">
            <Card.Header>
              <User className="me-2" size={20} />
              Información Personal
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div className="position-relative d-inline-block">
                  <div className="bg-primary-custom rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ 
                         width: '100px', 
                         height: '100px',
                         backgroundImage: fotoPreview ? `url(${fotoPreview})` : fotoPerfil ? `url(${fotoPerfil})` : 'none',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center'
                       }}>
                    {!fotoPreview && !fotoPerfil && <User size={48} className="text-white" />}
                  </div>
                  {isEditing && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                      onClick={() => document.getElementById('fotoPerfilInput')?.click()}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  id="fotoPerfilInput"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <h4 className="mt-3 mb-1">{perfilData.nombre}</h4>
                <Badge bg="success">{perfilData.estadoActual}</Badge>
              </div>
              
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center">
                  <Mail size={16} className="me-3 text-primary-custom" />
                  <div className="flex-grow-1">
                    <small className="text-muted">Email</small>
                    <div className="text-muted">{perfilData.email}</div>
                    <small className="text-muted fst-italic">(No editable)</small>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-start">
                  <Phone size={16} className="me-3 text-primary-custom mt-2" />
                  <div className="flex-grow-1">
                    <small className="text-muted">Teléfono</small>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={editFormData.telefono}
                        onChange={(e) => setEditFormData({ ...editFormData, telefono: e.target.value })}
                        placeholder="Ingrese su teléfono"
                      />
                    ) : (
                      <div>{perfilData.telefono}</div>
                    )}
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-start">
                  <Building size={16} className="me-3 text-primary-custom mt-2" />
                  <div className="flex-grow-1">
                    <small className="text-muted">Dirección</small>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={editFormData.direccion}
                        onChange={(e) => setEditFormData({ ...editFormData, direccion: e.target.value })}
                        placeholder="Ingrese su dirección"
                      />
                    ) : (
                      <div>{perfilData.direccion}</div>
                    )}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Obra Social */}
          <Card className="card-custom mb-4">
            <Card.Header>
              <Heart className="me-2" size={20} />
              Obra Social
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <small className="text-muted">Obra Social</small>
                  <div className="fw-medium">{perfilData.obraSocial}</div>
                  <small className="text-muted fst-italic">(No editable)</small>
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-muted">Número</small>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      value={editFormData.numeroObraSocial}
                      onChange={(e) => setEditFormData({ ...editFormData, numeroObraSocial: e.target.value })}
                      placeholder="Ingrese el número de obra social"
                    />
                  ) : (
                    <div className="fw-medium">{perfilData.numeroObraSocial}</div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Información Laboral */}
        <Col md={8}>
          <Card className="card-custom mb-4">
            <Card.Header>
              <Briefcase className="me-2" size={20} />
              Información Laboral
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Puesto</small>
                    <div className="fw-medium">{perfilData.puesto}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Departamento</small>
                    <div className="fw-medium">{perfilData.departamento}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Tipo de Contrato</small>
                    <div className="fw-medium">{perfilData.tipoContrato}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Fecha de Ingreso</small>
                    <div className="fw-medium">{perfilData.fechaIngreso}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Régimen de Trabajo</small>
                    <Badge bg="info">{perfilData.regimenTrabajo}</Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Próxima Rota</small>
                    <div className="fw-medium">{perfilData.proximaRota}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Vacaciones */}
          <Card className="card-custom mb-4">
            <Card.Header>
              <Calendar className="me-2" size={20} />
              Vacaciones
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="text-center p-3 bg-light rounded">
                    <h5 className="text-primary">{perfilData.diasDisponibles}</h5>
                    <small className="text-muted">Días Disponibles</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-center p-3 bg-light rounded">
                    <h5 className="text-secondary">{perfilData.diasVacaciones}</h5>
                    <small className="text-muted">Total Anual</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Responsabilidades */}
          <Card className="card-custom mb-4">
            <Card.Header>
              <FileText className="me-2" size={20} />
              Responsabilidades
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {perfilData.responsabilidades.map((resp: string, index: number) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex align-items-center">
                      <span className="me-3 text-primary-custom">•</span>
                      {resp}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Certificaciones */}
          <Card className="card-custom">
            <Card.Header>
              <FileText className="me-2" size={20} />
              Certificaciones
            </Card.Header>
            <Card.Body>
              {perfilData.certificaciones.length > 0 ? (
                <ListGroup variant="flush">
                  {perfilData.certificaciones.map((cert: any, index: number) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-medium">{cert.nombre}</div>
                          <small className="text-muted">
                            Emitida: {cert.fecha} | Vence: {cert.vigencia}
                          </small>
                        </div>
                        <Badge bg={new Date(cert.vigencia) > new Date() ? 'success' : 'warning'}>
                          {new Date(cert.vigencia) > new Date() ? 'Vigente' : 'Vencida'}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted mb-0">No hay certificaciones registradas</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Perfil;

