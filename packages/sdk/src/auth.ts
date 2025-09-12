import { HttpClient } from './http';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  User,
  ApiResponse,
} from './types';

export class AuthService {
  constructor(private http: HttpClient) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.http.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.http.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data!;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.http.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    });
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout');
  }

  async getProfile(): Promise<User> {
    const response = await this.http.get<ApiResponse<User>>('/auth/me');
    return response.data!;
  }
}
