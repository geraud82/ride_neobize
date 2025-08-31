# NEOBIZE Airport Shuttle Backend

A Node.js/Express backend API for handling reservation requests and automatically sending them via email and WhatsApp.

## Features

- ✅ RESTful API for reservation submissions
- 📧 Automatic email notifications via SMTP
- 📱 WhatsApp messaging via Twilio API
- 🔒 Security middleware (Helmet, CORS, Rate limiting)
- ✨ Input validation and error handling
- 🚀 Concurrent email/WhatsApp sending

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=contact@neobize.com

# Twilio Configuration for WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO=whatsapp:+13097990907

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3005
```

### 3. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASS`

### 4. WhatsApp Setup (Twilio)

1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Set up WhatsApp Sandbox:
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow the instructions to connect your WhatsApp number
   - Use the sandbox number as `TWILIO_WHATSAPP_FROM`

### 5. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Submit Reservation
```
POST /api/reservations
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "(309) 555-0123",
  "fromCity": "Moline",
  "to": "O'Hare",
  "direction": "oneway",
  "date": "2024-01-15",
  "time": "10:00",
  "passengers": 2,
  "luggage": 1,
  "promo": "",
  "notes": "Flight AA123"
}
```

## Security Features

- **Rate Limiting**: 10 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain only
- **Helmet**: Security headers
- **Input Validation**: Server-side validation for all fields

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["First name is required", "Valid email is required"]
}
```

## Logging

The server logs all reservation requests and email/WhatsApp sending results to the console.

## Deployment Notes

1. Set `NODE_ENV=production` in production
2. Use a process manager like PM2
3. Set up proper logging (consider Winston)
4. Use environment variables for all sensitive data
5. Consider using a proper database for storing reservations

## Troubleshooting

### Email Issues
- Verify Gmail App Password is correct
- Check that 2FA is enabled on Gmail
- Ensure `EMAIL_HOST` and `EMAIL_PORT` are correct

### WhatsApp Issues
- Verify Twilio credentials
- Check WhatsApp sandbox setup
- Ensure phone numbers are in correct format

### CORS Issues
- Verify `FRONTEND_URL` matches your frontend domain
- Check that frontend is making requests to correct backend URL
