import { BadRequestException } from '@nestjs/common';
import { diskStorage, type Options as MulterOptions } from 'multer';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { Request } from 'express';

type MulterCallback = (error: Error | null, destination: string) => void;
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

function ensureUploadsDir(): string {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadsPath, { recursive: true });
  return uploadsPath;
}

function sanitizeBaseName(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.+/g, '.')
    .replace(/^[-_.]+|[-_.]+$/g, '');

  return base.length ? base : 'report';
}

export const reportPdfMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req: Request, file, cb: MulterCallback) => {
      try {
        const uploadsPath = ensureUploadsDir();
        cb(null, uploadsPath);
      } catch (e) {
        cb(e as Error, '');
      }
    },
    filename: (req: Request, file, cb: MulterCallback) => {
      const originalExt = path.extname(file.originalname || '').toLowerCase();
      const ext = originalExt === '.pdf' ? '.pdf' : '.pdf';
      const baseName = sanitizeBaseName(
        path.basename(file.originalname, originalExt),
      );
      const filename = `${baseName}-${randomUUID()}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    const mimeOk = file.mimetype === 'application/pdf';
    const extOk =
      path.extname(file.originalname || '').toLowerCase() === '.pdf';

    if (!mimeOk || !extOk) {
      return cb(
        new BadRequestException('Only PDF files are allowed') as any,
        false,
      );
    }

    cb(null, true);
  },
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 1,
  },
};
