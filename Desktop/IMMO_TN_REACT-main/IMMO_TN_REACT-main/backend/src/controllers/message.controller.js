const db = require('../config/database');
const { notifyNewMessage } = require('../utils/notificationHelper');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await db.query(`
      SELECT 
        m.id,
        CASE 
          WHEN m.sender_id = $1 THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id,
        u.name as other_user_name,
        u.photo as other_user_photo,
        m.message,
        m.created_at,
        m.is_read
      FROM messages m
      INNER JOIN (
        SELECT 
          CASE 
            WHEN sender_id = $2 THEN receiver_id 
            ELSE sender_id 
          END as user_id,
          MAX(created_at) as max_date
        FROM messages
        WHERE sender_id = $2 OR receiver_id = $2
        GROUP BY user_id
      ) latest ON (
        (m.sender_id = $2 AND m.receiver_id = latest.user_id) OR
        (m.receiver_id = $2 AND m.sender_id = latest.user_id)
      ) AND m.created_at = latest.max_date
      INNER JOIN users u ON u.id = latest.user_id
      ORDER BY m.created_at DESC
    `, [req.userId, req.userId]);

    res.json(conversations.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await db.query(`
      SELECT m.*, 
        sender.name as sender_name,
        receiver.name as receiver_name
      FROM messages m
      LEFT JOIN users sender ON m.sender_id = sender.id
      LEFT JOIN users receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC
    `, [req.userId, userId]);

    // Mark messages as read
    await db.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false',
      [userId, req.userId]
    );

    res.json(messages.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver and message are required' });
    }

    // Get sender's role
    const senderResult = await db.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (senderResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Visitors cannot send messages
    if (senderResult.rows[0].role === 'visitor') {
      return res.status(403).json({ 
        message: 'Les visiteurs ne peuvent pas envoyer de messages. Veuillez passer au rôle Acheteur ou Vendeur.' 
      });
    }

    // Cannot message yourself
    if (req.userId === parseInt(receiverId)) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous envoyer un message' });
    }

    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, receiverId, message]
    );

    // Get sender name for notification
    const senderNameResult = await db.query('SELECT name FROM users WHERE id = $1', [req.userId]);
    const senderName = senderNameResult.rows[0]?.name || 'Un utilisateur';

    // Notify receiver
    notifyNewMessage(req.userId, receiverId, senderName, message);

    res.status(201).json({
      message: 'Message sent successfully',
      messageId: result.rows[0].id
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const messages = await db.query('SELECT sender_id FROM messages WHERE id = $1', [id]);

    if (!messages.rows || messages.rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (messages.rows[0].sender_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await db.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
