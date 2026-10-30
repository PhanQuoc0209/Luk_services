import test from 'node:test';
import assert from 'node:assert/strict';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'application/zip',
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function validateFileForUpload(mimeType, sizeBytes) {
  if (sizeBytes > MAX_FILE_SIZE) {
    throw new Error('FILE_TOO_LARGE');
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error('UNSUPPORTED_MIME_TYPE');
  }
  return true;
}

test('File Storage: Valid MIME types are accepted', () => {
  assert.equal(validateFileForUpload('application/pdf', 1024 * 100), true);
  assert.equal(
    validateFileForUpload(
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      1024 * 500
    ),
    true
  );
  assert.equal(validateFileForUpload('video/mp4', 10 * 1024 * 1024), true);
  assert.equal(validateFileForUpload('image/png', 500 * 1024), true);
});

test('File Storage: Invalid or dangerous MIME types are rejected', () => {
  assert.throws(
    () => validateFileForUpload('application/x-msdownload', 100),
    /UNSUPPORTED_MIME_TYPE/
  );
  assert.throws(
    () => validateFileForUpload('application/x-sh', 100),
    /UNSUPPORTED_MIME_TYPE/
  );
  assert.throws(
    () => validateFileForUpload('text/javascript', 100),
    /UNSUPPORTED_MIME_TYPE/
  );
});

test('File Storage: Files exceeding 50MB are rejected', () => {
  const overSize = 51 * 1024 * 1024;
  assert.throws(
    () => validateFileForUpload('video/mp4', overSize),
    /FILE_TOO_LARGE/
  );
});
