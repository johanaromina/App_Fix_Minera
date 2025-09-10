import { Router } from 'express';
import { UsuarioController } from './controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { asyncHandler } from '../../middlewares/errorHandler';

const router = Router();
const usuarioController = new UsuarioController();

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', authorize('admin'), asyncHandler(usuarioController.getAll.bind(usuarioController)));

// Get user by ID
router.get('/:id', asyncHandler(usuarioController.getById.bind(usuarioController)));

// Update user
router.put('/:id', asyncHandler(usuarioController.update.bind(usuarioController)));

// Deactivate user (admin only)
router.delete('/:id', authorize('admin'), asyncHandler(usuarioController.deactivate.bind(usuarioController)));

export default router;
