// config/socket.ts

import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

// Active rooms and their participants
const rooms: {
  [key: string]: {
    participants: {
      [socketId: string]: {
        userId?: string;
        username: string;
        peerId?: string;
      };
    };
    activeCall: boolean;
  };
} = {};

export const initializeSocket = (server: HttpServer): void => {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a channel room
    socket.on('join-channel', ({ channelId, userId, username }) => {
      socket.join(channelId);
      
      // Initialize room if it doesn't exist
      if (!rooms[channelId]) {
        rooms[channelId] = {
          participants: {},
          activeCall: false
        };
      }
      
      // Add participant to room
      rooms[channelId].participants[socket.id] = {
        userId,
        username,
      };
      
      // Broadcast to all users in the channel that a new user has joined
      io.to(channelId).emit('user-joined', {
        socketId: socket.id,
        userId,
        username,
        participants: rooms[channelId].participants
      });
      
      // Send existing participants to the new user
      socket.emit('channel-participants', rooms[channelId].participants);
      
      console.log(`${username} joined channel: ${channelId}`);
    });

    // Leave a channel room
    socket.on('leave-channel', ({ channelId }) => {
      if (rooms[channelId] && rooms[channelId].participants[socket.id]) {
        const username = rooms[channelId].participants[socket.id].username;
        
        // Notify others that user has left
        socket.to(channelId).emit('user-left', {
          socketId: socket.id,
          username
        });
        
        // Remove user from participants
        delete rooms[channelId].participants[socket.id];
        socket.leave(channelId);
        
        console.log(`${username} left channel: ${channelId}`);
        
        // Clean up empty rooms
        if (Object.keys(rooms[channelId].participants).length === 0) {
          delete rooms[channelId];
        }
      }
    });

    // New message in a channel
    socket.on('send-message', (message) => {
      // Broadcast message to all users in the channel
      socket.to(message.channelId).emit('new-message', message);
    });

    // Whiteboard updates
    socket.on('whiteboard-update', ({ channelId, data }) => {
      // Broadcast whiteboard updates to all users in the channel except sender
      socket.to(channelId).emit('whiteboard-updated', data);
    });

    // WebRTC Signaling
    
    // Start a call in a channel
    socket.on('start-call', ({ channelId, type }) => {
      if (rooms[channelId]) {
        rooms[channelId].activeCall = true;
        io.to(channelId).emit('call-started', { 
          channelId, 
          initiator: socket.id,
          type // 'voice' or 'video'
        });
      }
    });
    
    // End a call in a channel
    socket.on('end-call', ({ channelId }) => {
      if (rooms[channelId]) {
        rooms[channelId].activeCall = false;
        io.to(channelId).emit('call-ended', { channelId });
      }
    });
    
    // WebRTC signaling - offer
    socket.on('rtc-offer', ({ channelId, to, from, offer }) => {
      socket.to(to).emit('rtc-offer', {
        channelId,
        from,
        offer
      });
    });
    
    // WebRTC signaling - answer
    socket.on('rtc-answer', ({ channelId, to, from, answer }) => {
      socket.to(to).emit('rtc-answer', {
        channelId,
        from,
        answer
      });
    });
    
    // WebRTC signaling - ICE candidate
    socket.on('ice-candidate', ({ channelId, to, candidate }) => {
      socket.to(to).emit('ice-candidate', {
        channelId,
        candidate
      });
    });
    
    // Screen sharing
    socket.on('start-screen-share', ({ channelId }) => {
      socket.to(channelId).emit('user-screen-share', {
        socketId: socket.id,
        isSharing: true
      });
    });
    
    socket.on('stop-screen-share', ({ channelId }) => {
      socket.to(channelId).emit('user-screen-share', {
        socketId: socket.id,
        isSharing: false
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove user from all channels they were part of
      Object.keys(rooms).forEach(channelId => {
        if (rooms[channelId].participants[socket.id]) {
          const username = rooms[channelId].participants[socket.id].username;
          
          // Notify others in the channel
          socket.to(channelId).emit('user-left', {
            socketId: socket.id,
            username
          });
          
          // Remove from participants
          delete rooms[channelId].participants[socket.id];
          
          // Clean up empty rooms
          if (Object.keys(rooms[channelId].participants).length === 0) {
            delete rooms[channelId];
          }
        }
      });
    });
  });
};