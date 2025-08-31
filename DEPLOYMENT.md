# 🚀 NEOBIZE Shuttle Reservation - Deployment Guide

This guide provides step-by-step instructions for deploying the NEOBIZE Shuttle Reservation system to production using Vercel (frontend), Render (backend), and a cloud PostgreSQL database.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Gmail account with App Password enabled
- Twilio account with WhatsApp Business API (optional)

## 🗄️ Database Setup (Render PostgreSQL)

### 1. Create Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `neobize-shuttle-db`
   - **Database**: `neobize_shuttle`
   - **User**: `neobize_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click "Create Database"
5. **Save the connection details** - you'll need the `External Database URL`

### 2. Database Security

- The database will be automatically secured with SSL
- Connection string will include SSL parameters
- Access is restricted to your Render services by default

## 🖥️ Backend Deployment (Render)

### 1. Prepare Repository

Ensure your code is pushed to GitHub with all the deployment files we created.

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `neobize-shuttle-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for production)

### 3. Environment Variables

Add these environment variables in Render:

```bash
# Server Configuration
NODE_ENV=production
PORT=10000

# Database (will be auto-populated if using Render PostgreSQL)
DATABASE_URL=[Auto-populated from database connection]

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-production-email@gmail.com
EMAIL_TO=contact@neobize.com
EMAIL_SECURE=false
EMAIL_TLS=true

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_production_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
WHATSAPP_TO=whatsapp:+1234567890

# Security
JWT_SECRET=[Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"]
SESSION_SECRET=[Generate a strong random string]

# Admin Access
ADMIN_EMAIL=admin@neobize.com
ADMIN_PASSWORD=your_secure_admin_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (will be updated after frontend deployment)
FRONTEND_URL=https://your-app-name.vercel.app
```

### 4. Connect Database

1. In your web service settings, go to "Environment"
2. Add environment variable: `DATABASE_URL`
3. Select "From Database" and choose your PostgreSQL database
4. This will automatically populate the connection string

## 🌐 Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Environment Variables

Add these environment variables in Vercel:

```bash
# Backend API URL (your Render backend)
VITE_API_URL=https://your-backend-app.onrender.com

# Application Configuration
VITE_APP_NAME=NEOBIZE Shuttle Reservation
VITE_APP_VERSION=1.0.0
```

### 3. Update Backend CORS

After frontend deployment:
1. Copy your Vercel app URL (e.g., `https://your-app-name.vercel.app`)
2. Update the `FRONTEND_URL` environment variable in your Render backend
3. Redeploy the backend service

## 🔐 Security Configuration

### 1. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this 16-character password as `EMAIL_PASS`

### 2. Twilio WhatsApp Setup (Optional)

1. Create a [Twilio account](https://www.twilio.com/)
2. Set up WhatsApp Business API
3. Get your Account SID and Auth Token
4. Verify your WhatsApp phone numbers

### 3. Generate Secure Secrets

Run these commands locally to generate secure secrets:

```bash
# JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Session Secret
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

## 🔄 Deployment Process

### 1. Initial Deployment Order

1. **Database First**: Deploy PostgreSQL on Render
2. **Backend Second**: Deploy backend with database connection
3. **Frontend Last**: Deploy frontend with backend API URL

### 2. Environment Variable Updates

After each deployment, update the dependent services:

1. **After Backend Deployment**: Update frontend `VITE_API_URL`
2. **After Frontend Deployment**: Update backend `FRONTEND_URL`

## 🧪 Testing Production Deployment

### 1. Health Check

Test your backend health endpoint:
```bash
curl https://your-backend-app.onrender.com/api/health
```

### 2. Frontend Connectivity

1. Visit your Vercel app URL
2. Try making a test reservation
3. Check that emails are sent correctly
4. Verify database entries in Render dashboard

### 3. Admin Dashboard

1. Navigate to `/admin` on your frontend
2. Login with your admin credentials
3. Verify you can see and manage reservations

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
2. **Database Connection**: Check `DATABASE_URL` format and SSL settings
3. **Email Issues**: Verify Gmail App Password and SMTP settings
4. **Build Failures**: Check Node.js version compatibility

### Logs and Monitoring

- **Render**: View logs in the Render dashboard
- **Vercel**: View function logs in Vercel dashboard
- **Database**: Monitor connections in Render PostgreSQL dashboard

## 📱 Mobile Optimization

The application is already responsive and mobile-friendly:
- Tailwind CSS responsive design
- Touch-friendly interface
- Optimized for mobile browsers

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:
- **Vercel**: Automatically deploys on push to main branch
- **Render**: Automatically deploys on push to main branch
- Configure branch protection and review processes as needed

## 🛡️ Security Best Practices

### Production Checklist

- [ ] All environment variables use secure, unique values
- [ ] Database uses SSL connections
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Admin credentials are strong and unique
- [ ] Email uses App Password, not regular password
- [ ] JWT secrets are cryptographically secure
- [ ] No sensitive data in repository
- [ ] HTTPS is enforced on all endpoints

### Monitoring

- Set up error tracking (Sentry recommended)
- Monitor database performance
- Set up uptime monitoring
- Configure log aggregation

## 📞 Support

For deployment issues:
1. Check service logs first
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration

---

**🎉 Your NEOBIZE Shuttle Reservation system is now ready for production deployment!**
