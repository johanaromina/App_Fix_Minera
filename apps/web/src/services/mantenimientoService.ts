import api from './api';

export interface Mantenimiento {
  id: string;
  plan_id: string;
  plan_nombre?: string;
  sitio_id: number;
  sitio_nombre?: string;
  item_id?: string;
  item_tipo?: string;
  item_marca?: string;
  item_modelo?: string;
  fecha_plan: string;
  fecha_ejecucion?: string;
  resultado: 'ok' | 'con_observaciones' | 'pendiente' | 'cancelado';
  observacion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlanMantenimiento {
  id: string;
  nombre: string;
  descripcion?: string;
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMantenimientoDto {
  plan_id: string;
  sitio_id: number;
  item_id?: string;
  fecha_plan: string;
  observacion?: string;
}

export interface UpdateMantenimientoDto {
  plan_id?: string;
  sitio_id?: number;
  item_id?: string;
  fecha_plan?: string;
  fecha_ejecucion?: string;
  resultado?: 'ok' | 'con_observaciones' | 'pendiente' | 'cancelado';
  observacion?: string;
}

export const mantenimientoService = {
  // Get all mantenimientos
  async getAll(): Promise<Mantenimiento[]> {
    const response = await api.get('/mantenimiento');
    return response.data.data;
  },

  // Get mantenimiento by id
  async getById(id: string): Promise<Mantenimiento> {
    const response = await api.get(`/mantenimiento/${id}`);
    return response.data.data;
  },

  // Get all planes
  async getPlanes(): Promise<PlanMantenimiento[]> {
    const response = await api.get('/mantenimiento/planes');
    return response.data.data;
  },

  // Get all sitios
  async getSitios(): Promise<any[]> {
    const response = await api.get('/mantenimiento/sitios');
    return response.data.data;
  },

  // Create mantenimiento
  async create(data: CreateMantenimientoDto): Promise<Mantenimiento> {
    const response = await api.post('/mantenimiento', data);
    return response.data.data;
  },

  // Update mantenimiento
  async update(id: string, data: UpdateMantenimientoDto): Promise<Mantenimiento> {
    const response = await api.put(`/mantenimiento/${id}`, data);
    return response.data.data;
  },

  // Delete mantenimiento
  async delete(id: string): Promise<void> {
    await api.delete(`/mantenimiento/${id}`);
  },
};

