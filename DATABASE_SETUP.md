# 🗄️ Database Setup Guide

This guide will help you set up PostgreSQL for the NEOBIZE Shuttle Reservation system.

## 🚀 Quick Setup (Windows)

Run the automated setup script:

```powershell
.\setup-database.ps1
```

This script will:
- Check if PostgreSQL is installed
- Create the `ride_neobize` database
- Test the database connection
- Provide troubleshooting tips

## 📋 Manual Setup

### 1. Install PostgreSQL

Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

**Important**: During installation, remember the password you set for the `postgres` user.

### 2. Update Environment Variables

Edit `backend/.env` and update the database password:

```env
DB_PASSWORD=your_actual_postgres_password
```

### 3. Create Database

Option A - Using pgAdmin:
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `ride_neobize`
5. Click "Save"

Option B - Using Command Line:
```bash
psql -U postgres -c "CREATE DATABASE ride_neobize;"
```

Option C - Using SQL Script:
```bash
psql -U postgres -f setup-database.sql
```

## 🔧 Configuration

The application uses these database settings from `backend/.env`:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ride_neobize
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ride_neobize
DB_USER=postgres
DB_PASSWORD=your_password
```

## 🏗️ Schema Creation

The application automatically creates all required tables when it starts:

- `users` - Customer information
- `reservations` - Booking details

You don't need to create these manually.

## ✅ Testing the Setup

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Look for these success messages:
   ```
   ✅ Connected to PostgreSQL database
   ✅ Database schema initialized successfully
   🚀 Server running on port 3008
   ```

## 🔍 Troubleshooting

### "password authentication failed"

**Problem**: The password in `.env` doesn't match your PostgreSQL password.

**Solution**: 
1. Update `DB_PASSWORD` in `backend/.env`
2. Or reset your PostgreSQL password:
   ```sql
   ALTER USER postgres PASSWORD 'new_password';
   ```

### "database does not exist"

**Problem**: The `ride_neobize` database hasn't been created.

**Solution**: Run the setup script or create manually:
```bash
psql -U postgres -c "CREATE DATABASE ride_neobize;"
```

### "connection refused"

**Problem**: PostgreSQL service is not running.

**Solution**:
1. Press `Win + R`, type `services.msc`
2. Find "postgresql-x64-xx" service
3. Right-click → "Start"

### "psql: command not found"

**Problem**: PostgreSQL bin directory is not in PATH.

**Solution**:
1. Find your PostgreSQL installation (usually `C:\Program Files\PostgreSQL\xx\bin`)
2. Add this path to your system PATH environment variable
3. Restart your terminal

## 🌐 Production Database

For production deployment, the application supports:

- **Render PostgreSQL**: Automatically configured via `DATABASE_URL`
- **Other cloud providers**: Update `DATABASE_URL` in environment variables

The application will automatically use SSL connections in production.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
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
);
```

## 🔒 Security Notes

- Never commit your actual database password to version control
- Use strong passwords for production databases
- Enable SSL for production database connections
- Regularly backup your database

## 📞 Need Help?

If you're still having issues:

1. Check the main `README.md` for general setup instructions
2. Review the error messages carefully
3. Ensure PostgreSQL service is running
4. Verify your database credentials

---

**Next Step**: Once your database is set up, run `cd backend && npm run dev` to start the application!
