import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_ROOT = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.resolve(process.cwd(), 'uploads/private');

// Ensure storage directory exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

export const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'text/plain',
  // Video & Audio
  'video/mp4',
  'video/quicktime',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
]);

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export interface SavedFileInfo {
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
}

export async function savePrivateFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<SavedFileInfo> {
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`FILE_TOO_LARGE: Dung lượng vượt quá giới hạn 50MB.`);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`UNSUPPORTED_MIME_TYPE: Định dạng file (${mimeType}) không được hỗ trợ.`);
  }

  // Generate safe unique filename
  const ext = path.extname(originalName).toLowerCase() || '.bin';
  const randomHash = crypto.randomBytes(16).toString('hex');
  const safeFileName = `${Date.now()}-${randomHash}${ext}`;
  const targetPath = path.join(UPLOAD_ROOT, safeFileName);

  // Write file to private disk
  await fs.promises.writeFile(targetPath, fileBuffer);

  return {
    fileName: safeFileName,
    originalName: path.basename(originalName),
    fileSize: fileBuffer.length,
    mimeType,
    storagePath: targetPath,
  };
}

export function getPrivateFilePath(fileName: string): string {
  const safeName = path.basename(fileName);
  return path.join(UPLOAD_ROOT, safeName);
}

export async function readPrivateFile(fileName: string): Promise<{ buffer: Buffer; exists: boolean }> {
  const filePath = getPrivateFilePath(fileName);
  if (!fs.existsSync(filePath)) {
    return { buffer: Buffer.alloc(0), exists: false };
  }
  const buffer = await fs.promises.readFile(filePath);
  return { buffer, exists: true };
}
