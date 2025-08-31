# PostgreSQL Setup Guide for NEOBIZE Shuttle Backend

This guide will help you set up PostgreSQL for the NEOBIZE Shuttle reservation system.

## Prerequisites

- PostgreSQL installed on your system
- Node.js and npm installed
- Access to create databases and users

## Installation Steps

### 1. Install PostgreSQL

#### Windows:
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the password you set for the `postgres` user

#### macOS:
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

Connect to PostgreSQL as the postgres user:

```bash
# Windows/Linux
psql -U postgres

# macOS (if using Homebrew)
psql postgres
```

Create the database and user:

```sql
-- Create database
CREATE DATABASE neobize_shuttle;

-- Create user (optional - you can use postgres user)
CREATE USER neobize_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE neobize_shuttle TO neobize_user;

-- Connect to the database
\c neobize_shuttle;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO neobize_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neobize_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neobize_user;

-- Exit psql
\q
```

### 3. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Update your `.env` file with your PostgreSQL configuration:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://neobize_user:your_secure_password@localhost:5432/neobize_shuttle
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neobize_shuttle
DB_USER=neobize_user
DB_PASSWORD=your_secure_password
```

**Alternative using postgres user:**
```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/neobize_shuttle
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neobize_shuttle
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### 4. Install Dependencies

Make sure you have installed the PostgreSQL dependencies:

```bash
npm install pg @types/pg
```

### 5. Test the Connection

Start the server to test the database connection:

```bash
npm run dev
```

You should see messages like:
```
✅ Connected to PostgreSQL database
🔄 Initializing database schema...
✅ Database schema initialized successfully
🚀 NEOBIZE Shuttle Backend running on port 3007
🗄️ PostgreSQL database connected and initialized
```

## Database Schema

The application will automatically create the following tables:

### Users Table
- `id` (UUID, Primary Key)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `phone` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Reservations Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `from_city` (VARCHAR)
- `to_city` (VARCHAR)
- `direction` (VARCHAR: 'oneway' or 'roundtrip')
- `pickup_date` (DATE)
- `pickup_time` (TIME)
- `return_date` (DATE, nullable)
- `return_time` (TIME, nullable)
- `passengers` (INTEGER)
- `luggage` (INTEGER)
- `promo_code` (VARCHAR, nullable)
- `notes` (TEXT, nullable)
- `status` (VARCHAR: 'pending', 'confirmed', 'completed', 'cancelled')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

### Connection Issues

1. **"Connection refused"**: Make sure PostgreSQL is running
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgresql  # macOS
   ```

2. **"Authentication failed"**: Check your username and password in `.env`

3. **"Database does not exist"**: Make sure you created the database as shown in step 2

4. **"Permission denied"**: Make sure your user has the correct privileges

### Common Commands

```bash
# Connect to database
psql -U neobize_user -d neobize_shuttle

# List databases
\l

# List tables
\dt

# Describe table structure
\d users
\d reservations

# View data
SELECT * FROM users;
SELECT * FROM reservations;

# Exit psql
\q
```

### Reset Database

If you need to reset the database:

```sql
-- Connect as postgres user
psql -U postgres

-- Drop and recreate database
DROP DATABASE IF EXISTS neobize_shuttle;
CREATE DATABASE neobize_shuttle;

-- Reconnect and restart your application
```

## Migration from In-Memory Storage

The application has been updated to use PostgreSQL instead of in-memory storage. All existing functionality remains the same, but data will now persist between server restarts.

Key changes:
- User accounts and reservations are stored in PostgreSQL
- Automatic database schema creation on startup
- Data validation at the database level
- Improved data integrity with foreign key constraints
- Better performance for larger datasets

## Production Considerations

For production deployment:

1. Use environment variables for all database credentials
2. Enable SSL connections
3. Set up database backups
4. Configure connection pooling appropriately
5. Monitor database performance
6. Use a dedicated database server

Example production configuration:
```env
DATABASE_URL=postgresql://username:password@your-db-host:5432/neobize_shuttle?sslmode=require
