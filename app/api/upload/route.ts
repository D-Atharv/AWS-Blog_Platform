import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(buffer));

  return NextResponse.json({ filePath: `/uploads/${fileName}` });
}
