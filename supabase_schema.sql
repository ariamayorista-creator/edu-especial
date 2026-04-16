-- Schema for Edu-Especial Supabase Database

-- 1. Table for Schools (Colegios)
CREATE TABLE colegios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  numero TEXT,
  direccion TEXT,
  telefono TEXT,
  director_nombre TEXT,
  director_tel TEXT,
  vice_nombre TEXT,
  vice_tel TEXT,
  eoe_nombre TEXT,
  eoe_rol TEXT,
  eoe_tel TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table for Students (Alumnos)
CREATE TABLE alumnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  diagnostico TEXT,
  cud BOOLEAN DEFAULT false,
  colegio_id UUID REFERENCES colegios(id),
  perfil_pedagogico JSONB, -- Storing the complex object as JSONB for flexibility
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table for Daily Logs (Registros Diarios)
CREATE TABLE logs_diarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  observacion TEXT,
  participo BOOLEAN DEFAULT true,
  se_frustro BOOLEAN DEFAULT false,
  uso_apoyo_visual BOOLEAN DEFAULT false,
  trabajo_en_grupo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table for Attendance (Asistencia)
CREATE TABLE asistencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  estado TEXT CHECK (estado IN ('presente', 'ausente', 'tardanza')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(alumno_id, fecha)
);

-- 5. Table for Schedules (Horarios)
CREATE TABLE horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE,
  dia TEXT NOT NULL,
  hora_inicio TEXT,
  hora_fin TEXT,
  materia TEXT,
  docente TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Table for Documents (Documentos)
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  tipo TEXT CHECK (tipo IN ('pdf', 'doc')),
  descripcion TEXT,
  gemini_file_uri TEXT,
  gemini_mime_type TEXT,
  storage_path TEXT, -- Path in Supabase Storage
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE colegios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Note: Policies should be added based on User Authentication (e.g., auth.uid())
