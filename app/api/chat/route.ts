import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, alumno, logs } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY no configurada.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build system context
    const safeStudentName = "El estudiante";
    const context = `
Perfil del Alumno:
Nombre: ${safeStudentName}
Diagnóstico: ${alumno?.diagnostico || 'No especificado'}
Perfil Pedagógico:
- Como aprende: ${alumno?.perfil_pedagogico?.como_aprende || 'No especificado'}
- Lectura: ${alumno?.perfil_pedagogico?.etapa_lectura || 'No evaluada'}
- Matemática: ${alumno?.perfil_pedagogico?.etapa_matematica || 'No evaluada'}
- Apoyos/Andamiajes: ${alumno?.perfil_pedagogico?.andamiajes || 'Ninguno'}

Registros Diarios (${logs?.length || 0}):
${logs?.map((l: any) => `- Fecha: ${l.fecha}. Observación: ${l.observacion || ''}. Participó: ${l.participo}. Apoyo visual: ${l.uso_apoyo_visual}.`).join('\n') || 'Sin registros.'}
    `.trim();

    // Check for template structures
    const plantillas = alumno?.documentos?.filter((d: any) => d.esPlantilla && d.tipo === 'txt');
    const estructuraContext = plantillas?.length > 0 
      ? `ESTRUCTURA OBLIGATORIA DE SALIDA (Sigue este formato):\n${plantillas.map((p: any) => p.descripcion || p.nombre).join('\n')}`
      : 'Usa el formato estándar de la Comunicación 71/22 de la PBA.';

    const systemInstruction = `Eres un orientador pedagógico de Educación Especial experto en la normativa de la Provincia de Buenos Aires.
Tu objetivo es ayudar al docente a redactar informes, PPIs y pensar estrategias para sus alumnos.

ESTRUCTURA REQUERIDA:
${estructuraContext}

PERFIL DEL ALUMNO A ANALIZAR:
---
${context}
---

INSTRUCCIONES CRÍTICAS:
1. Si existe una "ESTRUCTURA OBLIGATORIA" arriba, síguela al pie de la letra.
2. Mantén un tono profesional y enfócate en las capacidades del alumno.
3. NUNCA menciones el nombre real del alumno; usa "el estudiante".
4. Responde con formato Markdown cuando sea apropiado.`;

    // Convert messages to Gemini format
    const history = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    const lastMessage = history.pop();
    if (!lastMessage) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    const chat = model.startChat({
      history,
      systemInstruction,
    });

    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err: any) {
          controller.enqueue(encoder.encode(`\n\n[ERROR]: ${err.message}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
