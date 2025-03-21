import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db';
import checkConnection from './config/db_supa';
import userRoutes from './routes/userRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import rtcRoutes from './routes/rtcRoutes';
import whiteboardRoutes from './routes/whiteboardRoutes';
import { initializeSocket } from './config/socket';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000', 
    'http://192.168.1.223:3000' // Replace with your PC's local IP
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to databases
connectDB(); // MongoDB connection from config/db
checkConnection(); // Supabase connection check

// Alternate MongoDB connection (if needed)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edusync')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Initialize Socket.io
initializeSocket(server);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rtc', rtcRoutes);
app.use('/api/whiteboard', whiteboardRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express Backend!');
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});