import { Server as SocketServer } from 'socket.io';

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

export const initializeSocket = (server: any): void => {
  const io = new SocketServer(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://192.168.1.223:3001',
        'http://192.168.1.223:3000',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id, 'from:', socket.handshake.address);

    socket.on('join-channel', ({ channelId, userId, username }) => {
      socket.join(channelId);
      if (!rooms[channelId]) {
        rooms[channelId] = { participants: {}, activeCall: false };
      }
      rooms[channelId].participants[socket.id] = { userId, username };
      io.to(channelId).emit('user-joined', {
        socketId: socket.id,
        userId,
        username,
      });
      socket.emit('channel-participants', rooms[channelId].participants);
      console.log(`${username} joined channel: ${channelId}, participants:`, rooms[channelId].participants);
    });

    socket.on('leave-channel', ({ channelId }) => {
      if (rooms[channelId] && rooms[channelId].participants[socket.id]) {
        const username = rooms[channelId].participants[socket.id].username;
        socket.to(channelId).emit('user-left', { socketId: socket.id, username });
        delete rooms[channelId].participants[socket.id];
        socket.leave(channelId);
        if (Object.keys(rooms[channelId].participants).length === 0) {
          delete rooms[channelId];
        }
        console.log(`${username} left channel: ${channelId}, remaining:`, rooms[channelId]?.participants || 'none');
      }
    });

    socket.on('send-message', (message) => {
      socket.to(message.channelId).emit('new-message', message);
    });

    socket.on('whiteboard-update', ({ channelId, data }) => {
      socket.to(channelId).emit('whiteboard-updated', data);
    });

    socket.on('rtc-offer', ({ channelId, to, from, offer }) => {
      console.log(`Relaying offer from ${from} to ${to} in channel ${channelId}`);
      if (io.sockets.sockets.get(to)) {
        socket.to(to).emit('rtc-offer', { channelId, from, offer });
      } else {
        console.error(`Target socket ${to} not found for offer`);
      }
    });

    socket.on('rtc-answer', ({ channelId, to, from, answer }) => {
      console.log(`Relaying answer from ${from} to ${to} in channel ${channelId}`);
      if (io.sockets.sockets.get(to)) {
        socket.to(to).emit('rtc-answer', { channelId, from, answer });
      } else {
        console.error(`Target socket ${to} not found for answer`);
      }
    });

    socket.on('ice-candidate', ({ channelId, to, candidate }) => {
      console.log(`Relaying ICE candidate to ${to} in channel ${channelId}`);
      if (io.sockets.sockets.get(to)) {
        socket.to(to).emit('ice-candidate', { channelId, to, candidate });
      } else {
        console.error(`Target socket ${to} not found for ICE candidate`);
      }
    });

    socket.on('start-screen-share', ({ channelId }) => {
      socket.to(channelId).emit('user-screen-share', { socketId: socket.id, isSharing: true });
    });

    socket.on('stop-screen-share', ({ channelId }) => {
      socket.to(channelId).emit('user-screen-share', { socketId: socket.id, isSharing: false });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      Object.keys(rooms).forEach((channelId) => {
        if (rooms[channelId].participants[socket.id]) {
          const username = rooms[channelId].participants[socket.id].username;
          socket.to(channelId).emit('user-left', { socketId: socket.id, username });
          delete rooms[channelId].participants[socket.id];
          if (Object.keys(rooms[channelId].participants).length === 0) {
            delete rooms[channelId];
          }
        }
      });
    });
  });
};