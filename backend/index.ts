import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './config/db';
import checkConnection from './config/db_supa';
import userRoutes from './routes/userRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import rtcRoutes from './routes/rtcRoutes';
import whiteboardRoutes from './routes/whiteboardRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://192.168.1.223:3000',
    'https://192.168.1.223:3001',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
checkConnection();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edusync')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const certPath = path.resolve(__dirname, '..', 'certs');
const httpsOptions = {
  key: fs.readFileSync(path.join(certPath, '192.168.1.223-key.pem')),
  cert: fs.readFileSync(path.join(certPath, '192.168.1.223.pem')),
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://192.168.1.223:3000',
  'https://192.168.1.223:3001',
];

const ioHttp = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const ioHttps = new Server(httpsServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

global.io = ioHttps;

[ioHttp, ioHttps].forEach(io => {
  io.on('connection', (socket) => {
    console.log('A user connected via Socket.io');

    socket.on('joinChannel', (channelId: string) => {
      socket.join(channelId);
      console.log(`User joined channel: ${channelId}`);
    });

    socket.on('leaveChannel', (channelId: string) => {
      socket.leave(channelId);
      console.log(`User left channel: ${channelId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
});

const HTTP_PORT = process.env.HTTP_PORT || 5000;
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on http://192.168.1.223:${HTTP_PORT}`);
});

const HTTPS_PORT = process.env.HTTPS_PORT || 5001;
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on https://192.168.1.223:${HTTPS_PORT}`);
});

app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rtc', rtcRoutes);
app.use('/api/whiteboard', whiteboardRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express Backend!');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});