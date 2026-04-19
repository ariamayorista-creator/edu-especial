import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, alumno, logs } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API Key missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // PASO 1: AGENTE ANALISTA (PROCESAMIENTO DE DATOS)
    // En un grafo real, este sería el primer nodo.
    const analystPrompt = `Analiza los siguientes registros diarios de ${alumno?.nombre} y extrae los 3 puntos clave sobre su desempeño pedagógico reciente:
    ${logs?.map((l: any) => l.observacion).join('\n')}`;
    
    const analystResult = await model.generateContent(analystPrompt);
    const analysis = analystResult.response.text();

    // PASO 2: AGENTE ORIENTADOR (GENERACIÓN DE RESPUESTA)
    // Este agente toma el análisis del primero y genera la respuesta final.
    const advisorPrompt = `Eres un orientador experto. Basándote en este análisis:
    "${analysis}"
    
    Responde al siguiente requerimiento del docente de forma estratégica y práctica:
    "${messages[messages.length - 1].content}"
    
    Usa el perfil del alumno como base: ${alumno?.diagnostico}.`;

    const finalResponse = await model.generateContent(advisorPrompt);
    const reply = finalResponse.response.text();

    return Response.json({ 
      content: reply,
      role: 'assistant',
      debug: { analysis } // Enviamos el análisis intermedio para transparencia
    });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
