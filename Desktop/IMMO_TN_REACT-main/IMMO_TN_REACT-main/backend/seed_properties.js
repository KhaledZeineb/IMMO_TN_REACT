const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'immo_tn',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const properties = [
  {
    title: 'Villa Moderne à La Marsa',
    description: 'Belle villa avec piscine et jardin, proche de la plage',
    type: 'Maison',
    transaction_type: 'vente',
    price: 850000,
    city: 'La Marsa',
    address: 'Zone touristique, La Marsa',
    surface: 350,
    bedrooms: 5,
    bathrooms: 3,
    latitude: 36.8785,
    longitude: 10.3250,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
  },
  {
    title: 'Appartement S+3 au Centre Ville',
    description: 'Appartement lumineux avec vue panoramique, bien situé',
    type: 'Appartement',
    transaction_type: 'location',
    price: 1200,
    city: 'Tunis',
    address: 'Avenue Habib Bourguiba, Tunis',
    surface: 120,
    bedrooms: 3,
    bathrooms: 2,
    latitude: 36.8065,
    longitude: 10.1815,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  },
  {
    title: 'Studio Moderne à Lac 2',
    description: 'Studio équipé et meublé, parking inclus',
    type: 'Appartement',
    transaction_type: 'location',
    price: 800,
    city: 'Tunis',
    address: 'Les Berges du Lac 2',
    surface: 45,
    bedrooms: 1,
    bathrooms: 1,
    latitude: 36.8334,
    longitude: 10.2381,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  },
  {
    title: 'Villa de Luxe à Sidi Bou Said',
    description: 'Villa traditionnelle avec architecture typique et vue mer',
    type: 'Maison',
    transaction_type: 'vente',
    price: 1250000,
    city: 'Sidi Bou Said',
    address: 'Rue principale, Sidi Bou Said',
    surface: 420,
    bedrooms: 6,
    bathrooms: 4,
    latitude: 36.8686,
    longitude: 10.3411,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
  },
  {
    title: 'Appartement S+2 à Menzah',
    description: 'Appartement rénové, proche des commodités',
    type: 'Appartement',
    transaction_type: 'location',
    price: 950,
    city: 'Tunis',
    address: 'Menzah 6',
    surface: 90,
    bedrooms: 2,
    bathrooms: 1,
    latitude: 36.8372,
    longitude: 10.1655,
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800'
  },
  {
    title: 'Duplex avec Terrasse à Gammarth',
    description: 'Grand duplex avec terrasse panoramique et vue mer',
    type: 'Appartement',
    transaction_type: 'vente',
    price: 680000,
    city: 'Gammarth',
    address: 'Résidence Les Pins, Gammarth',
    surface: 200,
    bedrooms: 4,
    bathrooms: 3,
    latitude: 36.9078,
    longitude: 10.3097,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
  }
];

async function seedProperties() {
  const client = await pool.connect();
  
  try {
    // Get first user ID
    const userResult = await client.query('SELECT id FROM users LIMIT 1');
    
    if (userResult.rows.length === 0) {
      console.log('❌ No users found. Please register a user first.');
      return;
    }
    
    const userId = userResult.rows[0].id;
    
    // Clear existing properties
    await client.query('DELETE FROM properties');
    console.log('🗑️  Cleared existing properties');
    
    // Insert new properties
    for (const prop of properties) {
      await client.query(
        `INSERT INTO properties 
        (user_id, title, description, type, transaction_type, price, city, address, surface, bedrooms, bathrooms, latitude, longitude, image) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          userId, prop.title, prop.description, prop.type, prop.transaction_type,
          prop.price, prop.city, prop.address, prop.surface, prop.bedrooms,
          prop.bathrooms, prop.latitude, prop.longitude, prop.image
        ]
      );
      console.log(`✅ Added: ${prop.title}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${properties.length} properties!`);
    
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedProperties();
