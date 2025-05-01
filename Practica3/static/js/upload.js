// static/js/upload.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import multer from 'multer';

/* carpeta absoluta  …/practica3/static/img  */
const __dirname = path.dirname(fileURLToPath(import.meta.url));   // …/static/js
const uploadDir = path.resolve(__dirname, '..', 'img');           // sube 1 nivel

/* crea la carpeta si falta */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('🗂️  Creada carpeta', uploadDir);
}

export const uploadDirAbs = uploadDir;       // la exportamos para app.js

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const uploadImg = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    cb(null, /^image\/(png|jpe?g)$/i.test(file.mimetype)),
});
