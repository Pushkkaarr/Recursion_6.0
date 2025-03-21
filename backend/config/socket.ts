
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { IMessage } from '../models/Message';

let io: SocketIOServer;

export const initializeSocket = (server: http.Server): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a channel room
    socket.on('joinChannel', (channelId: string) => {
      socket.join(channelId);
      console.log(`Socket ${socket.id} joined channel ${channelId}`);
    });

    // Leave a channel room
    socket.on('leaveChannel', (channelId: string) => {
      socket.leave(channelId);
      console.log(`Socket ${socket.id} left channel ${channelId}`);
    });

    // Join a video/voice call
    socket.on('joinCall', (channelId: string, userData: any) => {
      const roomUsers = getRoomUsers(channelId);
      
      // Notify others in the room that a new user joined
      socket.to(channelId).emit('userJoined', userData);
      
      // Send the list of existing users to the newly joined user
      socket.emit('existingUsers', roomUsers);
      
      // Join the socket to the channel room
      socket.join(channelId);
      console.log(`Socket ${socket.id} joined call in channel ${channelId}`);
    });

    // WebRTC signaling
    socket.on('offer', (offer: any, to: string) => {
      socket.to(to).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer: any, to: string) => {
      socket.to(to).emit('answer', answer, socket.id);
    });

    socket.on('ice-candidate', (candidate: any, to: string) => {
      socket.to(to).emit('ice-candidate', candidate, socket.id);
    });

    // Whiteboard events
    socket.on('whiteboardData', (channelId: string, data: any) => {
      socket.to(channelId).emit('whiteboardData', data);
    });

    // Disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Notify all rooms this socket was in that the user disconnected
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit('userLeft', socket.id);
        }
      });
    });
  });

  console.log('Socket.io initialized');
};

// Helper to get users in a room
const getRoomUsers = (roomId: string): string[] => {
  if (!io) return [];
  
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return [];
  
  return Array.from(room);
};

// Method to emit a new message to channel subscribers
export const emitNewMessage = (channelId: string, message: IMessage): void => {
  if (io) {
    io.to(channelId).emit('newMessage', message);
  }
};

// Method to emit channel updates
export const emitChannelUpdate = (channelId: string, updateType: 'created' | 'updated' | 'deleted', data?: any): void => {
  if (io) {
    io.emit('channelUpdate', { channelId, type: updateType, data });
  }
};

export default io;
