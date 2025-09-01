import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - try multiple paths
const envPaths = [
  path.join(__dirname, '.env'),
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
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : 'undefined'}`);

// Initialize Sequelize with DATABASE_URL and SSL configuration
let databaseUrl = process.env.DATABASE_URL;

// Ensure the URL uses postgresql:// format for better compatibility
if (databaseUrl && databaseUrl.startsWith('postgres://')) {
  databaseUrl = databaseUrl.replace('postgres://', 'postgresql://');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // important for Render SSL
    },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Render PostgreSQL");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

// Define User model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'last_name'
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: Sequelize.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define Reservation model
const Reservation = sequelize.define('Reservation', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  fromCity: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'from_city'
  },
  toCity: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'to_city'
  },
  pickupAddress: {
    type: Sequelize.TEXT,
    field: 'pickup_address'
  },
  dropoffAddress: {
    type: Sequelize.TEXT,
    field: 'dropoff_address'
  },
  direction: {
    type: Sequelize.ENUM('oneway', 'roundtrip'),
    allowNull: false
  },
  pickupDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    field: 'pickup_date'
  },
  pickupTime: {
    type: Sequelize.TIME,
    allowNull: false,
    field: 'pickup_time'
  },
  returnDate: {
    type: Sequelize.DATEONLY,
    field: 'return_date'
  },
  returnTime: {
    type: Sequelize.TIME,
    field: 'return_time'
  },
  passengers: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 7
    }
  },
  luggage: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  promoCode: {
    type: Sequelize.STRING(50),
    field: 'promo_code'
  },
  notes: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'reservations',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
User.hasMany(Reservation, { foreignKey: 'user_id', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Database initialization function
export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing Sequelize database schema...');
    
    // Sync models with database (create tables if they don't exist)
    await sequelize.sync({ alter: false }); // Use alter: true only in development
    
    console.log('✅ Sequelize database schema initialized successfully');
    
  } catch (error) {
    console.error('❌ Sequelize database initialization failed:', error);
    throw error;
  }
}

// Database query functions using Sequelize
export const db = {
  // Direct Sequelize instance access
  sequelize,
  User,
  Reservation,
  
  // User functions
  async findUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase() }
      });
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        phone: userData.phone
      });
      return user.toJSON();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  // Reservation functions
  async createReservation(userId, reservationData) {
    try {
      const reservation = await Reservation.create({
        userId: userId,
        fromCity: reservationData.fromCity,
        toCity: reservationData.to,
        pickupAddress: reservationData.pickupAddress || null,
        dropoffAddress: reservationData.dropoffAddress || null,
        direction: reservationData.direction,
        pickupDate: reservationData.date,
        pickupTime: reservationData.time,
        returnDate: reservationData.returnDate || null,
        returnTime: reservationData.returnTime || null,
        passengers: reservationData.passengers,
        luggage: reservationData.luggage,
        promoCode: reservationData.promo || null,
        notes: reservationData.notes || null
      });
      return reservation.toJSON();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async getUserReservations(userId) {
    try {
      const reservations = await Reservation.findAll({
        where: { userId: userId },
        order: [['created_at', 'DESC']]
      });
      return reservations.map(r => r.toJSON());
    } catch (error) {
      console.error('Error getting user reservations:', error);
      throw error;
    }
  },

  async updateReservationStatus(reservationId, status) {
    try {
      const [updatedRowsCount] = await Reservation.update(
        { status: status },
        { where: { id: reservationId } }
      );
      
      if (updatedRowsCount > 0) {
        const reservation = await Reservation.findByPk(reservationId);
        return reservation ? reservation.toJSON() : null;
      }
      return null;
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  },

  async getAllUsersWithReservations() {
    try {
      const users = await User.findAll({
        include: [{
          model: Reservation,
          as: 'reservations',
          required: false
        }],
        order: [['created_at', 'DESC']]
      });
      
      return users.map(user => {
        const userData = user.toJSON();
        return {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          reservations: userData.reservations || []
        };
      });
    } catch (error) {
      console.error('Error getting all users with reservations:', error);
      throw error;
    }
  },

  async getReservationById(reservationId) {
    try {
      const reservation = await Reservation.findByPk(reservationId, {
        include: [{
          model: User,
          as: 'user'
        }]
      });
      return reservation ? reservation.toJSON() : null;
    } catch (error) {
      console.error('Error getting reservation by ID:', error);
      throw error;
    }
  },

  async getAllReservations() {
    try {
      const reservations = await Reservation.findAll({
        include: [{
          model: User,
          as: 'user'
        }],
        order: [['created_at', 'DESC']]
      });
      
      return reservations.map(reservation => {
        const data = reservation.toJSON();
        return {
          ...data,
          first_name: data.user.firstName,
          last_name: data.user.lastName,
          email: data.user.email,
          phone: data.user.phone
        };
      });
    } catch (error) {
      console.error('Error getting all reservations:', error);
      throw error;
    }
  },

  async deleteReservation(reservationId) {
    try {
      const reservation = await Reservation.findByPk(reservationId);
      if (reservation) {
        await reservation.destroy();
        return reservation.toJSON();
      }
      return null;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Closing Sequelize database connections...');
  await sequelize.close();
  console.log('✅ Sequelize database connections closed');
  process.exit(0);
});

export default sequelize;
