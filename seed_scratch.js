const SUPABASE_URL = 'https://fecvwfjoyfqzlsgmhzty.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlY3Z3ZmpveWZxemxzZ21oenR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODkyMjMsImV4cCI6MjA5MTI2NTIyM30.k49UEWC3A7_E0Lp-OdCG-EZ7e52bYARdagjpjmdxF98';

const mockData = [
  {
    slug: 'lucas',
    nombre: 'Lucas',
    apellido: 'Méndez',
    diagnostico: 'TEA',
    cud: true,
    colegio: {
      nombre: 'EP Nro 14 "San Martín"',
      direccion: 'Av. Corrientes 1234, Lomas de Zamora',
      telefono: '011 42921234',
      director_nombre: 'María López',
      director_tel: '5491123456789',
    },
    perfil_pedagogico: {
      como_aprende: 'Aprende mejor a través de secuencias visuales claras y rutinas estructuradas.',
      etapa_lectura: 'Alfabética',
      etapa_matematica: 'Preconceptual',
      andamiajes: 'Apoyo visual (pictogramas), auriculares canceladores de ruido.',
      habilidades_intereses: 'Dinosaurios, trenes.'
    }
  },
  {
    slug: 'valentina',
    nombre: 'Valentina',
    apellido: 'Rodríguez',
    diagnostico: 'TDAH',
    cud: false,
    colegio: {
      nombre: 'EP Nro 7 "Manuel Belgrano"',
      direccion: 'Rivadavia 567',
      telefono: '011 42925678',
      director_nombre: 'Carmen Suárez',
      director_tel: '5491134567890',
    },
    perfil_pedagogico: {
      como_aprende: 'Aprende de manera kinestésica. Necesita descansos frecuentes.',
      etapa_lectura: 'Ortográfica',
      etapa_matematica: 'Conceptual',
      andamiajes: 'Sentarse en los primeros bancos, pausas activas.',
      habilidades_intereses: 'Artes plásticas, animales.'
    }
  }
];

async function seed() {
  console.log('--- Iniciando Seed en Supabase ---');

  for (const item of mockData) {
    console.log(`Procesando a ${item.nombre}...`);

    // 1. Insertar Colegio
    const colRes = await fetch(`${SUPABASE_URL}/rest/v1/colegios`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(item.colegio)
    });

    if (!colRes.ok) {
      const error = await colRes.text();
      console.error(`Error al insertar colegio para ${item.nombre}:`, error);
      continue;
    }

    const colegioData = await colRes.json();
    const colegioId = colegioData[0].id;

    // 2. Insertar Alumno
    const studentData = {
      slug: item.slug,
      nombre: item.nombre,
      apellido: item.apellido,
      diagnostico: item.diagnostico,
      cud: item.cud,
      colegio_id: colegioId,
      perfil_pedagogico: item.perfil_pedagogico
    };

    const stuRes = await fetch(`${SUPABASE_URL}/rest/v1/alumnos`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(studentData)
    });

    if (!stuRes.ok) {
      const error = await stuRes.text();
      console.error(`Error al insertar alumno ${item.nombre}:`, error);
    } else {
      console.log(`✅ ${item.nombre} insertado correctamente.`);
    }
  }

  console.log('--- Seed Finalizado ---');
}

seed().catch(console.error);
