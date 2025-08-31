import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { initializeDatabase, db } from '../database/database.js';

// Load environment variables
dotenv.config();

// Debug environment loading
console.log('🔍 Backend environment variables:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`  PORT: ${process.env.PORT || 'undefined'}`);
console.log(`  DB_HOST: ${process.env.DB_HOST || 'undefined'}`);
console.log(`  DB_NAME: ${process.env.DB_NAME || 'undefined'}`);
console.log(`  DB_USER: ${process.env.DB_USER || 'undefined'}`);
console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '[SET]' : 'undefined'}`);
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : 'undefined'}`);

const app = express();
const PORT = process.env.PORT || 3008;

// Security middleware
app.use(helmet());

// Rate limiting - more lenient for production
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // Allow more requests in production
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173'
];

// Add production frontend URL if in production
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Twilio client setup - only initialize if valid credentials are provided
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
    process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid') {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.warn('⚠️ Twilio initialization failed:', error.message);
  }
} else {
  console.log('ℹ️ Twilio not configured - using placeholder credentials');
}

// Utility function to format reservation data
function formatReservationMessage(data) {
  const lines = [
    `NEOBIZE Airport Shuttle Reservation Request`,
    ``,
    `Customer Information:`,
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    ``,
    `Trip Details:`,
    `Route: ${data.fromCity} → ${data.to}`,
    `Pickup Address: ${data.pickupAddress || 'Not specified'}`,
    `Drop-off Address: ${data.dropoffAddress || 'Not specified'}`,
    `Trip Type: ${data.direction === "oneway" ? "One-way" : "Round-trip"}`,
    `Pickup Date: ${data.date}`,
    `Pickup Time: ${data.time}`,
    `Passengers: ${data.passengers}`,
    `Luggage: ${data.luggage} bags`,
  ];

  if (data.direction === 'roundtrip') {
    lines.push(`Return Date: ${data.returnDate}`);
    lines.push(`Return Time: ${data.returnTime}`);
  }

  if (data.promo) {
    lines.push(`Promo Code: ${data.promo}`);
  }

  if (data.notes) {
    lines.push(``, `Notes: ${data.notes}`);
  }

  lines.push(``, `—————————————————————————`);
  lines.push(`Please confirm availability and provide flat-rate pricing.`);
  lines.push(``, `Submitted: ${new Date().toLocaleString()}`);

  return lines.join('\n');
}

// Email sending function for admin notifications
async function sendEmail(reservationData) {
  const message = formatReservationMessage(reservationData);
  const subject = `Reservation Request — ${reservationData.fromCity} → ${reservationData.to} — ${reservationData.date}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: subject,
    text: message,
    html: message.replace(/\n/g, '<br>'),
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Admin email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Admin email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// User confirmation email function
async function sendUserConfirmationEmail(userData, reservationData) {
  const message = `Dear ${userData.firstName} ${userData.lastName},

Thank you for your reservation request with NEOBIZE Airport Shuttle!

Your Reservation Details:
Route: ${reservationData.fromCity} → ${reservationData.to}
Pickup Address: ${reservationData.pickupAddress || 'Not specified'}
Drop-off Address: ${reservationData.dropoffAddress || 'Not specified'}
Trip Type: ${reservationData.direction === "oneway" ? "One-way" : "Round-trip"}
Pickup Date: ${reservationData.date}
Pickup Time: ${reservationData.time}
Passengers: ${reservationData.passengers}
Luggage: ${reservationData.luggage} bags${reservationData.direction === 'roundtrip' ? `
Return Date: ${reservationData.returnDate}
Return Time: ${reservationData.returnTime}` : ''}${reservationData.promo ? `
Promo Code: ${reservationData.promo}` : ''}${reservationData.notes ? `

Notes: ${reservationData.notes}` : ''}

We have received your reservation request and will review it shortly. You will receive another notification once your reservation status is updated.

Best regards,
NEOBIZE Airport Shuttle Team

This is an automated message. Please do not reply to this email.`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userData.email,
    subject: `Reservation Confirmation - ${reservationData.fromCity} to ${reservationData.to}`,
    text: message,
    html: message.replace(/\n/g, '<br>'),
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('User confirmation email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('User confirmation email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// User status update notification function
async function sendStatusUpdateNotification(userData, reservationData, newStatus) {
  const statusMessage = newStatus === 'confirmed' ? 'CONFIRMED' : 'UPDATED';
  const message = `Dear ${userData.firstName} ${userData.lastName},

Your reservation status has been ${statusMessage}!

Reservation Details:
Route: ${reservationData.fromCity} → ${reservationData.to}
Pickup Address: ${reservationData.pickupAddress || 'Not specified'}
Drop-off Address: ${reservationData.dropoffAddress || 'Not specified'}
Pickup Date: ${reservationData.date}
Pickup Time: ${reservationData.time}
Status: ${newStatus.toUpperCase()}

${newStatus === 'confirmed' ? 'Your reservation has been confirmed! We look forward to serving you.' : `Your reservation status has been updated to: ${newStatus}`}

Best regards,
NEOBIZE Airport Shuttle Team

This is an automated message. Please do not reply to this email.`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userData.email,
    subject: `Reservation ${statusMessage} - ${reservationData.fromCity} to ${reservationData.to}`,
    text: message,
    html: message.replace(/\n/g, '<br>'),
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Status update email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Status update email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// WhatsApp sending function
async function sendWhatsApp(reservationData) {
  if (!twilioClient) {
    console.log('Twilio not configured, skipping WhatsApp notification');
    return { success: false, error: 'Twilio not configured' };
  }

  const message = formatReservationMessage(reservationData);

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${process.env.TWILIO_WHATSAPP_TO}`
    });
    console.log('WhatsApp sent successfully:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp sending failed:', error);
    return { success: false, error: error.message };
  }
}

// Validation middleware
const validateReservation = (req, res, next) => {
  console.log('Received reservation data:', req.body); // Debug log
  
  const { firstName, lastName, email, phone, fromCity, to, date, time, passengers, luggage, direction, pickupAddress, dropoffAddress } = req.body;

  // Required field validation
  if (!firstName || !lastName || !email || !phone || !fromCity || !to || !date || !time || passengers === undefined || passengers === null || luggage === undefined || luggage === null || !direction) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields',
      received: { firstName, lastName, email, phone, fromCity, to, date, time, passengers, luggage, direction }
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format' 
    });
  }

  // Phone validation (more flexible)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^[\+]?[0-9]{7,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid phone number format' 
    });
  }

  // Address validation - require addresses to be present and not empty
  if (!pickupAddress || pickupAddress.trim().length < 5) {
    return res.status(400).json({ 
      success: false, 
      error: 'Pickup address is required and must be at least 5 characters long' 
    });
  }

  if (!dropoffAddress || dropoffAddress.trim().length < 5) {
    return res.status(400).json({ 
      success: false, 
      error: 'Drop-off address is required and must be at least 5 characters long' 
    });
  }

  // Passengers validation
  const passengerCount = parseInt(passengers);
  if (isNaN(passengerCount) || passengerCount < 1 || passengerCount > 7) {
    return res.status(400).json({ 
      success: false, 
      error: 'Passengers must be a number between 1 and 7' 
    });
  }

  // Luggage validation
  const luggageCount = parseInt(luggage);
  if (isNaN(luggageCount) || luggageCount < 0 || luggageCount > 10) {
    return res.status(400).json({ 
      success: false, 
      error: 'Luggage must be a number between 0 and 10' 
    });
  }

  // Round trip validation
  if (direction === 'roundtrip') {
    if (!req.body.returnDate || !req.body.returnTime) {
      return res.status(400).json({ 
        success: false, 
        error: 'Return date and time are required for round trips' 
      });
    }
  }

  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// User login endpoint (admin)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Simple authentication check
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        user: { email, role: 'admin' } 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// User lookup endpoint (for dashboard access)
app.post('/api/users/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Find user by email
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found. Please make a reservation first.' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('User lookup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Create reservation endpoint
app.post('/api/reservations', validateReservation, async (req, res) => {
  try {
    const reservationData = req.body;
    
    // Find or create user
    let user = await db.findUserByEmail(reservationData.email);
    if (!user) {
      user = await db.createUser(reservationData);
    }
    
    // Create reservation in database
    const reservation = await db.createReservation(user.id, reservationData);
    
    // Send admin notification email
    const emailResult = await sendEmail(reservationData);
    
    // Send user confirmation email
    const userEmailResult = await sendUserConfirmationEmail(reservationData, reservationData);
    
    // Send WhatsApp notification (optional)
    const whatsappResult = await sendWhatsApp(reservationData);

    console.log('Reservation created:', reservation.id);
    console.log('Email result:', emailResult);
    console.log('User email result:', userEmailResult);
    console.log('WhatsApp result:', whatsappResult);

    res.json({ 
      success: true, 
      reservationId: reservation.id,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      notifications: {
        adminEmail: emailResult.success,
        userEmail: userEmailResult.success,
        whatsapp: whatsappResult.success
      }
    });
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create reservation' 
    });
  }
});

// Get all reservations endpoint (admin)
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await db.getAllReservations();
    res.json({ 
      success: true, 
      reservations 
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reservations' 
    });
  }
});

// Get user-specific reservations endpoint
app.get('/api/users/:email/reservations', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find user by email
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Get user's reservations
    const reservations = await db.getUserReservations(user.id);
    res.json({ 
      success: true, 
      reservations 
    });
  } catch (error) {
    console.error('Get user reservations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user reservations' 
    });
  }
});

// Update reservation status endpoint (admin)
app.put('/api/reservations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status is required' 
      });
    }

    // Get reservation details before updating
    const reservation = await db.getReservationById(id);
    if (!reservation) {
      return res.status(404).json({ 
        success: false, 
        error: 'Reservation not found' 
      });
    }

    // Update reservation status
    await db.updateReservationStatus(id, status);

    // Send status update notification to user
    const statusUpdateResult = await sendStatusUpdateNotification(
      {
        firstName: reservation.first_name,
        lastName: reservation.last_name,
        email: reservation.email
      },
      {
        fromCity: reservation.from_city,
        to: reservation.to_city,
        pickupAddress: reservation.pickup_address,
        dropoffAddress: reservation.dropoff_address,
        date: reservation.pickup_date,
        time: reservation.pickup_time
      },
      status
    );

    console.log('Status update notification result:', statusUpdateResult);

    res.json({ 
      success: true, 
      message: 'Reservation status updated successfully',
      notification: statusUpdateResult.success
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update reservation status' 
    });
  }
});

// Delete reservation endpoint (admin)
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteReservation(id);
    res.json({ 
      success: true, 
      message: 'Reservation deleted successfully' 
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete reservation' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📧 Email configured: ${process.env.EMAIL_HOST ? 'Yes' : 'No'}`);
      console.log(`📱 WhatsApp configured: ${twilioClient ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
