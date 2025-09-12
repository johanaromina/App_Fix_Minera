import { HttpClient } from './http';
import {
  InventarioItem,
  MovimientoInventario,
  InventarioFilters,
  ApiResponse,
  PaginatedResponse,
} from './types';

export class InventarioService {
  constructor(private http: HttpClient) {}

  async getAll(filters?: InventarioFilters): Promise<PaginatedResponse<InventarioItem>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.http.get<ApiResponse<PaginatedResponse<InventarioItem>>>(
      `/inventario?${params.toString()}`
    );
    return response.data!;
  }

  async getById(id: string): Promise<InventarioItem> {
    const response = await this.http.get<ApiResponse<InventarioItem>>(`/inventario/${id}`);
    return response.data!;
  }

  async create(item: Partial<InventarioItem>): Promise<InventarioItem> {
    const response = await this.http.post<ApiResponse<InventarioItem>>('/inventario', item);
    return response.data!;
  }

  async update(id: string, item: Partial<InventarioItem>): Promise<InventarioItem> {
    const response = await this.http.put<ApiResponse<InventarioItem>>(`/inventario/${id}`, item);
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/inventario/${id}`);
  }

  async getMovimientos(itemId: string): Promise<MovimientoInventario[]> {
    const response = await this.http.get<ApiResponse<MovimientoInventario[]>>(
      `/inventario/${itemId}/movimientos`
    );
    return response.data!;
  }

  async createMovimiento(
    itemId: string,
    movimiento: Partial<MovimientoInventario>
  ): Promise<MovimientoInventario> {
    const response = await this.http.post<ApiResponse<MovimientoInventario>>(
      `/inventario/${itemId}/movimientos`,
      movimiento
    );
    return response.data!;
  }

  async generateQRCode(id: string): Promise<{ qrCode: string }> {
    const response = await this.http.get<ApiResponse<{ qrCode: string }>>(
      `/inventario/${id}/qr`
    );
    return response.data!;
  }

  async scanQRCode(qrCode: string): Promise<InventarioItem> {
    const response = await this.http.get<ApiResponse<InventarioItem>>(
      `/inventario/qr/${qrCode}`
    );
    return response.data!;
  }

  async updateEstado(id: string, estado: string): Promise<InventarioItem> {
    const response = await this.http.patch<ApiResponse<InventarioItem>>(
      `/inventario/${id}/estado`,
      { estado }
    );
    return response.data!;
  }

  async transferir(id: string, sitioId: number, observacion?: string): Promise<MovimientoInventario> {
    const response = await this.http.post<ApiResponse<MovimientoInventario>>(
      `/inventario/${id}/transferir`,
      { sitio_id: sitioId, observacion }
    );
    return response.data!;
  }
}
