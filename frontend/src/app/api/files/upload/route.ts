import { NextRequest, NextResponse } from 'next/server';
import { savePrivateFile } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file tải lên.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const savedFile = await savePrivateFile(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      file: savedFile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lưu trữ file.' },
      { status: 400 }
    );
  }
}
