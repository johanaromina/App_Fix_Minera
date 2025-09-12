import { HttpClient } from './http';
import {
  Sensor,
  LecturaSensor,
  AlertaIoT,
  ApiResponse,
  PaginatedResponse,
} from './types';

export class IoTService {
  constructor(private http: HttpClient) {}

  // Sensores
  async getSensores(): Promise<Sensor[]> {
    const response = await this.http.get<ApiResponse<Sensor[]>>('/iot/sensores');
    return response.data!;
  }

  async getSensorById(id: string): Promise<Sensor> {
    const response = await this.http.get<ApiResponse<Sensor>>(`/iot/sensores/${id}`);
    return response.data!;
  }

  async createSensor(sensor: Partial<Sensor>): Promise<Sensor> {
    const response = await this.http.post<ApiResponse<Sensor>>('/iot/sensores', sensor);
    return response.data!;
  }

  async updateSensor(id: string, sensor: Partial<Sensor>): Promise<Sensor> {
    const response = await this.http.put<ApiResponse<Sensor>>(`/iot/sensores/${id}`, sensor);
    return response.data!;
  }

  async deleteSensor(id: string): Promise<void> {
    await this.http.delete(`/iot/sensores/${id}`);
  }

  // Lecturas de Sensores
  async getLecturas(sensorId: string, limit?: number): Promise<LecturaSensor[]> {
    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit.toString());
    }

    const response = await this.http.get<ApiResponse<LecturaSensor[]>>(
      `/iot/sensores/${sensorId}/lecturas?${params.toString()}`
    );
    return response.data!;
  }

  async createLectura(sensorId: string, lectura: Partial<LecturaSensor>): Promise<LecturaSensor> {
    const response = await this.http.post<ApiResponse<LecturaSensor>>(
      `/iot/sensores/${sensorId}/lecturas`,
      lectura
    );
    return response.data!;
  }

  async getLecturasRecientes(sensorId: string, horas: number = 24): Promise<LecturaSensor[]> {
    const response = await this.http.get<ApiResponse<LecturaSensor[]>>(
      `/iot/sensores/${sensorId}/lecturas/recientes?horas=${horas}`
    );
    return response.data!;
  }

  // Alertas IoT
  async getAlertas(): Promise<AlertaIoT[]> {
    const response = await this.http.get<ApiResponse<AlertaIoT[]>>('/iot/alertas');
    return response.data!;
  }

  async getAlertaById(id: string): Promise<AlertaIoT> {
    const response = await this.http.get<ApiResponse<AlertaIoT>>(`/iot/alertas/${id}`);
    return response.data!;
  }

  async createAlerta(alerta: Partial<AlertaIoT>): Promise<AlertaIoT> {
    const response = await this.http.post<ApiResponse<AlertaIoT>>('/iot/alertas', alerta);
    return response.data!;
  }

  async resolverAlerta(id: string): Promise<AlertaIoT> {
    const response = await this.http.patch<ApiResponse<AlertaIoT>>(`/iot/alertas/${id}/resolver`);
    return response.data!;
  }

  async getAlertasPendientes(): Promise<AlertaIoT[]> {
    const response = await this.http.get<ApiResponse<AlertaIoT[]>>('/iot/alertas/pendientes');
    return response.data!;
  }

  // Estadísticas IoT
  async getEstadisticas(): Promise<{
    sensores_activos: number;
    alertas_pendientes: number;
    lecturas_hoy: number;
    sensores_con_falla: number;
  }> {
    const response = await this.http.get<ApiResponse<{
      sensores_activos: number;
      alertas_pendientes: number;
      lecturas_hoy: number;
      sensores_con_falla: number;
    }>>('/iot/estadisticas');
    return response.data!;
  }

  // MQTT
  async publishMensaje(topic: string, mensaje: any): Promise<void> {
    await this.http.post('/iot/mqtt/publish', { topic, mensaje });
  }

  async subscribeTopic(topic: string): Promise<void> {
    await this.http.post('/iot/mqtt/subscribe', { topic });
  }

  async unsubscribeTopic(topic: string): Promise<void> {
    await this.http.post('/iot/mqtt/unsubscribe', { topic });
  }
}
