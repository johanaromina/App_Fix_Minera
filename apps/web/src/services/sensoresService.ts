import api from './api';

export interface Sensor {
  id: string;
  sitio_id: number;
  tipo: 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo';
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  sitio_nombre?: string;
}

export interface LecturaSensor {
  id: string;
  sensor_id: string;
  timestamp: string;
  valor: number;
  unidad: string;
  created_at: string;
}

export interface CreateSensorDto {
  sitio_id: number;
  tipo: 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo';
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateSensorDto {
  sitio_id?: number;
  tipo?: 'temperatura' | 'vibracion' | 'energia' | 'presion' | 'humedad' | 'flujo';
  descripcion?: string;
  activo?: boolean;
}

class SensoresService {
  async getAll(): Promise<Sensor[]> {
    const response = await api.get<{ success: boolean; data: Sensor[] }>('/sensores');
    return response.data.data;
  }

  async getById(id: string): Promise<Sensor> {
    const response = await api.get<{ success: boolean; data: Sensor }>(`/sensores/${id}`);
    return response.data.data;
  }

  async getLecturas(id: string, limit?: number): Promise<LecturaSensor[]> {
    const url = limit 
      ? `/sensores/${id}/lecturas?limit=${limit}`
      : `/sensores/${id}/lecturas`;
    const response = await api.get<{ success: boolean; data: LecturaSensor[] }>(url);
    return response.data.data;
  }

  async create(sensor: CreateSensorDto): Promise<Sensor> {
    const response = await api.post<{ success: boolean; data: Sensor }>('/sensores', sensor);
    return response.data.data;
  }

  async update(id: string, sensor: UpdateSensorDto): Promise<Sensor> {
    const response = await api.put<{ success: boolean; data: Sensor }>(`/sensores/${id}`, sensor);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete<{ success: boolean; message: string }>(`/sensores/${id}`);
  }
}

export const sensoresService = new SensoresService();

