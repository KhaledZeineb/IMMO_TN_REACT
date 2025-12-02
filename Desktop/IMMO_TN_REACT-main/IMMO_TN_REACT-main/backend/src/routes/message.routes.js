const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/conversations', messageController.getConversations);
router.get('/:userId', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
