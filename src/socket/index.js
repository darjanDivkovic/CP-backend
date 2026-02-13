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

  io.engine.on("connection_error", (err) => {
  console.log("engine connection_error:", {
    code: err.code,
    message: err.message,
    context: err.context,
  });
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id, "transport:", socket.conn.transport.name);
  socket.conn.on("upgrade", (t) => console.log("upgraded to:", t.name));
  socket.on("disconnect", (reason) => console.log("socket disconnected:", socket.id, reason));
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
