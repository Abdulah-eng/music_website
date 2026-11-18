import { NextRequest, NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storage';
import { saveCustomProject, CustomProjectRecord } from '@/lib/projectsRegistry';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as 'artwork' | 'audio' | 'video') || 'artwork';
    const title = (formData.get('title') as string) || '';
    const artist = (formData.get('artist') as string) || 'Mainahtunes Client Session';
    const style = (formData.get('style') as string) || (category === 'artwork' ? 'Commercial Visual Master' : category === 'audio' ? 'Studio Master' : 'Music Video Reel');
    const description = (formData.get('description') as string) || 'Uploaded via MainahtunesStudio Project Uploader';
    const deliverablesRaw = formData.get('deliverables') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in upload request.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Upload file to permanent external cloud storage
    const uploadResult = await uploadToStorage(buffer, file.name, category, file.type);

    // 2. Format custom project record
    const projectId = `custom-${category}-${Date.now().toString(36)}`;
    let deliverables = ['High-Resolution Master Delivery', 'Commercial Rights Release'];
    if (deliverablesRaw) {
      try {
        deliverables = JSON.parse(deliverablesRaw);
      } catch {
        deliverables = deliverablesRaw.split(',').map((d) => d.trim()).filter(Boolean);
      }
    }

    const projectRecord: CustomProjectRecord = {
      id: projectId,
      category,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      artist: artist || 'Mainahtunes Client Session',
      style,
      description,
      concept: description,
      fileUrl: uploadResult.url,
      fileName: uploadResult.filename,
      deliverables,
      format: category === 'audio' ? '24-bit WAV / 320k MP3 Master' : category === 'video' ? '1080p / 4K MP4' : '3000 x 3000 px Master',
      lufs: category === 'audio' ? '-9.0 LUFS' : undefined,
      duration: category === 'video' ? '02:30' : undefined,
      createdAt: new Date().toISOString(),
    };

    // 3. Save project record into permanent registry
    await saveCustomProject(projectRecord);

    return NextResponse.json({
      success: true,
      category,
      project: projectRecord,
      publicUrl: uploadResult.url,
      provider: uploadResult.provider,
      filename: uploadResult.filename,
      message: `Project "${projectRecord.title}" successfully uploaded and published to the live portfolio!`,
    });
  } catch (error: any) {
    console.error('Admin upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload and publishing failed.' },
      { status: 500 }
    );
  }
}
