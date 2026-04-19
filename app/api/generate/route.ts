import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { alumno, logs, tipo } = body;
    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta configurar GOOGLE_GENERATIVE_AI_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // SECURITY: Anonymize student data
    const safeStudentName = "El estudiante (anonimizado)";
    const context = `
      Perfil del Alumno:
      Nombre: ${safeStudentName}
      Diagnóstico: ${alumno.diagnostico}
      Perfil Pedagógico:
      - Como aprende: ${alumno.perfil_pedagogico?.como_aprende || 'No especificado'}
      - Lectura: ${alumno.perfil_pedagogico?.etapa_lectura || 'No evaluada'}
      - Matemática: ${alumno.perfil_pedagogico?.etapa_matematica || 'No evaluada'}
      - Apoyos/Andamiajes: ${alumno.perfil_pedagogico?.andamiajes || 'Ninguno'}
      
      Registros Diarios (${logs?.length || 0}):
      ${logs?.map((l: any) => `- Fecha: ${l.fecha}. Observación: ${l.observacion ? l.observacion.replace(new RegExp(alumno.nombre, 'gi'), 'el estudiante') : ''}. Participó: ${l.participo}.`).join('\n')}
    `;

    // BUSCAR PLANTILLAS DE ESTRUCTURA (TXT)
    const plantillas = alumno?.documentos?.filter((d: any) => d.esPlantilla && d.tipo === 'txt');
    const estructuraContext = plantillas?.length > 0 
      ? `ESTRUCTURA OBLIGATORIA (Sigue este formato): \n${plantillas.map((p: any) => p.descripcion || p.nombre).join('\n')}`
      : 'Usa el formato oficial de la Provincia de Buenos Aires.';

    let systemPrompt = "";
    if (tipo === 'ppi') {
      systemPrompt = `Eres un orientador pedagógico experto. Genera una PPI en JSON.
      ${estructuraContext}
      Es obligatorio que el JSON tenga exactamente estas llaves: barreras, modos_aprender, acuerdos_lengua, acuerdos_matematica, acuerdos_naturales, acuerdos_sociales, herramientas, criterios.`;
    } else {
      systemPrompt = `Eres un orientador pedagógico experto. Genera un Informe Trimestral en JSON.
      ${estructuraContext}
      Es obligatorio que el JSON tenga exactamente estas llaves: avances_lengua, avances_matematica, avances_generales.`;
    }

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Contexto del alumno:\n${context}\n\nGenera el JSON solicitado. NO incluyas markdown, solo el objeto JSON puro.` }
    ]);

    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in api/generate:', error);
    return NextResponse.json({ error: error.message || 'Error generando contenido AI' }, { status: 500 });
  }
}
