const { Client } = require('pg');
require('dotenv').config();

async function addRoleColumn() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'immo_tn',
    port: process.env.DB_PORT || 5432
  });
  
  try {
    await client.connect();
    console.log('📡 Connected to database');

    // Check if role column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role'
    `);

    if (checkColumn.rows.length === 0) {
      // Add role column with default value 'buyer'
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('visitor', 'buyer', 'seller'))
      `);
      console.log('✅ Role column added to users table');

      // Update existing users to 'buyer' if they have properties, otherwise 'visitor'
      await client.query(`
        UPDATE users 
        SET role = CASE 
          WHEN id IN (SELECT DISTINCT user_id FROM properties) THEN 'seller'
          ELSE 'buyer'
        END
      `);
      console.log('✅ Existing users updated with appropriate roles');
    } else {
      console.log('ℹ️  Role column already exists');
    }

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
addRoleColumn()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
