const db = require('../config/database');
const { notifyPropertyFavorited } = require('../utils/notificationHelper');

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await db.query(`
      SELECT f.*, p.*, u.name as owner_name
      FROM favorites f
      INNER JOIN properties p ON f.property_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `, [req.userId]);

    res.json(favorites.rows);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    // Get user's role
    const userResult = await db.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Visitors cannot add favorites (optional - can be removed if you want visitors to favorite)
    if (userResult.rows[0].role === 'visitor') {
      return res.status(403).json({ 
        message: 'Les visiteurs ne peuvent pas ajouter aux favoris. Passez au rôle Acheteur pour cette fonctionnalité.' 
      });
    }

    // Check if already favorited
    const existing = await db.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND property_id = $2',
      [req.userId, propertyId]
    );

    if (existing.rows && existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    await db.query(
      'INSERT INTO favorites (user_id, property_id) VALUES ($1, $2)',
      [req.userId, propertyId]
    );

    // Get user name for notification
    const userNameResult = await db.query('SELECT name FROM users WHERE id = $1', [req.userId]);
    const userName = userNameResult.rows[0]?.name || 'Un utilisateur';

    // Notify property owner
    notifyPropertyFavorited(propertyId, req.userId, userName);

    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND property_id = $2',
      [req.userId, propertyId]
    );

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if property is favorited
exports.checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorites = await db.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND property_id = $2',
      [req.userId, propertyId]
    );

    res.json({ isFavorite: favorites.rows && favorites.rows.length > 0 });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
