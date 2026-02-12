const pool = require('../../../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createRoom(name, password) {
  const roomId = uuidv4().slice(0, 8).toUpperCase();
  const hashedPw = await bcrypt.hash(password || '', 10);

  const result = await pool.query(
    `INSERT INTO rooms (id, name, password)
     VALUES ($1, $2, $3)
     RETURNING id, name`,
    [roomId, name.trim(), hashedPw]
  );

  if (result.rowCount === 0) throw new Error('Failed to create room');
  return result.rows[0];
}

async function getRoomById(roomId) {
  const normalized = roomId.trim().toUpperCase();
  const result = await pool.query(
    'SELECT id, name, password FROM rooms WHERE id = $1',
    [normalized]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
}

module.exports = {
  createRoom,
  getRoomById,
};