import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - try multiple paths
const envPaths = [
  path.join(__dirname, '../backend/.env'),
  path.join(process.cwd(), 'backend/.env'),
  path.join(process.cwd(), '.env'),
  '.env'
];

console.log('🔍 Trying to load environment variables from:');
for (const envPath of envPaths) {
  console.log(`  - ${envPath}`);
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`✅ Successfully loaded from: ${envPath}`);
    break;
  } else {
    console.log(`❌ Failed to load from: ${envPath} - ${result.error.message}`);
  }
}

// Debug environment variables
console.log('🔍 Environment variables loaded:');
console.log(`  DB_HOST: ${process.env.DB_HOST || 'undefined'}`);
console.log(`  DB_PORT: ${process.env.DB_PORT || 'undefined'}`);
console.log(`  DB_NAME: ${process.env.DB_NAME || 'undefined'}`);
console.log(`  DB_USER: ${process.env.DB_USER || 'undefined'}`);
console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '[SET]' : 'undefined'}`);
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : 'undefined'}`);

const { Pool } = pg;

// Database connection configuration
let dbConfig;

// For development, use individual connection parameters for better debugging
if (process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL) {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'neobize_shuttle',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    ssl: false,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
} else {
  // Use DATABASE_URL for production (cloud deployments like Render)
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Longer timeout for cloud databases
  };
}

// Debug database configuration (without showing password)
console.log('🔧 Database configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  passwordSet: !!dbConfig.password
});

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

// Database initialization function
export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reservations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        from_city VARCHAR(100) NOT NULL,
        to_city VARCHAR(100) NOT NULL,
        pickup_address TEXT,
        dropoff_address TEXT,
        direction VARCHAR(20) NOT NULL CHECK (direction IN ('oneway', 'roundtrip')),
        pickup_date DATE NOT NULL,
        pickup_time TIME NOT NULL,
        return_date DATE,
        return_time TIME,
        passengers INTEGER NOT NULL CHECK (passengers >= 1 AND passengers <= 7),
        luggage INTEGER NOT NULL DEFAULT 0 CHECK (luggage >= 0 AND luggage <= 10),
        promo_code VARCHAR(50),
        notes TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add address columns if they don't exist (for existing databases)
    await pool.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS pickup_address TEXT,
      ADD COLUMN IF NOT EXISTS dropoff_address TEXT
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
      CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
      CREATE INDEX IF NOT EXISTS idx_reservations_pickup_date ON reservations(pickup_date);
    `);

    // Create updated_at trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updated_at columns
    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
      CREATE TRIGGER update_reservations_updated_at
        BEFORE UPDATE ON reservations
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Database schema initialized successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Database query functions
export const db = {
  // Generic query function
  query: (text, params) => pool.query(text, params),
  
  // User functions
  async findUserByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  async createUser(userData) {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userData.firstName, userData.lastName, userData.email.toLowerCase(), userData.phone]
    );
    return result.rows[0];
  },

  async getUserById(userId) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  // Reservation functions
  async createReservation(userId, reservationData) {
    const result = await pool.query(
      `INSERT INTO reservations (
        user_id, from_city, to_city, pickup_address, dropoff_address, direction, pickup_date, pickup_time,
        return_date, return_time, passengers, luggage, promo_code, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        userId,
        reservationData.fromCity,
        reservationData.to,
        reservationData.pickupAddress || null,
        reservationData.dropoffAddress || null,
        reservationData.direction,
        reservationData.date,
        reservationData.time,
        reservationData.returnDate || null,
        reservationData.returnTime || null,
        reservationData.passengers,
        reservationData.luggage,
        reservationData.promo || null,
        reservationData.notes || null
      ]
    );
    return result.rows[0];
  },

  async getUserReservations(userId) {
    const result = await pool.query(
      `SELECT * FROM reservations 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async updateReservationStatus(reservationId, status) {
    const result = await pool.query(
      `UPDATE reservations 
       SET status = $1 
       WHERE id = $2 
       RETURNING *`,
      [status, reservationId]
    );
    return result.rows[0] || null;
  },

  async getAllUsersWithReservations() {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.created_at,
        u.updated_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', r.id,
              'fromCity', r.from_city,
              'to', r.to_city,
              'direction', r.direction,
              'date', r.pickup_date,
              'time', r.pickup_time,
              'returnDate', r.return_date,
              'returnTime', r.return_time,
              'passengers', r.passengers,
              'luggage', r.luggage,
              'promo', r.promo_code,
              'notes', r.notes,
              'status', r.status,
              'createdAt', r.created_at,
              'updatedAt', r.updated_at
            ) ORDER BY r.created_at DESC
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'::json
        ) as reservations
      FROM users u
      LEFT JOIN reservations r ON u.id = r.user_id
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at, u.updated_at
      ORDER BY u.created_at DESC
    `);
    
    return result.rows.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      reservations: row.reservations
    }));
  },

  async getReservationById(reservationId) {
    const result = await pool.query(
      'SELECT * FROM reservations WHERE id = $1',
      [reservationId]
    );
    return result.rows[0] || null;
  },

  async getAllReservations() {
    const result = await pool.query(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    return result.rows;
  },

  async deleteReservation(reservationId) {
    const result = await pool.query(
      'DELETE FROM reservations WHERE id = $1 RETURNING *',
      [reservationId]
    );
    return result.rows[0] || null;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Closing database connections...');
  await pool.end();
  console.log('✅ Database connections closed');
  process.exit(0);
});

export default pool;
