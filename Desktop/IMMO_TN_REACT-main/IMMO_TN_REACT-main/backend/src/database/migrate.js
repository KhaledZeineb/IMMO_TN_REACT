const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres',
    port: process.env.DB_PORT || 5432
  });
  
  let dbClient;
  
  try {
    await client.connect();
    console.log('📡 Connected to PostgreSQL server');

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'immo_tn';
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
    );
    
    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database ${dbName} created`);
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }
    
    await client.end();
    
    // Connect to the database
    dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      port: process.env.DB_PORT || 5432
    });
    
    await dbClient.connect();

    // Create users table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        photo TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create properties table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address VARCHAR(255),
        surface DECIMAL(10, 2),
        bedrooms INT,
        bathrooms INT,
        image TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Properties table created');

    // Create messages table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Messages table created');

    // Create favorites table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        property_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        UNIQUE (user_id, property_id)
      )
    `);
    console.log('✅ Favorites table created');

    // Create notifications table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        data JSONB,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Notifications table created');

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

// Run migration
migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
