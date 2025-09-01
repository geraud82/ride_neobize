import { db } from './backend/sequelize-database.js';

async function testDatabaseDates() {
  try {
    console.log('🔍 Testing database dates...');
    
    // Test direct query to see raw data
    const rawUsers = await db.sequelize.query(
      'SELECT id, first_name, last_name, email, created_at, updated_at FROM users LIMIT 3',
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    console.log('\n📊 Raw users data from database:');
    rawUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        created_at_type: typeof user.created_at,
        updated_at_type: typeof user.updated_at
      });
    });

    // Test direct query for reservations
    const rawReservations = await db.sequelize.query(
      'SELECT id, from_city, to_city, created_at, updated_at FROM reservations LIMIT 3',
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    console.log('\n📊 Raw reservations data from database:');
    rawReservations.forEach((reservation, index) => {
      console.log(`Reservation ${index + 1}:`, {
        id: reservation.id,
        route: `${reservation.from_city} → ${reservation.to_city}`,
        created_at: reservation.created_at,
        updated_at: reservation.updated_at,
        created_at_type: typeof reservation.created_at,
        updated_at_type: typeof reservation.updated_at
      });
    });

    // Test Sequelize model query
    console.log('\n🔍 Testing Sequelize model queries...');
    const users = await db.User.findAll({ limit: 2 });
    console.log('Users via Sequelize:');
    users.forEach((user, index) => {
      const userData = user.toJSON();
      console.log(`User ${index + 1}:`, {
        id: userData.id,
        name: `${userData.firstName} ${userData.lastName}`,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        createdAt_type: typeof userData.createdAt,
        updatedAt_type: typeof userData.updatedAt
      });
    });

    // Test the actual function used by the API
    console.log('\n🔍 Testing getAllUsersWithReservations function...');
    const apiData = await db.getAllUsersWithReservations();
    console.log('API data sample:');
    if (apiData.length > 0) {
      const firstUser = apiData[0];
      console.log('First user:', {
        id: firstUser.id,
        name: `${firstUser.firstName} ${firstUser.lastName}`,
        createdAt: firstUser.createdAt,
        updatedAt: firstUser.updatedAt,
        createdAt_type: typeof firstUser.createdAt,
        updatedAt_type: typeof firstUser.updatedAt,
        reservations_count: firstUser.reservations.length
      });
      
      if (firstUser.reservations.length > 0) {
        const firstReservation = firstUser.reservations[0];
        console.log('First reservation:', {
          id: firstReservation.id,
          route: `${firstReservation.fromCity} → ${firstReservation.to}`,
          createdAt: firstReservation.createdAt,
          updatedAt: firstReservation.updatedAt,
          createdAt_type: typeof firstReservation.createdAt,
          updatedAt_type: typeof firstReservation.updatedAt
        });
      }
    }

  } catch (error) {
    console.error('❌ Error testing database dates:', error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

testDatabaseDates();
