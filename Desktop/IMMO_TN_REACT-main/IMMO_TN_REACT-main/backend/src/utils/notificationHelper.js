const db = require('../config/database');

/**
 * Create a notification for a user
 * @param {number} userId - The user ID to send notification to
 * @param {string} type - Type of notification (message, favorite, property, etc.)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} data - Additional data (propertyId, userId, etc.)
 */
const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    await db.query(
      'INSERT INTO notifications (user_id, type, title, message, data) VALUES ($1, $2, $3, $4, $5)',
      [userId, type, title, message, JSON.stringify(data)]
    );
    console.log(`✅ Notification created for user ${userId}: ${title}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

/**
 * Notify property owner when someone favorites their property
 */
const notifyPropertyFavorited = async (propertyId, userId, userName) => {
  try {
    const result = await db.query(
      'SELECT user_id, title FROM properties WHERE id = $1',
      [propertyId]
    );

    if (result.rows.length > 0) {
      const ownerId = result.rows[0].user_id;
      const propertyTitle = result.rows[0].title;

      // Don't notify if user favorited their own property
      if (ownerId !== userId) {
        await createNotification(
          ownerId,
          'favorite',
          'Nouveau favori',
          `${userName} a ajouté "${propertyTitle}" à ses favoris`,
          { propertyId, userId }
        );
      }
    }
  } catch (error) {
    console.error('Error notifying property favorited:', error);
  }
};

/**
 * Notify user when they receive a new message
 */
const notifyNewMessage = async (senderId, receiverId, senderName, messagePreview) => {
  try {
    // Don't notify if user is messaging themselves
    if (senderId !== receiverId) {
      await createNotification(
        receiverId,
        'message',
        'Nouveau message',
        `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
        { userId: senderId, userName: senderName }
      );
    }
  } catch (error) {
    console.error('Error notifying new message:', error);
  }
};

/**
 * Notify users when a new property is added in their area
 */
const notifyNewPropertyInArea = async (propertyId, city, propertyTitle) => {
  try {
    // Find users who have properties in the same city (potential interested users)
    const result = await db.query(
      'SELECT DISTINCT user_id FROM properties WHERE city = $1 AND id != $2 LIMIT 10',
      [city, propertyId]
    );

    for (const row of result.rows) {
      await createNotification(
        row.user_id,
        'property',
        'Nouvelle propriété disponible',
        `Une nouvelle propriété "${propertyTitle}" est disponible à ${city}`,
        { propertyId }
      );
    }
  } catch (error) {
    console.error('Error notifying new property:', error);
  }
};

/**
 * Notify property owner when someone contacts them
 */
const notifyPropertyContact = async (propertyId, contactUserId, contactUserName) => {
  try {
    const result = await db.query(
      'SELECT user_id, title FROM properties WHERE id = $1',
      [propertyId]
    );

    if (result.rows.length > 0) {
      const ownerId = result.rows[0].user_id;
      const propertyTitle = result.rows[0].title;

      if (ownerId !== contactUserId) {
        await createNotification(
          ownerId,
          'message',
          'Intérêt pour votre propriété',
          `${contactUserName} est intéressé par "${propertyTitle}"`,
          { propertyId, userId: contactUserId, userName: contactUserName }
        );
      }
    }
  } catch (error) {
    console.error('Error notifying property contact:', error);
  }
};

module.exports = {
  createNotification,
  notifyPropertyFavorited,
  notifyNewMessage,
  notifyNewPropertyInArea,
  notifyPropertyContact,
};
