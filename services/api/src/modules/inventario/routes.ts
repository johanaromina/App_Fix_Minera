import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../middlewares/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Placeholder routes - implement as needed
router.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Inventario endpoint - to be implemented' });
}));

export default router;
