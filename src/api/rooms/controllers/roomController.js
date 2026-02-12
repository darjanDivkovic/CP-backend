const { createRoom, getRoomById } = require('../services/roomService');

async function createRoomHandler(req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = await createRoom(name, password);
    res.status(201).json({
      id: room.id,
      name: room.name,
      message: 'Room created',
    });
  } catch (err) {
    next(err);
  }
}

async function joinRoomHandler(req, res, next) {
  try {
    const { id } = req.body;

    const room = await getRoomById(id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    res.json({
      success: true,
      id: room.id,
      roomName: room.name,
    });
  } catch (err) {
    next(err);
  }
}

async function checkRoomStatusHandler(req, res, next) {
  try {
    const { id } = req.body;

    const room = await getRoomById(id);

     res.json({
        exists: !!room,
      });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  createRoomHandler,
  joinRoomHandler,
  checkRoomStatusHandler,
};