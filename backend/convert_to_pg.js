// Helper to convert MySQL queries to PostgreSQL
// PostgreSQL uses $1, $2, $3 instead of ?
// PostgreSQL returns rows directly, not [rows, fields]

const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src', 'controllers');

const files = fs.readdirSync(controllersDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert [result] to result
    content = content.replace(/const \[(\w+)\] = await db\.query/g, 'const $1 = await db.query');
    
    // Replace ? with $1, $2, $3, etc.
    let counter = 0;
    content = content.replace(/db\.query\([^)]+\)/g, (match) => {
      counter = 0;
      return match.replace(/\?/g, () => `$${++counter}`);
    });
    
    // Fix result.insertId to result.rows[0].id
    content = content.replace(/result\.insertId/g, 'result.rows[0].id');
    
    // Fix array checks
    content = content.replace(/(\w+)\.length > 0/g, '$1.rows && $1.rows.length > 0');
    content = content.replace(/(\w+)\.length === 0/g, '!$1.rows || $1.rows.length === 0');
    
    // Fix array access
    content = content.replace(/const (\w+) = (\w+)\[0\];/g, 'const $1 = $2.rows[0];');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Converted ${file}`);
  }
});

console.log('🎉 All controllers converted to PostgreSQL!');
