// src/main/socket/handlers/presence.js
const rooms = new Map(); // roomId → Map<socket.id, userData>

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", ({ roomId, username = "Anonymous" }) => {
      if (!roomId) return;

      socket.join(roomId);
      socket.data.roomId = roomId;

      const user = {
        id: socket.id,
        name: username,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        x: 0,
        y: 0,
      };

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }
      rooms.get(roomId).set(socket.id, user);

      // Send full list to everyone in room
      io.to(roomId).emit(
        "users-update",
        Array.from(rooms.get(roomId).values()),
      );
    });

    socket.on("send-message", ({ message }) => {
      console.log("FE SENT MESSAGE");
      const roomId = socket.data.roomId;
      const user = rooms.get(roomId)?.get(socket.id);

      console.log("user", user);
      // Send message to everyone in the room except sender
      // return the sender and the message he sent to everyone in the room
      socket.to(roomId).emit("receive-message", {
        id: user?.id,
        message,
      });
    });

    socket.on("cursor-move", ({ x, y }) => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const user = rooms.get(roomId)?.get(socket.id);
      if (!user) return;

      user.x = x;
      user.y = y;

      // Only delta → cheaper than full list
      socket.to(roomId).emit("cursor-update", { id: socket.id, x, y });
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (roomId && rooms.has(roomId)) {
        const roomUsers = rooms.get(roomId);
        roomUsers.delete(socket.id);

        if (roomUsers.size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("users-update", Array.from(roomUsers.values()));
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
