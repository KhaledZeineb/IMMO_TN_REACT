const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes
router.post('/', authMiddleware, propertyController.createProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);
router.get('/user/my-properties', authMiddleware, propertyController.getUserProperties);

module.exports = router;
