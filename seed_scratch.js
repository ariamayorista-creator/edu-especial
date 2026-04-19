require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('--- Iniciando Semilla de Datos Edu-Especial ---');

  const usersInfo = [
    { email: 'ana@edu.com', password: 'ana123456', nombre: 'Ana' },
    { email: 'carlos@edu.com', password: 'carlos123456', nombre: 'Carlos' }
  ];

  const authUsersDict = {};

  // Get all users to find IDs
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  for (const info of usersInfo) {
    let user = listData.users.find(u => u.email === info.email);
    
    if (!user) {
      console.log(`Creando usuario ${info.email}...`);
      const { data: newData, error: createError } = await supabase.auth.admin.createUser({
        email: info.email,
        password: info.password,
        email_confirm: true,
        user_metadata: { full_name: info.nombre }
      });
      if (createError) {
          console.error(`Error creando ${info.email}:`, createError.message);
          continue;
      }
      user = newData.user;
    } else {
      console.log(`Usuario ${info.email} ya existe (ID: ${user.id})`);
    }
    authUsersDict[info.nombre] = user.id;
  }

  const anaId = authUsersDict['Ana'];
  const carlosId = authUsersDict['Carlos'];

  if (!anaId || !carlosId) {
      console.error('Faltan IDs de usuario. Abortando.');
      return;
  }

  // Helper to insert student if not exists
  async function ensureStudent(userId, nombre, apellido, slug, diagnostico) {
    const { data: existing } = await supabase.from('alumnos').select('id').eq('slug', slug).single();
    if (existing) return existing.id;

    const { data, error } = await supabase.from('alumnos').insert([{
        user_id: userId, nombre, apellido, slug, diagnostico, cud: true,
        perfil_pedagogico: { como_aprende: 'General', etapa_lectura: 'Alfabética', etapa_matematica: 'Conceptual' }
    }]).select().single();
    
    if (error) { console.error(`Error alumno ${nombre}:`, error.message); return null; }
    return data.id;
  }

  // SEED ANA
  const anaStudentId = await ensureStudent(anaId, 'Lucas', 'Méndez', 'lucas-ana', 'TEA');
  if (anaStudentId) {
    const materiasAna = [
      { dia: 'Lunes', h: [['08:00', '10:00', 'Matemática', 'Uso de material concreto'], ['10:00', '12:00', 'Música', 'Auriculares canceladores']] },
      { dia: 'Martes', h: [['08:00', '10:00', 'Prácticas del Lenguaje', 'Pictogramas de apoyo'], ['10:00', '12:00', 'Artística', 'Espacio libre de ruidos']] },
      { dia: 'Miércoles', h: [['08:00', '10:00', 'Ciencias Naturales', 'Experimentos visuales'], ['10:00', '12:00', 'Educación Física', 'Anticipación de juegos']] },
      { dia: 'Jueves', h: [['08:00', '10:00', 'Matemática', 'Regletas de Cuisenaire'], ['10:00', '12:00', 'Ciencias Sociales', 'Líneas de tiempo visuales']] },
      { dia: 'Viernes', h: [['08:00', '10:00', 'Lengua', 'Cuentos con tarjetas'], ['10:00', '12:00', 'Taller', 'Trabajo en duplas']] }
    ];
    for (const d of materiasAna) {
      for (const b of d.h) {
        await supabase.from('horarios').upsert({
          user_id: anaId, alumno_id: anaStudentId, dia: d.dia, hora_inicio: b[0], hora_fin: b[1],
          materia: b[2], acuerdos: b[3], docente: 'Ana'
        }, { onConflict: 'user_id,alumno_id,dia,hora_inicio' });
      }
    }
  }

  // SEED CARLOS
  const carlosStudentId = await ensureStudent(carlosId, 'Mateo', 'González', 'mateo-carlos', 'Discapacidad intelectual');
  if (carlosStudentId) {
      const materiasCarlos = [
        { dia: 'Lunes', h: [['08:00', '10:00', 'Ciencias Sociales', 'Mapas táctiles'], ['10:00', '12:00', 'ESI', 'Participación guiada']] },
        { dia: 'Martes', h: [['08:00', '10:00', 'Matemática', 'Cálculos con apoyo'], ['10:00', '12:00', 'Educación Física', 'Pausas activas']] },
        { dia: 'Miércoles', h: [['08:00', '10:00', 'Inglés', 'Soporte auditivo'], ['10:00', '12:00', 'Prácticas del Lenguaje', 'Lectura compartida']] },
        { dia: 'Jueves', h: [['08:00', '10:00', 'Matemática', 'Uso de tablet'], ['10:00', '12:00', 'Ciencias Naturales', 'Observación directa']] },
        { dia: 'Viernes', h: [['08:00', '10:00', 'Ciencias Sociales', 'Audios descriptivos'], ['10:00', '12:00', 'Artística', 'Exploración sensorial']] }
      ];
      for (const d of materiasCarlos) {
        for (const b of d.h) {
          await supabase.from('horarios').upsert({
            user_id: carlosId, alumno_id: carlosStudentId, dia: d.dia, hora_inicio: b[0], hora_fin: b[1],
            materia: b[2], acuerdos: b[3], docente: 'Carlos'
          }, { onConflict: 'user_id,alumno_id,dia,hora_inicio' });
        }
      }
  }

  console.log('--- Semilla Completada con Éxito ---');
}

seed().catch(err => console.error(err));
