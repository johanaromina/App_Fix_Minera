import api from './api';

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'abierta' | 'en_proceso' | 'cerrada' | 'cancelada';
  sitio_id: number;
  sitio_nombre?: string;
  usuario_reporta_id: string;
  usuario_atiende_id?: string;
  reporta_nombre?: string;
  atiende_nombre?: string;
  fecha_creacion: string;
  fecha_cierre?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIncidenciaDto {
  titulo: string;
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  sitio_id: number;
  usuario_reporta_id: string;
}

export interface UpdateIncidenciaDto {
  titulo?: string;
  descripcion?: string;
  prioridad?: 'baja' | 'media' | 'alta' | 'critica';
  estado?: 'abierta' | 'en_proceso' | 'cerrada' | 'cancelada';
  sitio_id?: number;
  usuario_atiende_id?: string;
}

export const incidenciasService = {
  // Get all incidencias
  async getAll(): Promise<Incidencia[]> {
    const response = await api.get('/incidencias');
    return response.data.data;
  },

  // Get incidencia by id
  async getById(id: string): Promise<Incidencia> {
    const response = await api.get(`/incidencias/${id}`);
    return response.data.data;
  },

  // Create incidencia
  async create(data: CreateIncidenciaDto): Promise<Incidencia> {
    const response = await api.post('/incidencias', data);
    return response.data.data;
  },

  // Update incidencia
  async update(id: string, data: UpdateIncidenciaDto): Promise<Incidencia> {
    const response = await api.put(`/incidencias/${id}`, data);
    return response.data.data;
  },

  // Delete incidencia
  async delete(id: string): Promise<void> {
    await api.delete(`/incidencias/${id}`);
  },
};

