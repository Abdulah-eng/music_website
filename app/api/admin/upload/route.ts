import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'artwork';
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in upload' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let targetSubdir = 'artwork';
    if (category === 'audio') targetSubdir = 'audio';
    else if (category === 'video') targetSubdir = 'videos';

    const targetDir = path.join(process.cwd(), 'public', targetSubdir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
    const finalPath = path.join(targetDir, safeName);

    fs.writeFileSync(finalPath, buffer);

    return NextResponse.json({
      success: true,
      category,
      filename: safeName,
      publicPath: `/${targetSubdir}/${safeName}`,
      size: buffer.length,
      message: `Asset "${safeName}" successfully uploaded and available at /${targetSubdir}/${safeName}`,
    });
  } catch (error: any) {
    console.error('Admin upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
