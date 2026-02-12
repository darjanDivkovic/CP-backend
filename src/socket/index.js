// src/main/socket/index.js
const { Server } = require('socket.io');

let ioInstance = null;

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
    pingInterval: 2500,
    pingTimeout: 6000,
  });

  ioInstance = io;

  // Register feature-specific handlers
  require('./handlers/presence')(io);

  // You can add more later, e.g.:
  // require('./handlers/chat')(io);
  // require('./handlers/collaboration')(io);

  return io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.IO not yet initialized');
  }
  return ioInstance;
}

module.exports = { initializeSocket, getIO };