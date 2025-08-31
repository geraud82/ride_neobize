# NEOBIZE Shuttle Database Setup Script for Windows
# This script helps set up PostgreSQL database for local development

Write-Host "🚀 NEOBIZE Shuttle Database Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "Make sure to add PostgreSQL bin directory to your PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL found at: $($psqlPath.Source)" -ForegroundColor Green

# Database configuration
$DB_NAME = "ride_neobize"
$DB_USER = "postgres"
$DB_PASSWORD = "Benaeli1982@"

Write-Host "📋 Database Configuration:" -ForegroundColor Cyan
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  User: $DB_USER" -ForegroundColor White
Write-Host "  Password: [HIDDEN]" -ForegroundColor White

# Set PGPASSWORD environment variable to avoid password prompt
$env:PGPASSWORD = $DB_PASSWORD

Write-Host "🔄 Creating database..." -ForegroundColor Yellow

try {
    # Try to create the database
    $createDbResult = psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database '$DB_NAME' created successfully!" -ForegroundColor Green
    } else {
        # Check if database already exists
        if ($createDbResult -match "already exists") {
            Write-Host "ℹ️ Database '$DB_NAME' already exists" -ForegroundColor Blue
        } else {
            Write-Host "❌ Failed to create database: $createDbResult" -ForegroundColor Red
            Write-Host "Please check your PostgreSQL installation and credentials" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Test connection to the database
    Write-Host "🔄 Testing database connection..." -ForegroundColor Yellow
    $testResult = psql -U $DB_USER -h localhost -d $DB_NAME -c "SELECT version();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection successful!" -ForegroundColor Green
        Write-Host "🎉 Database setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Run 'cd backend && npm run dev' to start the backend server" -ForegroundColor White
        Write-Host "2. The application will automatically create the required tables" -ForegroundColor White
    } else {
        Write-Host "❌ Database connection failed: $testResult" -ForegroundColor Red
        Write-Host "Please check your PostgreSQL service and credentials" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error during database setup: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clear the password environment variable
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
Write-Host "- Make sure PostgreSQL service is running" -ForegroundColor White
Write-Host "- Check if the password 'Benaeli1982@' is correct for postgres user" -ForegroundColor White
Write-Host "- You can change the password in backend/.env file" -ForegroundColor White
Write-Host "- Run 'services.msc' and start 'postgresql-x64-xx' service if needed" -ForegroundColor White
