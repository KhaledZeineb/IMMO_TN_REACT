const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seedData() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      ['Rayen Chraiet', 'rayen@example.com', '+216 94599198', hashedPassword],
      ['Sihem Barghouda', 'sihem@example.com', '+216 12345678', hashedPassword],
      ['Ahmed Ben Ali', 'ahmed@example.com', '+216 23456789', hashedPassword],
      ['Fatma Trabelsi', 'fatma@example.com', '+216 34567890', hashedPassword],
    ];

    for (const user of users) {
      await db.query(
        'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
        user
      );
    }
    console.log('✅ Users created');

    // Sample properties data
    const properties = [
      ['Appartement Moderne à Tunis', 'Magnifique appartement de 120m² avec vue sur la mer', 'APARTMENT', 'SALE', 350000, 'Tunis', 'Avenue Habib Bourguiba', 120, 3, 2, 1],
      ['Villa avec Piscine à La Marsa', 'Villa luxueuse avec jardin et piscine', 'VILLA', 'SALE', 850000, 'Tunis', 'La Marsa', 300, 5, 3, 1],
      ['Studio à Sousse', 'Studio meublé proche de la plage', 'APARTMENT', 'RENT', 800, 'Sousse', 'Centre Ville', 45, 1, 1, 1],
      ['Terrain Constructible', 'Terrain de 500m² zone résidentielle', 'LAND', 'SALE', 180000, 'Nabeul', 'Hammamet', 500, 0, 0, 2],
      ['Appartement S+2 à Sfax', 'Appartement spacieux bien situé', 'APARTMENT', 'RENT', 1200, 'Sfax', 'Centre Ville', 90, 2, 1, 2],
      ['Maison Traditionnelle', 'Belle maison avec patio', 'HOUSE', 'SALE', 420000, 'Kairouan', 'Médina', 180, 4, 2, 2],
      ['Bureau Commercial', 'Espace de bureau moderne', 'OFFICE', 'RENT', 2500, 'Tunis', 'Les Berges du Lac', 150, 0, 2, 3],
      ['Villa avec Jardin', 'Villa familiale spacieuse', 'VILLA', 'SALE', 650000, 'Sousse', 'Khezama', 250, 4, 3, 3],
      ['Appartement Vue Mer', 'Appartement de standing avec balcon', 'APARTMENT', 'SALE', 280000, 'Bizerte', 'Corniche', 100, 3, 2, 3],
      ['Studio Étudiant', 'Studio meublé proche université', 'APARTMENT', 'RENT', 600, 'Monastir', 'Centre', 35, 1, 1, 4],
    ];

    for (const property of properties) {
      await db.query(
        `INSERT INTO properties 
        (title, description, type, transaction_type, price, city, address, surface, bedrooms, bathrooms, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        property
      );
    }
    console.log('✅ Properties created');

    // Sample messages
    await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [1, 2, 'Bonjour, je suis intéressé par votre propriété']
    );
    await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [2, 1, 'Bonjour! Merci pour votre intérêt. La propriété est toujours disponible.']
    );
    console.log('✅ Messages created');

    // Sample favorites
    await db.query('INSERT INTO favorites (user_id, property_id) VALUES (?, ?)', [1, 2]);
    await db.query('INSERT INTO favorites (user_id, property_id) VALUES (?, ?)', [1, 5]);
    console.log('✅ Favorites created');

    // Sample notifications
    await db.query(
      'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
      [1, 'property', 'Nouvelle propriété', 'Une nouvelle villa a été ajoutée à La Marsa']
    );
    await db.query(
      'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
      [1, 'message', 'Nouveau message', 'Vous avez reçu un nouveau message']
    );
    console.log('✅ Notifications created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('Email: rayen@example.com');
    console.log('Password: password123');
    console.log('\nOr use any of the other test accounts with the same password.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedData();
