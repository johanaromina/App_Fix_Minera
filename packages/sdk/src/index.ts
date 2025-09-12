// Export all types
export * from './types';

// Export HTTP client
export { HttpClient, createHttpClient } from './http';

// Export services
export { AuthService } from './auth';
export { IncidenciasService } from './incidencias';
export { InventarioService } from './inventario';
export { MantenimientoService } from './mantenimiento';
export { IoTService } from './iot';

// Main SDK class
import { HttpClient } from './http';
import { AuthService } from './auth';
import { IncidenciasService } from './incidencias';
import { InventarioService } from './inventario';
import { MantenimientoService } from './mantenimiento';
import { IoTService } from './iot';

export interface SDKConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class TFGMineriaSDK {
  public http: HttpClient;
  public auth: AuthService;
  public incidencias: IncidenciasService;
  public inventario: InventarioService;
  public mantenimiento: MantenimientoService;
  public iot: IoTService;

  constructor(config: SDKConfig) {
    this.http = new HttpClient(config);
    this.auth = new AuthService(this.http);
    this.incidencias = new IncidenciasService(this.http);
    this.inventario = new InventarioService(this.http);
    this.mantenimiento = new MantenimientoService(this.http);
    this.iot = new IoTService(this.http);
  }

  // Helper methods for token management
  setAuthToken(token: string): void {
    this.http.setAuthTokenMethod(() => token);
  }

  setRefreshToken(token: string): void {
    this.http.setRefreshTokenMethod(() => token);
  }

  setAuthTokenSetter(setter: (token: string) => void): void {
    this.http.setAuthTokenSetter(setter);
  }

  setClearAuthTokensMethod(clearer: () => void): void {
    this.http.setClearAuthTokensMethod(clearer);
  }
}

// Factory function
export function createSDK(config: SDKConfig): TFGMineriaSDK {
  return new TFGMineriaSDK(config);
}
