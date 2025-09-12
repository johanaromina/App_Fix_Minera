const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear conexión a la base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tfg_mineria',
    port: process.env.DB_PORT || 3306,
  });

  try {
    // Crear roles
    console.log('📝 Creando roles...');
    const roles = [
      { nombre: 'admin', descripcion: 'Administrador del sistema' },
      { nombre: 'supervisor', descripcion: 'Supervisor de operaciones' },
      { nombre: 'operador', descripcion: 'Operador de campo' },
      { nombre: 'tecnico', descripcion: 'Técnico de mantenimiento' },
    ];

    for (const role of roles) {
      await connection.execute(
        'INSERT IGNORE INTO roles (nombre, descripcion) VALUES (?, ?)',
        [role.nombre, role.descripcion]
      );
    }

    // Crear sitios
    console.log('🏭 Creando sitios...');
    const sitios = [
      {
        nombre: 'Mina Principal',
        descripcion: 'Sitio principal de extracción',
        lat: -33.4489,
        lng: -70.6693,
      },
      {
        nombre: 'Planta de Procesamiento',
        descripcion: 'Planta de procesamiento de minerales',
        lat: -33.4500,
        lng: -70.6700,
      },
      {
        nombre: 'Oficinas Centrales',
        descripcion: 'Oficinas administrativas',
        lat: -33.4400,
        lng: -70.6600,
      },
    ];

    for (const sitio of sitios) {
      await connection.execute(
        'INSERT IGNORE INTO sitios (nombre, descripcion, lat, lng) VALUES (?, ?, ?, ?)',
        [sitio.nombre, sitio.descripcion, sitio.lat, sitio.lng]
      );
    }

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const usuarios = [
      {
        id: 'admin-001',
        nombre: 'Administrador',
        email: 'admin@mineria.com',
        password: 'admin123',
        roles: ['admin'],
      },
      {
        id: 'super-001',
        nombre: 'Juan Supervisor',
        email: 'supervisor@mineria.com',
        password: 'super123',
        roles: ['supervisor'],
      },
      {
        id: 'oper-001',
        nombre: 'María Operadora',
        email: 'operador@mineria.com',
        password: 'oper123',
        roles: ['operador'],
      },
      {
        id: 'tec-001',
        nombre: 'Carlos Técnico',
        email: 'tecnico@mineria.com',
        password: 'tec123',
        roles: ['tecnico'],
      },
    ];

    for (const usuario of usuarios) {
      const hashedPassword = await bcrypt.hash(usuario.password, 10);
      
      // Insertar usuario
      await connection.execute(
        'INSERT IGNORE INTO usuarios (id, nombre, email, password_hash, activo) VALUES (?, ?, ?, ?, ?)',
        [usuario.id, usuario.nombre, usuario.email, hashedPassword, true]
      );

      // Asignar roles
      for (const roleName of usuario.roles) {
        const [roleRows] = await connection.execute(
          'SELECT id FROM roles WHERE nombre = ?',
          [roleName]
        );

        if (roleRows.length > 0) {
          const roleId = roleRows[0].id;
          await connection.execute(
            'INSERT IGNORE INTO usuario_roles (usuarioId, rolId) VALUES (?, ?)',
            [usuario.id, roleId]
          );
        }
      }

      console.log(`✅ Usuario creado: ${usuario.email} (${usuario.password})`);
    }

    // Crear algunos items de inventario
    console.log('📦 Creando items de inventario...');
    const inventarioItems = [
      {
        id: 'item-001',
        sitio_id: 1,
        tipo: 'Excavadora',
        marca: 'Caterpillar',
        modelo: 'CAT 320D',
        nro_serie: 'CAT320D001',
        codigo_qr: 'QR-EXC-001',
        estado: 'operativo',
      },
      {
        id: 'item-002',
        sitio_id: 1,
        tipo: 'Cargador',
        marca: 'Komatsu',
        modelo: 'WA380-5',
        nro_serie: 'KOM380001',
        codigo_qr: 'QR-CAR-001',
        estado: 'operativo',
      },
      {
        id: 'item-003',
        sitio_id: 2,
        tipo: 'Trituradora',
        marca: 'Metso',
        modelo: 'HP300',
        nro_serie: 'MET300001',
        codigo_qr: 'QR-TRI-001',
        estado: 'mantenimiento',
      },
    ];

    for (const item of inventarioItems) {
      await connection.execute(
        'INSERT IGNORE INTO inventario_items (id, sitio_id, tipo, marca, modelo, nro_serie, codigo_qr, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.sitio_id, item.tipo, item.marca, item.modelo, item.nro_serie, item.codigo_qr, item.estado]
      );
    }

    // Crear algunas incidencias de ejemplo
    console.log('⚠️ Creando incidencias...');
    const incidencias = [
      {
        id: 'inc-001',
        titulo: 'Falla en sistema hidráulico',
        descripcion: 'La excavadora presenta pérdida de presión en el sistema hidráulico',
        prioridad: 'alta',
        estado: 'abierta',
        usuario_reporta_id: 'oper-001',
        sitio_id: 1,
      },
      {
        id: 'inc-002',
        titulo: 'Ruido anormal en trituradora',
        descripcion: 'Se detecta ruido anormal en la trituradora principal',
        prioridad: 'media',
        estado: 'en_proceso',
        usuario_reporta_id: 'oper-001',
        usuario_atiende_id: 'tec-001',
        sitio_id: 2,
      },
    ];

    for (const incidencia of incidencias) {
      await connection.execute(
        'INSERT IGNORE INTO incidencias (id, titulo, descripcion, prioridad, estado, usuario_reporta_id, usuario_atiende_id, sitio_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [incidencia.id, incidencia.titulo, incidencia.descripcion, incidencia.prioridad, incidencia.estado, incidencia.usuario_reporta_id, incidencia.usuario_atiende_id || null, incidencia.sitio_id]
      );
    }

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('┌─────────────────────────┬─────────────────────────┬──────────────┐');
    console.log('│ Usuario                 │ Email                   │ Contraseña   │');
    console.log('├─────────────────────────┼─────────────────────────┼──────────────┤');
    console.log('│ Administrador           │ admin@mineria.com       │ admin123     │');
    console.log('│ Juan Supervisor         │ supervisor@mineria.com  │ super123     │');
    console.log('│ María Operadora         │ operador@mineria.com    │ oper123      │');
    console.log('│ Carlos Técnico          │ tecnico@mineria.com     │ tec123       │');
    console.log('└─────────────────────────┴─────────────────────────┴──────────────┘');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  });