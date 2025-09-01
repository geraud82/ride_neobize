import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

console.log('🔍 Testing Sequelize connection to Render PostgreSQL...');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : 'undefined'}`);

// Initialize Sequelize with DATABASE_URL and SSL configuration
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // important for Render SSL
    },
  },
  logging: console.log, // Enable logging for testing
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
(async () => {
  try {
    console.log('🔄 Attempting to connect to database...');
    await sequelize.authenticate();
    console.log("✅ Connected to Render PostgreSQL successfully!");
    
    // Test a simple query
    console.log('🔄 Testing simple query...');
    const result = await sequelize.query('SELECT NOW() as current_time');
    console.log('✅ Query result:', result[0][0]);
    
    // Check if tables exist
    console.log('🔄 Checking existing tables...');
    const tables = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Existing tables:', tables[0].map(t => t.table_name));
    
  } catch (err) {
    console.error("❌ Database connection error:", err);
  } finally {
    await sequelize.close();
    console.log('🔄 Connection closed');
    process.exit(0);
  }
})();
