# TFG Mineria - Sistema de Gestión Minera

Sistema integral de gestión para operaciones mineras desarrollado como Trabajo de Fin de Grado (TFG).

## 🏗️ Arquitectura

Este proyecto utiliza una arquitectura de **monorepo** con las siguientes tecnologías:

### Frontend Web
- **React 18** con **TypeScript**
- **Vite** como bundler
- **Bootstrap 5** para UI
- **React Router** para navegación
- **Zustand** para estado global
- **React Query** para gestión de datos

### Aplicación Móvil
- **Expo** con **React Native**
- **Expo Router** para navegación
- **React Native Paper** para componentes UI
- **React Native Maps** para mapas
- **Expo Camera** para escaneo QR

### Backend
- **Node.js** con **Express.js**
- **TypeScript** para tipado
- **Prisma** como ORM
- **MySQL** como base de datos
- **JWT** para autenticación
- **MQTT** para IoT

### Base de Datos
- **MySQL 8.0** como base de datos principal
- **Prisma** como ORM con tipado compartido
- **Redis** para caché (opcional)

### IoT y Comunicaciones
- **MQTT** para comunicación con sensores
- **WebSockets** para actualizaciones en tiempo real

## 📁 Estructura del Proyecto

```
tfg-mineria/
├── apps/
│   ├── web/                    # Frontend React
│   └── mobile/                 # App Expo/React Native
├── services/
│   └── api/                    # Backend Express.js
├── packages/
│   ├── sdk/                    # SDK compartido HTTP
│   └── ui/                     # Componentes UI compartidos (futuro)
├── infra/
│   └── docker/                 # Docker Compose para servicios
└── docs/                       # Documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** 18+ 
- **npm** 8+
- **Docker** y **Docker Compose**
- **Git**

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd tfg-mineria
```

### 2. Instalar Dependencias

```bash
npm run install:all
```

### 3. Configurar Variables de Entorno

```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# API
API_PORT=4000
API_CORS_ORIGIN=http://localhost:5173,http://localhost:8081

# Database
DATABASE_URL="mysql://root:root@localhost:3306/tfg_mineria"

# MQTT
MQTT_URL="mqtt://localhost:1883"

# JWT
JWT_SECRET="tu-secreto-jwt-muy-seguro"
JWT_EXPIRES_IN="1d"
```

### 4. Levantar Servicios de Infraestructura

```bash
npm run infra:up
```

Esto levanta:
- MySQL 8.0 en puerto 3306
- MQTT Broker en puerto 1883
- Redis en puerto 6379

### 5. Configurar Base de Datos

```bash
npm run db:gen
npm run db:migrate
```

### 6. Iniciar Desarrollo

```bash
# Terminal 1: Backend
npm run api:dev

# Terminal 2: Frontend Web
npm run web:dev

# Terminal 3: App Móvil (opcional)
npm run mobile:dev
```

## 📱 Aplicaciones

### Web (http://localhost:5173)
- Dashboard con métricas en tiempo real
- Gestión de incidencias
- Control de inventario con códigos QR
- Programación de mantenimientos
- Mapa interactivo de sitios
- Reportes y estadísticas

### Móvil (Expo)
- Acceso offline a datos críticos
- Escaneo de códigos QR
- Reporte rápido de incidencias
- Notificaciones push
- Geolocalización de equipos

## 🔧 Scripts Disponibles

### Infraestructura
```bash
npm run infra:up          # Levantar servicios Docker
npm run infra:down        # Detener servicios Docker
npm run infra:logs        # Ver logs de servicios
```

### Base de Datos
```bash
npm run db:gen            # Generar cliente Prisma
npm run db:migrate        # Ejecutar migraciones
npm run db:reset          # Resetear base de datos
npm run db:studio         # Abrir Prisma Studio
```

### Desarrollo
```bash
npm run api:dev           # Backend en modo desarrollo
npm run web:dev           # Frontend web en modo desarrollo
npm run mobile:dev        # App móvil en modo desarrollo
npm run dev               # Backend + Frontend simultáneamente
```

### Producción
```bash
npm run build             # Construir todas las aplicaciones
npm run api:build         # Construir solo backend
npm run web:build         # Construir solo frontend
```

## 🗄️ Base de Datos

### Modelos Principales

- **Usuarios**: Gestión de usuarios y roles
- **Sitios**: Ubicaciones geográficas de equipos
- **Incidencias**: Reportes de problemas y fallas
- **Inventario**: Control de equipos y materiales
- **Mantenimiento**: Programación y seguimiento
- **Sensores**: Dispositivos IoT y sus lecturas
- **Alertas**: Notificaciones automáticas

### Migraciones

```bash
# Crear nueva migración
cd services/api
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## 🔌 API REST

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Perfil del usuario

### Incidencias
- `GET /api/incidencias` - Listar incidencias
- `POST /api/incidencias` - Crear incidencia
- `GET /api/incidencias/:id` - Obtener incidencia
- `PUT /api/incidencias/:id` - Actualizar incidencia

### Inventario
- `GET /api/inventario` - Listar items
- `POST /api/inventario` - Crear item
- `GET /api/inventario/qr/:code` - Buscar por QR
- `POST /api/inventario/:id/movimientos` - Crear movimiento

### Mantenimiento
- `GET /api/mantenimiento` - Listar mantenimientos
- `POST /api/mantenimiento` - Programar mantenimiento
- `PATCH /api/mantenimiento/:id/execute` - Ejecutar mantenimiento

## 🌐 IoT y MQTT

### Topics MQTT

- `sensores/+/lecturas` - Lecturas de sensores
- `alertas/+` - Alertas del sistema
- `comandos/+/ejecutar` - Comandos para equipos

### Integración con Sensores

El sistema está preparado para recibir datos de:
- Sensores de temperatura
- Sensores de vibración
- Medidores de energía
- Sensores de presión
- Sensores de humedad
- Sensores de flujo

## 📊 Características Principales

### Dashboard
- Métricas en tiempo real
- Gráficos de rendimiento
- Alertas críticas
- Estado de equipos

### Gestión de Incidencias
- Reporte rápido de problemas
- Asignación automática por prioridad
- Seguimiento de resolución
- Anexos de fotos/documentos

### Control de Inventario
- Códigos QR únicos por equipo
- Escaneo móvil
- Historial de movimientos
- Estados de equipos

### Mantenimiento Preventivo
- Programación automática
- Recordatorios por email/SMS
- Seguimiento de ejecución
- Reportes de mantenimiento

### Mapa Interactivo
- Ubicación de sitios
- Estado de equipos en tiempo real
- Navegación GPS
- Alertas geográficas

## 🔒 Seguridad

- Autenticación JWT
- Roles y permisos granulares
- Validación de datos con Joi
- Rate limiting
- CORS configurado
- Headers de seguridad

## 🧪 Testing

```bash
# Backend
cd services/api
npm test

# Frontend
cd apps/web
npm test

# Mobile
cd apps/mobile
npm test
```

## 📦 Despliegue

### Docker

```bash
# Construir imágenes
docker-compose -f docker-compose.prod.yml build

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:port/db"
JWT_SECRET="secreto-muy-seguro"
MQTT_URL="mqtt://broker-host:1883"
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Gerardo** - *Desarrollo completo* - [GitHub](https://github.com/gerardo)

## 📞 Contacto

- Email: gerardo@email.com
- Proyecto: [GitHub Repository](https://github.com/gerardo/tfg-mineria)

## 🙏 Agradecimientos

- A la comunidad de desarrolladores de React, Node.js y Expo
- A los contribuidores de las librerías utilizadas
- A los mentores y profesores del TFG