const { Server } = require('socket.io');

let ioInstance = null;

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://cp-frontend-9ti0.onrender.com',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  ioInstance = io;

  require('./handlers/presence')(io);

  return io;
}

function getIO() {
  if (!ioInstance) throw new Error('Socket.IO not yet initialized');
  return ioInstance;
}

module.exports = { initializeSocket, getIO };
