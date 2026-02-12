const express = require('express');
const router = express.Router();
const { createRoomHandler, joinRoomHandler, checkRoomStatusHandler} = require('../controllers/roomController');
const { requireRoomAuth } = require('../../../middleware/requireRoomAuth');

router.post('/', createRoomHandler);
router.post('/join', requireRoomAuth, joinRoomHandler);
router.post('/status', [], checkRoomStatusHandler)

module.exports = router;