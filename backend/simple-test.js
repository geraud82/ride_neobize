// Simple test to verify Sequelize connection
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

// Try both postgres:// and postgresql:// formats
const databaseUrl = process.env.DATABASE_URL;
const postgresqlUrl = databaseUrl ? databaseUrl.replace('postgres://', 'postgresql://') : null;

console.log('Original URL format:', databaseUrl ? databaseUrl.substring(0, 20) + '...' : 'undefined');
console.log('PostgreSQL URL format:', postgresqlUrl ? postgresqlUrl.substring(0, 20) + '...' : 'undefined');

async function testConnection(url, label) {
  if (!url) {
    console.log(`❌ ${label}: No URL provided`);
    return false;
  }

  const sequelize = new Sequelize(url, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: { max: 1, min: 0, acquire: 5000, idle: 1000 }
  });

  try {
    console.log(`🔄 Testing ${label}...`);
    await sequelize.authenticate();
    console.log(`✅ ${label}: Connection successful!`);
    await sequelize.close();
    return true;
  } catch (error) {
    console.log(`❌ ${label}: Connection failed -`, error.message);
    await sequelize.close();
    return false;
  }
}

(async () => {
  console.log('🚀 Starting connection tests...\n');
  
  const test1 = await testConnection(databaseUrl, 'Original URL (postgres://)');
  const test2 = await testConnection(postgresqlUrl, 'Modified URL (postgresql://)');
  
  console.log('\n📊 Test Results:');
  console.log(`Original format: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`PostgreSQL format: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  
  if (test1 || test2) {
    console.log('\n🎉 At least one connection format works!');
  } else {
    console.log('\n💥 Both connection formats failed. Check your DATABASE_URL.');
  }
  
  process.exit(0);
})();
