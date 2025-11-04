import api from './api';

export interface InventarioItem {
  id: string;
  sitio_id: number;
  tipo: string;
  marca: string | null;
  modelo: string | null;
  nro_serie: string | null;
  codigo_qr: string;
  estado: 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja';
  created_at: string;
  updated_at: string;
  sitio_nombre?: string;
}

export interface CreateInventarioItemDto {
  tipo: string;
  marca?: string;
  modelo?: string;
  nro_serie?: string;
  codigo_qr: string;
  sitio_id: number;
  estado?: 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja';
}

export interface UpdateInventarioItemDto {
  tipo?: string;
  marca?: string;
  modelo?: string;
  nro_serie?: string;
  codigo_qr?: string;
  sitio_id?: number;
  estado?: 'operativo' | 'fuera_de_servicio' | 'mantenimiento' | 'baja';
}

class InventarioService {
  async getAll(): Promise<InventarioItem[]> {
    const response = await api.get<{ success: boolean; data: InventarioItem[] }>('/inventario');
    return response.data.data;
  }

  async getById(id: string): Promise<InventarioItem> {
    const response = await api.get<{ success: boolean; data: InventarioItem }>(`/inventario/${id}`);
    return response.data.data;
  }

  async create(item: CreateInventarioItemDto): Promise<InventarioItem> {
    const response = await api.post<{ success: boolean; data: InventarioItem }>('/inventario', item);
    return response.data.data;
  }

  async update(id: string, item: UpdateInventarioItemDto): Promise<InventarioItem> {
    const response = await api.put<{ success: boolean; data: InventarioItem }>(`/inventario/${id}`, item);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete<{ success: boolean; message: string }>(`/inventario/${id}`);
  }
}

export const inventarioService = new InventarioService();

