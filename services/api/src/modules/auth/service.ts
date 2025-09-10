import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '../../config/database';
import { config } from '../../config';
import { createError } from '../../middlewares/errorHandler';
import { LoginDto, RegisterDto } from './dto';

export class AuthService {
  private prisma = getPrismaClient();

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    // Find user by email
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            rol: true
          }
        }
      }
    });

    if (!user || !user.activo) {
      throw createError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        roles: user.roles.map(ur => ur.rol.nombre)
      },
      accessToken,
      refreshToken
    };
  }

  async register(registerData: RegisterDto) {
    const { nombre, email, password } = registerData;

    // Check if user already exists
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError('User already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.usuario.create({
      data: {
        nombre,
        email,
        password_hash: passwordHash
      },
      include: {
        roles: {
          include: {
            rol: true
          }
        }
      }
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        roles: user.roles.map(ur => ur.rol.nombre)
      },
      accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
      
      const user = await this.prisma.usuario.findUnique({
        where: { id: decoded.userId },
        include: {
          roles: {
            include: {
              rol: true
            }
          }
        }
      });

      if (!user || !user.activo) {
        throw createError('Invalid refresh token', 401);
      }

      const accessToken = this.generateAccessToken(user.id);

      return {
        accessToken,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          roles: user.roles.map(ur => ur.rol.nombre)
        }
      };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            rol: true
          }
        }
      }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      activo: user.activo,
      roles: user.roles.map(ur => ur.rol.nombre),
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  private generateAccessToken(userId: string): string {
    return jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      config.jwt.secret,
      { expiresIn: '7d' }
    );
  }
}
