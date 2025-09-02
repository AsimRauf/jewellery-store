import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const folder = searchParams.get('folder');

  if (!folder || (folder !== 'categories' && folder !== 'styles')) {
    return NextResponse.json({ error: 'Invalid folder specified' }, { status: 400 });
  }

  const dirPath = path.join(process.cwd(), 'public', folder);

  try {
    const files = fs.readdirSync(dirPath);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|svg)$/i.test(file))
      .map(file => ({
        name: file,
        path: `/${folder}/${file}`,
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return NextResponse.json({ error: 'Failed to read images directory' }, { status: 500 });
  }
}