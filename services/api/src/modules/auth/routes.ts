import { Router } from 'express';
import { AuthController } from './controller';
import { validateLogin, validateRegister } from './dto';
import { asyncHandler } from '../../middlewares/errorHandler';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', validateLogin, asyncHandler(authController.login.bind(authController)));
router.post('/register', validateRegister, asyncHandler(authController.register.bind(authController)));
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));

// Protected routes
router.post('/logout', asyncHandler(authController.logout.bind(authController)));
router.get('/me', asyncHandler(authController.getProfile.bind(authController)));

export default router;
