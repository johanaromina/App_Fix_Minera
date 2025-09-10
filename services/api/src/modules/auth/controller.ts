import { Request, Response } from 'express';
import { AuthService } from './service';
import { LoginDto, RegisterDto } from './dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const loginData: LoginDto = req.body;
    const result = await this.authService.login(loginData);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const registerData: RegisterDto = req.body;
    const result = await this.authService.register(registerData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    // In a real implementation, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
    const profile = await this.authService.getProfile(user.id);
    
    res.json({
      success: true,
      data: profile
    });
  };
}
