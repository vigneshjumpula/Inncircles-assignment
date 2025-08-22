import path from 'path'
import multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => 
    cb(null, path.join(__dirname, '../uploads')),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => 
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

const uploadFiles=upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'kyc', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]);

export default uploadFiles; 