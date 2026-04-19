import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { query, catalog } = await req.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) // Fallback to 1.5 if 2.0/3.0 not avail in SDK
    
    const prompt = `
      Eres un asistente experto en educación especial (NEE). 
      Dado este catálogo de recursos: ${JSON.stringify(catalog)}
      
      Y esta consulta del docente: "${query}"
      
      Dime qué IDs de recursos (máximo 5) mejor se ajustan a su necesidad. 
      Responde SOLO con un array de números en formato JSON. Ejemplo: [1, 4, 7]
      No escribas nada más.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extraer array del texto por si Gemini añade decoradores MD
    const match = text.match(/\[.*\]/)
    const ids = match ? JSON.parse(match[0]) : []
    
    return NextResponse.json({ ids })
  } catch (error) {
    console.error('Gemini Search Error:', error)
    return NextResponse.json({ ids: [], error: 'IA temporarily unavailable' }, { status: 500 })
  }
}
