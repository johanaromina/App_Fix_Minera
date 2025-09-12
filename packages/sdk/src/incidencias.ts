import { HttpClient } from './http';
import {
  Incidencia,
  AnexoIncidencia,
  IncidenciaFilters,
  ApiResponse,
  PaginatedResponse,
} from './types';

export class IncidenciasService {
  constructor(private http: HttpClient) {}

  async getAll(filters?: IncidenciaFilters): Promise<PaginatedResponse<Incidencia>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.http.get<ApiResponse<PaginatedResponse<Incidencia>>>(
      `/incidencias?${params.toString()}`
    );
    return response.data!;
  }

  async getById(id: string): Promise<Incidencia> {
    const response = await this.http.get<ApiResponse<Incidencia>>(`/incidencias/${id}`);
    return response.data!;
  }

  async create(incidencia: Partial<Incidencia>): Promise<Incidencia> {
    const response = await this.http.post<ApiResponse<Incidencia>>('/incidencias', incidencia);
    return response.data!;
  }

  async update(id: string, incidencia: Partial<Incidencia>): Promise<Incidencia> {
    const response = await this.http.put<ApiResponse<Incidencia>>(`/incidencias/${id}`, incidencia);
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/incidencias/${id}`);
  }

  async assign(id: string, usuarioId: string): Promise<Incidencia> {
    const response = await this.http.patch<ApiResponse<Incidencia>>(
      `/incidencias/${id}/assign`,
      { usuario_atiende_id: usuarioId }
    );
    return response.data!;
  }

  async close(id: string, observacion?: string): Promise<Incidencia> {
    const response = await this.http.patch<ApiResponse<Incidencia>>(
      `/incidencias/${id}/close`,
      { observacion }
    );
    return response.data!;
  }

  async addAnexo(id: string, file: File): Promise<AnexoIncidencia> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.http.uploadFile<ApiResponse<AnexoIncidencia>>(
      `/incidencias/${id}/anexos`,
      formData
    );
    return response.data!;
  }

  async getAnexos(id: string): Promise<AnexoIncidencia[]> {
    const response = await this.http.get<ApiResponse<AnexoIncidencia[]>>(`/incidencias/${id}/anexos`);
    return response.data!;
  }

  async deleteAnexo(incidenciaId: string, anexoId: string): Promise<void> {
    await this.http.delete(`/incidencias/${incidenciaId}/anexos/${anexoId}`);
  }
}
