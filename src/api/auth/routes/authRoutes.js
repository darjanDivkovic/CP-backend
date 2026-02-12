const express = require('express')
const router = express.Router();
const { issueRoomTokenHandler } = require('../controllers/authControllers');

router.post('/token', issueRoomTokenHandler);

module.exports = router;