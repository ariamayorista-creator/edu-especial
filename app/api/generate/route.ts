import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { alumno, logs, tipo } = body;
    
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta configurar GOOGLE_API_KEY en el entorno' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = `
      Perfil del Alumno:
      Nombre: ${alumno.nombre} ${alumno.apellido}
      Diagnóstico: ${alumno.diagnostico}
      Perfil Pedagógico:
      - Como aprende: ${alumno.perfil_pedagogico?.como_aprende || 'No especificado'}
      - Lectura: ${alumno.perfil_pedagogico?.etapa_lectura || 'No evaluada'}
      - Matemática: ${alumno.perfil_pedagogico?.etapa_matematica || 'No evaluada'}
      - Apoyos/Andamiajes: ${alumno.perfil_pedagogico?.andamiajes || 'Ninguno'}
      
      Registros Diarios (${logs.length}):
      ${logs.map((l: any) => `- Fecha: ${l.fecha}. Observación: ${l.observacion}. Participó: ${l.participo}. Apoyo visual: ${l.uso_apoyo_visual}. En grupo: ${l.trabajo_en_grupo}`).join('\n')}
    `;

    let prompt = "";
    if (tipo === 'ppi') {
      prompt = `Eres un orientador pedagógico de Educación Especial en la Provincia de Buenos Aires. Basándote en el siguiente contexto del estudiante, redacta borradores para los campos de la Planilla de Propuesta Pedagógica Individual (PPI) alineado con los Criterios de la Comunicación N° 71/22. 
      Devuelve ÚNICAMENTE un objeto JSON válido con las siguientes claves (usando lenguaje formal, técnico, enfocado en capacidades, resolviendo barreras didácticas y promoviendo andamiajes):
      {
        "barreras": "Barreras para el aprendizaje y la participación (enfoque didáctico)",
        "modos_aprender": "Descripción de cómo aprende y qué necesita",
        "acuerdos_lengua": "Estrategias para nivel de lectura actual",
        "acuerdos_matematica": "Estrategias para su etapa matemática",
        "acuerdos_naturales": "Estrategias de Ciencias Naturales",
        "acuerdos_sociales": "Estrategias de Ciencias Sociales",
        "herramientas": "Herramientas de evaluación sugeridas (ej: observación directa, registros anecdóticos)",
        "criterios": "Los criterios de evaluación trimestral sugeridos acordes a su perfil"
      }
      
      Contexto de origen: 
      ---
      ${context}
      ---
      No devuelvas Markdown. Devuelve SÓLO el texto del JSON.
      `;
    } else if (tipo === 'informe') {
       prompt = `Eres un orientador pedagógico de Educación Especial. Redacta los campos para el Informe Trimestral basándote en el perfil del alumno y los registros diarios recientes.
       Debes evaluar su progreso y el resultado de las intervenciones. Utiliza lenguaje formal y pedagógico según la normativa.
       Devuelve ÚNICAMENTE un objeto JSON válido con las siguientes claves:
       {
         "avances_lengua": "Progreso en Prácticas del Lenguaje",
         "avances_matematica": "Progreso en Matemática",
         "avances_generales": "Observaciones generales de integración, conducta social y autonomía"
       }
       
       Contexto de origen:
       ---
       ${context}
       ---
       No devuelvas Markdown. Devuelve SÓLO el texto del JSON.
       `;
    }
    
    const parts: any[] = [];
    
    // Si hay archivos cargados para el alumno (Fase 4: subida), inyectarlos al prompt
    if (alumno.documentos && alumno.documentos.length > 0) {
      alumno.documentos.forEach((doc: any) => {
        if (doc.geminiFileUri && doc.geminiMimeType) {
          parts.push({
            fileData: {
              mimeType: doc.geminiMimeType,
              fileUri: doc.geminiFileUri
            }
          });
        }
      });
    }

    parts.push({ text: prompt });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: { temperature: 0.2 }
    });
    
    const text = result.response.text();
    // Clean potential markdown blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}
