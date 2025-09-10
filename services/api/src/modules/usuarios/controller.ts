import { Request, Response } from 'express';
import { UsuarioService } from './service';

export class UsuarioController {
  private usuarioService: UsuarioService;

  constructor() {
    this.usuarioService = new UsuarioService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, search } = req.query;
    const result = await this.usuarioService.getAll({
      page: Number(page),
      limit: Number(limit),
      search: search as string
    });
    
    res.json({
      success: true,
      data: result
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.usuarioService.getById(id);
    
    res.json({
      success: true,
      data: user
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;
    const user = await this.usuarioService.update(id, updateData);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  };

  deactivate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.usuarioService.deactivate(id);
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  };
}
