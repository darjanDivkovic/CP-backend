const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getRoomById } = require('../../rooms/services/roomService');

async function issueRoomTokenHandler(req, res, next) {
  try {
    const { roomId, password } = req.body;

    if (!roomId || typeof password !== 'string') {
      return res.status(400).json({ error: 'roomId and password are required' });
    }

    const room = await getRoomById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const match = await bcrypt.compare(password, room.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    // room-scoped token
    const token = jwt.sign(
      { rid: room.id },               // room id
      process.env.ROOM_JWT_SECRET,
      { expiresIn: '2h' }             // pick your TTL
    );

    // IMPORTANT: cookie name can include roomId so you can support multiple rooms
    res.cookie(`room_token_${room.id}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({ ok: true, roomId: room.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { issueRoomTokenHandler };