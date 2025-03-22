import express from 'express';
import multer from 'multer';
import * as messageController from '../controllers/messageController';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Use an absolute path for the uploads directory
const uploadDir = path.resolve(process.cwd(), 'uploads');
console.log('Upload directory path:', uploadDir);

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory at:', uploadDir);
  } catch (error) {
    console.error('Failed to create uploads directory:', error);
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images, videos, and documents
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB limit
  },
  fileFilter: fileFilter,
});

// Message routes
router.get('/:channelId', messageController.getMessages);
router.post('/:channelId', messageController.createMessage);
router.post('/:channelId/media', upload.single('file'), messageController.uploadMedia);
router.delete('/:id', messageController.deleteMessage);

export default router;