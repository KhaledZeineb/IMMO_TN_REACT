const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/chat', aiController.chat);
router.get('/suggestions', aiController.getSuggestions);

module.exports = router;
