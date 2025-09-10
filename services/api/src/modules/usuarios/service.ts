import { getPrismaClient } from '../../config/database';
import { createError } from '../../middlewares/errorHandler';

export class UsuarioService {
  private prisma = getPrismaClient();

  async getAll(options: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { nombre: { contains: search } },
        { email: { contains: search } }
      ]
    } : {};

    const [usuarios, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limit,
        include: {
          roles: {
            include: {
              rol: true
            }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.usuario.count({ where })
    ]);

    return {
      usuarios: usuarios.map(user => ({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        activo: user.activo,
        roles: user.roles.map(ur => ur.rol.nombre),
        created_at: user.created_at,
        updated_at: user.updated_at
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getById(id: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
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

  async update(id: string, updateData: any) {
    const user = await this.prisma.usuario.findUnique({
      where: { id }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...updateData,
        updated_at: new Date()
      },
      include: {
        roles: {
          include: {
            rol: true
          }
        }
      }
    });

    return {
      id: updatedUser.id,
      nombre: updatedUser.nombre,
      email: updatedUser.email,
      activo: updatedUser.activo,
      roles: updatedUser.roles.map(ur => ur.rol.nombre),
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    };
  }

  async deactivate(id: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    await this.prisma.usuario.update({
      where: { id },
      data: {
        activo: false,
        updated_at: new Date()
      }
    });
  }
}
