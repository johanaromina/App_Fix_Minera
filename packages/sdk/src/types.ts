// Tipos compartidos entre frontend y mobile

export interface User {
  id: string;
  nombre: string;
  email: string;
  roles: string[];
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Incidencias
export interface Incidencia {
  id: string;
  titulo: string;
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'abierta' | 'en_proceso' | 'cerrada' | 'cancelada';
  fecha_creacion: string;
  fecha_cierre?: string;
  usuario_reporta_id: string;
  usuario_atiende_id?: string;
  sitio_id: number;
  sitio?: Sitio;
  reporta?: User;
  atiende?: User;
  anexos?: AnexoIncidencia[];
}

export interface AnexoIncidencia {
  id: string;
  incidencia_id: string;
  ruta_archivo: string;
  nombre_archivo: string;
  tipo_mime?: string;
  tamaño?: number;
  created_at: string;
}

// Sitios
export interface Sitio {
  id: number;
  nombre: string;
  descripcion?: string;
  lat: number;
  lng: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Inventario
export interface InventarioItem {
  id: string;
  sitio_id: number;
  tipo: string;
  marca?: string;
  modelo?: string;
  nro_serie?: string;
  codigo_qr: string;
  estado: 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja';
  created_at: string;
  updated_at: string;
  sitio?: Sitio;
}

export interface MovimientoInventario {
  id: string;
  item_id: string;
  usuario_id: string;
  fecha: string;
  tipo: 'alta' | 'baja' | 'entrega' | 'devolucion' | 'transferencia';
  observacion?: string;
  created_at: string;
  item?: InventarioItem;
  usuario?: User;
}

// Mantenimiento
export interface PlanMantenimiento {
  id: string;
  nombre: string;
  descripcion?: string;
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mantenimiento {
  id: string;
  plan_id: string;
  sitio_id: number;
  item_id?: string;
  fecha_plan: string;
  fecha_ejecucion?: string;
  resultado: 'ok' | 'con_observaciones' | 'pendiente' | 'cancelado';
  observacion?: string;
  created_at: string;
  updated_at: string;
  plan?: PlanMantenimiento;
  sitio?: Sitio;
  item?: InventarioItem;
}

// Sensores IoT
export interface Sensor {
  id: string;
  sitio_id: number;
  tipo: 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo';
  descripcion?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  sitio?: Sitio;
}

export interface LecturaSensor {
  id: string;
  sensor_id: string;
  timestamp: string;
  valor: number;
  unidad: string;
  created_at: string;
  sensor?: Sensor;
}

export interface AlertaIoT {
  id: string;
  sensor_id: string;
  tipo: string;
  nivel: 'info' | 'warning' | 'critical';
  timestamp: string;
  detalle?: string;
  resuelta: boolean;
  incidencia_id?: string;
  created_at: string;
  sensor?: Sensor;
  incidencia?: Incidencia;
}

// Notificaciones
export interface Notificacion {
  id: string;
  incidencia_id: string;
  tipo: string;
  destinatario: string;
  mensaje?: string;
  enviada: boolean;
  timestamp: string;
  created_at: string;
  incidencia?: Incidencia;
}

// Respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filtros y búsquedas
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IncidenciaFilters extends SearchParams {
  prioridad?: string;
  estado?: string;
  sitio_id?: number;
  usuario_reporta_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface InventarioFilters extends SearchParams {
  tipo?: string;
  estado?: string;
  sitio_id?: number;
  marca?: string;
}

export interface MantenimientoFilters extends SearchParams {
  plan_id?: string;
  sitio_id?: number;
  resultado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
