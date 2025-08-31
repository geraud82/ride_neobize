-- NEOBIZE Shuttle Database Setup Script
-- Run this script to create the database and user

-- Connect to PostgreSQL as superuser and run these commands:

-- Create database
CREATE DATABASE ride_neobize;

-- Create user (if it doesn't exist)
-- Note: You may need to adjust the password
-- CREATE USER postgres WITH PASSWORD 'Benaeli1982@';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ride_neobize TO postgres;

-- Connect to the ride_neobize database
\c ride_neobize;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- The application will create the tables automatically when it starts
