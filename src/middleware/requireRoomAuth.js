const jwt = require('jsonwebtoken');

function requireRoomAuth(req, res, next) {
  const { id: roomId } = req.body;

  const token = req.cookies?.[`room_token_${roomId}`];
  if (!token) return res.status(401).json({ error: 'No room token' });

  try {
    const payload = jwt.verify(token, process.env.ROOM_JWT_SECRET);

    // Ensure token is for the same room route being accessed
    if (String(payload.rid) !== String(roomId)) {
      return res.status(403).json({ error: 'Token not valid for this room' });
    }

    req.roomAuth = { roomId: payload.rid };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired room token' });
  }
}

module.exports = { requireRoomAuth };
