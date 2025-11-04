const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear conexión a la base de datos
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'APP_Fix_Minera',
    port: 3306,
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
      {
        id: 'item-004',
        sitio_id: 2,
        tipo: 'Compresor',
        marca: 'Atlas Copco',
        modelo: 'GA37',
        nro_serie: 'AC902341',
        codigo_qr: 'QR-COM-001',
        estado: 'operativo',
      },
      {
        id: 'item-005',
        sitio_id: 1,
        tipo: 'Generador',
        marca: 'Cummins',
        modelo: 'QSK60',
        nro_serie: 'CU567890',
        codigo_qr: 'QR-GEN-001',
        estado: 'fuera_de_servicio',
      }
    ];

    for (const item of inventarioItems) {
      await connection.execute(
        `INSERT INTO inventario_items (id, sitio_id, tipo, marca, modelo, nro_serie, codigo_qr, estado, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE 
         tipo = VALUES(tipo), 
         marca = VALUES(marca), 
         modelo = VALUES(modelo), 
         nro_serie = VALUES(nro_serie),
         estado = VALUES(estado),
         updated_at = NOW()`,
        [item.id, item.sitio_id, item.tipo, item.marca, item.modelo, item.nro_serie, item.codigo_qr, item.estado]
      );
    }

    // Crear planes de mantenimiento
    console.log('🔧 Creando planes de mantenimiento...');
    const planes = [
      {
        id: 'plan-001',
        nombre: 'Mantenimiento Preventivo Bombas',
        descripcion: 'Revisión mensual de bombas principales',
        frecuencia: 'mensual',
      },
      {
        id: 'plan-002',
        nombre: 'Revisión Mensual Equipos',
        descripcion: 'Inspección general de equipos críticos',
        frecuencia: 'mensual',
      },
      {
        id: 'plan-003',
        nombre: 'Mantenimiento Motor',
        descripcion: 'Lubricación y revisión de motores',
        frecuencia: 'trimestral',
      },
      {
        id: 'plan-004',
        nombre: 'Calibración Válvulas',
        descripcion: 'Calibración de sistemas de válvulas',
        frecuencia: 'semestral',
      },
    ];

    for (const plan of planes) {
      await connection.execute(
        'INSERT IGNORE INTO planes_mantenimiento (id, nombre, descripcion, frecuencia) VALUES (?, ?, ?, ?)',
        [plan.id, plan.nombre, plan.descripcion, plan.frecuencia]
      );
    }

    // Crear algunas incidencias de ejemplo
    console.log('⚠️ Creando incidencias...');
    const incidencias = [
      {
        id: 'inc-001',
        titulo: 'Falla en sistema hidráulico',
        descripcion: 'La excavadora presenta pérdida de presión en el sistema hidráulico. Se requiere intervención inmediata para evitar daños mayores.',
        prioridad: 'alta',
        estado: 'abierta',
        usuario_reporta_id: 'oper-001',
        sitio_id: 1,
      },
      {
        id: 'inc-002',
        titulo: 'Ruido anormal en trituradora',
        descripcion: 'Se detecta ruido anormal en la trituradora principal. Posible desgaste en los rodamientos.',
        prioridad: 'media',
        estado: 'en_proceso',
        usuario_reporta_id: 'oper-001',
        usuario_atiende_id: 'tec-001',
        sitio_id: 2,
      },
      {
        id: 'inc-003',
        titulo: 'Fuga de aceite en motor principal',
        descripcion: 'Detectada fuga significativa de aceite en el motor principal de la excavadora. Se observa mancha en el suelo.',
        prioridad: 'critica',
        estado: 'abierta',
        usuario_reporta_id: 'oper-001',
        sitio_id: 1,
      },
      {
        id: 'inc-004',
        titulo: 'Sistema de iluminación defectuoso',
        descripcion: 'Multiple bombillas fundidas en el área de procesamiento. Riesgo de seguridad durante horarios nocturnos.',
        prioridad: 'media',
        estado: 'abierta',
        usuario_reporta_id: 'super-001',
        sitio_id: 2,
      },
      {
        id: 'inc-005',
        titulo: 'Banda transportadora fuera de línea',
        descripcion: 'La banda transportadora principal se detuvo inesperadamente. Producción suspendida temporalmente.',
        prioridad: 'alta',
        estado: 'en_proceso',
        usuario_reporta_id: 'oper-001',
        usuario_atiende_id: 'tec-001',
        sitio_id: 2,
      },
      {
        id: 'inc-006',
        titulo: 'Válvula de seguridad bloqueada',
        descripcion: 'Válvula de seguridad del sistema neumático no responde. Inspección requerida.',
        prioridad: 'alta',
        estado: 'abierta',
        usuario_reporta_id: 'tec-001',
        sitio_id: 3,
      },
      {
        id: 'inc-007',
        titulo: 'Software de monitoreo desactualizado',
        descripcion: 'El software de monitoreo requiere actualización crítica para mantener compatibilidad.',
        prioridad: 'baja',
        estado: 'abierta',
        usuario_reporta_id: 'admin-001',
        sitio_id: 3,
      },
      {
        id: 'inc-008',
        titulo: 'Temperatura elevada en compresor',
        descripcion: 'Sensor reporta temperatura 10°C por encima de lo normal. Revisión preventiva recomendada.',
        prioridad: 'media',
        estado: 'cerrada',
        usuario_reporta_id: 'oper-001',
        usuario_atiende_id: 'tec-001',
        sitio_id: 1,
      },
      {
        id: 'inc-009',
        titulo: 'Cable de alimentación dañado',
        descripcion: 'Cable de alimentación principal presenta deterioro visible. Potencial riesgo eléctrico.',
        prioridad: 'critica',
        estado: 'abierta',
        usuario_reporta_id: 'super-001',
        sitio_id: 2,
      },
      {
        id: 'inc-010',
        titulo: 'Filtro de aire obstruido',
        descripcion: 'Filtro de aire principal requiere reemplazo. Impacto en rendimiento del motor.',
        prioridad: 'baja',
        estado: 'cerrada',
        usuario_reporta_id: 'tec-001',
        usuario_atiende_id: 'tec-001',
        sitio_id: 1,
      },
    ];

    for (const incidencia of incidencias) {
      await connection.execute(
        `INSERT INTO incidencias (id, titulo, descripcion, prioridad, estado, usuario_reporta_id, usuario_atiende_id, sitio_id, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
         titulo = VALUES(titulo), 
         descripcion = VALUES(descripcion), 
         prioridad = VALUES(prioridad), 
         estado = VALUES(estado),
         updated_at = NOW()`,
        [incidencia.id, incidencia.titulo, incidencia.descripcion, incidencia.prioridad, incidencia.estado, incidencia.usuario_reporta_id, incidencia.usuario_atiende_id || null, incidencia.sitio_id]
      );
    }

    // Crear sensores IoT
    console.log('🔌 Creando sensores IoT...');
    const sensores = [
      {
        id: 'sensor-001',
        sitio_id: 1,
        tipo: 'temperatura',
        descripcion: 'Sensor de temperatura en sala de máquinas',
        activo: true
      },
      {
        id: 'sensor-002',
        sitio_id: 1,
        tipo: 'vibracion',
        descripcion: 'Sensor de vibración en bomba principal',
        activo: true
      },
      {
        id: 'sensor-003',
        sitio_id: 2,
        tipo: 'energia',
        descripcion: 'Medidor de consumo energético',
        activo: true
      },
      {
        id: 'sensor-004',
        sitio_id: 1,
        tipo: 'presion',
        descripcion: 'Sensor de presión en línea principal',
        activo: true
      },
      {
        id: 'sensor-005',
        sitio_id: 2,
        tipo: 'humedad',
        descripcion: 'Sensor de humedad ambiental',
        activo: true
      },
      {
        id: 'sensor-006',
        sitio_id: 2,
        tipo: 'flujo',
        descripcion: 'Sensor de flujo en tubería',
        activo: true
      }
    ];

    for (const sensor of sensores) {
      await connection.execute(
        `INSERT INTO sensores (id, sitio_id, tipo, descripcion, activo, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE 
         tipo = VALUES(tipo), 
         descripcion = VALUES(descripcion), 
         activo = VALUES(activo),
         updated_at = NOW()`,
        [sensor.id, sensor.sitio_id, sensor.tipo, sensor.descripcion, sensor.activo]
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