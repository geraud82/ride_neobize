import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config({ path: './backend/.env' });

const { Pool } = pg;

console.log('🔍 Testing Database Connection');
console.log('==============================');

// Show loaded environment variables
console.log('Environment variables:');
console.log(`  DB_HOST: ${process.env.DB_HOST || 'undefined'}`);
console.log(`  DB_PORT: ${process.env.DB_PORT || 'undefined'}`);
console.log(`  DB_NAME: ${process.env.DB_NAME || 'undefined'}`);
console.log(`  DB_USER: ${process.env.DB_USER || 'undefined'}`);
console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '[SET]' : 'undefined'}`);
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : 'undefined'}`);

// Create database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'ride_neobize',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};

console.log('\nDatabase configuration:');
console.log(`  Host: ${dbConfig.host}`);
console.log(`  Port: ${dbConfig.port}`);
console.log(`  Database: ${dbConfig.database}`);
console.log(`  User: ${dbConfig.user}`);
console.log(`  Password: ${dbConfig.password ? '[SET]' : 'undefined'}`);

// Test connection
const pool = new Pool(dbConfig);

async function testConnection() {
  try {
    console.log('\n🔄 Testing connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('✅ Query successful!');
    console.log(`PostgreSQL version: ${result.rows[0].version}`);
    
    client.release();
    
    // Test database existence
    const dbResult = await pool.query('SELECT current_database()');
    console.log(`✅ Connected to database: ${dbResult.rows[0].current_database}`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
    
    if (error.code === '28P01') {
      console.log('\n💡 This is a password authentication error. Try:');
      console.log('1. Check if the password in backend/.env is correct');
      console.log('2. Reset PostgreSQL password: ALTER USER postgres PASSWORD \'new_password\';');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist. Try:');
      console.log('1. Run: psql -U postgres -c "CREATE DATABASE ride_neobize;"');
      console.log('2. Or run the setup script: .\\setup-database.ps1');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 PostgreSQL service is not running. Try:');
      console.log('1. Start PostgreSQL service in Windows Services');
      console.log('2. Or restart PostgreSQL');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
