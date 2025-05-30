const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const chatController = require('../controllers/chatController');

router.post('/', auth, chatController.ask);
router.get('/:chat_id', auth, chatController.getChat);
router.get('/:chat_id/:period', auth, chatController.getChatPeriod);

module.exports = router;