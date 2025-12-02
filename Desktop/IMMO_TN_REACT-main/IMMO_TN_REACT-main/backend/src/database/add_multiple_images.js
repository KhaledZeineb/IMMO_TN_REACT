const { Client } = require('pg');
require('dotenv').config();

async function addMultipleImages() {
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

    // Check if images column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='properties' AND column_name='images'
    `);

    if (checkColumn.rows.length === 0) {
      // Add images column (JSONB array)
      await client.query(`
        ALTER TABLE properties 
        ADD COLUMN images JSONB DEFAULT '[]'
      `);
      console.log('✅ Images column added to properties table');

      // Migrate existing image data to images array
      await client.query(`
        UPDATE properties 
        SET images = CASE 
          WHEN image IS NOT NULL AND image != '' THEN jsonb_build_array(image)
          ELSE '[]'::jsonb
        END
      `);
      console.log('✅ Existing images migrated to new format');

      // Optionally keep the old image column for backward compatibility
      console.log('ℹ️  Old "image" column kept for backward compatibility');
    } else {
      console.log('ℹ️  Images column already exists');
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
addMultipleImages()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
