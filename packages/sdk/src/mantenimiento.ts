import { HttpClient } from './http';
import {
  Mantenimiento,
  PlanMantenimiento,
  MantenimientoFilters,
  ApiResponse,
  PaginatedResponse,
} from './types';

export class MantenimientoService {
  constructor(private http: HttpClient) {}

  // Planes de Mantenimiento
  async getPlanes(): Promise<PlanMantenimiento[]> {
    const response = await this.http.get<ApiResponse<PlanMantenimiento[]>>('/mantenimiento/planes');
    return response.data!;
  }

  async getPlanById(id: string): Promise<PlanMantenimiento> {
    const response = await this.http.get<ApiResponse<PlanMantenimiento>>(`/mantenimiento/planes/${id}`);
    return response.data!;
  }

  async createPlan(plan: Partial<PlanMantenimiento>): Promise<PlanMantenimiento> {
    const response = await this.http.post<ApiResponse<PlanMantenimiento>>('/mantenimiento/planes', plan);
    return response.data!;
  }

  async updatePlan(id: string, plan: Partial<PlanMantenimiento>): Promise<PlanMantenimiento> {
    const response = await this.http.put<ApiResponse<PlanMantenimiento>>(`/mantenimiento/planes/${id}`, plan);
    return response.data!;
  }

  async deletePlan(id: string): Promise<void> {
    await this.http.delete(`/mantenimiento/planes/${id}`);
  }

  // Mantenimientos
  async getAll(filters?: MantenimientoFilters): Promise<PaginatedResponse<Mantenimiento>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.http.get<ApiResponse<PaginatedResponse<Mantenimiento>>>(
      `/mantenimiento?${params.toString()}`
    );
    return response.data!;
  }

  async getById(id: string): Promise<Mantenimiento> {
    const response = await this.http.get<ApiResponse<Mantenimiento>>(`/mantenimiento/${id}`);
    return response.data!;
  }

  async create(mantenimiento: Partial<Mantenimiento>): Promise<Mantenimiento> {
    const response = await this.http.post<ApiResponse<Mantenimiento>>('/mantenimiento', mantenimiento);
    return response.data!;
  }

  async update(id: string, mantenimiento: Partial<Mantenimiento>): Promise<Mantenimiento> {
    const response = await this.http.put<ApiResponse<Mantenimiento>>(`/mantenimiento/${id}`, mantenimiento);
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/mantenimiento/${id}`);
  }

  async execute(id: string, observacion?: string): Promise<Mantenimiento> {
    const response = await this.http.patch<ApiResponse<Mantenimiento>>(
      `/mantenimiento/${id}/execute`,
      { observacion }
    );
    return response.data!;
  }

  async complete(id: string, resultado: string, observacion?: string): Promise<Mantenimiento> {
    const response = await this.http.patch<ApiResponse<Mantenimiento>>(
      `/mantenimiento/${id}/complete`,
      { resultado, observacion }
    );
    return response.data!;
  }

  async cancel(id: string, motivo: string): Promise<Mantenimiento> {
    const response = await this.http.patch<ApiResponse<Mantenimiento>>(
      `/mantenimiento/${id}/cancel`,
      { motivo }
    );
    return response.data!;
  }

  async getPendientes(): Promise<Mantenimiento[]> {
    const response = await this.http.get<ApiResponse<Mantenimiento[]>>('/mantenimiento/pendientes');
    return response.data!;
  }

  async getVencidos(): Promise<Mantenimiento[]> {
    const response = await this.http.get<ApiResponse<Mantenimiento[]>>('/mantenimiento/vencidos');
    return response.data!;
  }

  async getEstadisticas(): Promise<{
    pendientes: number;
    en_proceso: number;
    completados: number;
    vencidos: number;
  }> {
    const response = await this.http.get<ApiResponse<{
      pendientes: number;
      en_proceso: number;
      completados: number;
      vencidos: number;
    }>>('/mantenimiento/estadisticas');
    return response.data!;
  }
}
