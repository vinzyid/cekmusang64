import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

// Clean the DATABASE_URL (remove quotes if any)
const dbUrl = process.env.DATABASE_URL?.replace(/"/g, '');

if (!dbUrl) {
  console.error("Missing DATABASE_URL in environment variables.");
  process.exit(1);
}

const connectionString = dbUrl;

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Connected! Reading migration files...');
    
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Executing migration: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('COMMIT');
          console.log(`✅ Success: ${file}`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`❌ Failed to execute ${file}:`, err.message);
          throw err;
        }
      }
    }
    
    console.log('\n✅ All migrations executed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

main();
