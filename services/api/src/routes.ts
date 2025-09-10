import { Router } from "express";
import auth from "./modules/auth/routes";
import usuarios from "./modules/usuarios/routes";
import sitios from "./modules/sitios/routes";
import incidencias from "./modules/incidencias/routes";
import inventario from "./modules/inventario/routes";
import mantenimiento from "./modules/mantenimiento/routes";
import iot from "./modules/iot/routes";
import sensores from "./modules/sensores/routes";
import notificaciones from "./modules/notificaciones/routes";

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', auth);
router.use('/usuarios', usuarios);
router.use('/sitios', sitios);
router.use('/incidencias', incidencias);
router.use('/inventario', inventario);
router.use('/mantenimiento', mantenimiento);
router.use('/iot', iot);
router.use('/sensores', sensores);
router.use('/notificaciones', notificaciones);

export default router;
