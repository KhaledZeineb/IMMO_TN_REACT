const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:propertyId', favoriteController.removeFavorite);
router.get('/check/:propertyId', favoriteController.checkFavorite);

module.exports = router;
