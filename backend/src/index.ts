import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const videosDir = path.join(__dirname, '../videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, videosDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Только видео файлы разрешены'));
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024,
  }
});

app.post('/api/upload-video/slow', upload.single('video'), (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Файл не был загружен' });
      return;
    }

    res.status(200).json({
      message: 'Видео успешно загружено',
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при загрузке файла' });
  }
});


app.use((error: any, _req: express.Request, res: express.Response) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Файл слишком большой. Максимальный размер: 500MB' });
      return;
    }
  }
  res.status(400).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
