const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await db.query(
      'SELECT id, name, email, phone, photo, bio, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (!users.rows || users.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, photo, role } = req.body;

    // Validate role if provided
    if (role && !['visitor', 'buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }
    if (photo !== undefined) {
      updates.push(`photo = $${paramCount++}`);
      values.push(photo);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }

    values.push(req.userId);

    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    const users = await db.query(
      'SELECT id, name, email, phone, photo, bio, role FROM users WHERE id = $1',
      [req.userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: users.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get current password
    const users = await db.query('SELECT password FROM users WHERE id = $1', [req.userId]);

    if (!users.rows || users.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, users.rows[0].password);

    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.userId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
