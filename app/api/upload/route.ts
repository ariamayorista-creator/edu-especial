import { NextResponse } from 'next/server';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import os from 'os';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta configurar GOOGLE_GENERATIVE_AI_API_KEY' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to temp directory to allow GoogleAIFileManager to read it
    const tmpFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${file.name}`);
    fs.writeFileSync(tmpFilePath, buffer);

    const fileManager = new GoogleAIFileManager(apiKey);
    
    const uploadResult = await fileManager.uploadFile(tmpFilePath, {
      mimeType: file.type,
      displayName: file.name,
    });

    // Clean up tmp file
    fs.unlinkSync(tmpFilePath);

    return NextResponse.json({
      uri: uploadResult.file.uri,
      name: uploadResult.file.name, // Gemini specific ID name models/..
      displayName: uploadResult.file.displayName,
      mimeType: uploadResult.file.mimeType
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error interno subiendo el archivo' }, { status: 500 });
  }
}
