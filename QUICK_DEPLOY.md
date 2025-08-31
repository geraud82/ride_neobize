# ⚡ Quick Deployment Guide

Follow these steps to deploy your NEOBIZE Shuttle Reservation system in under 30 minutes.

## 🚀 Step 1: Database Setup (5 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"PostgreSQL"**
3. Configure:
   - Name: `neobize-shuttle-db`
   - Database: `neobize_shuttle`
   - User: `neobize_user`
   - Plan: **Free**
4. Click **"Create Database"**
5. **Copy the External Database URL** (you'll need this)

## 🖥️ Step 2: Backend Deployment (10 minutes)

1. In Render Dashboard, click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - Name: `neobize-shuttle-backend`
   - Root Directory: `backend`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Select "From Database" → choose your PostgreSQL database]
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=contact@neobize.com
EMAIL_SECURE=false
EMAIL_TLS=true
ADMIN_EMAIL=admin@neobize.com
ADMIN_PASSWORD=YourSecurePassword123!
JWT_SECRET=[Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"]
SESSION_SECRET=[Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Click **"Create Web Service"**
6. **Copy your backend URL** (e.g., `https://neobize-shuttle-backend.onrender.com`)

## 🌐 Step 3: Frontend Deployment (10 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**:
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=NEOBIZE Shuttle Reservation
VITE_APP_VERSION=1.0.0
```

6. Click **"Deploy"**
7. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

## 🔄 Step 4: Connect Frontend & Backend (5 minutes)

1. Go back to your **Render backend service**
2. Add environment variable:
   - `FRONTEND_URL` = `https://your-app.vercel.app`
3. **Redeploy** the backend service

## 🔐 Step 5: Security Setup

### Gmail App Password (Required for emails)
1. Enable 2FA on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate app password for "Mail"
4. Use this as `EMAIL_PASS` in Render

### Generate Secure Secrets
Run locally:
```bash
# JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Session Secret  
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

## ✅ Step 6: Test Your Deployment

1. **Health Check**: Visit `https://your-backend.onrender.com/api/health`
2. **Frontend**: Visit your Vercel URL
3. **Make Test Reservation**: Fill out the booking form
4. **Check Email**: Verify you receive the reservation email
5. **Admin Dashboard**: Go to `/admin` and login with your admin credentials

## 🎉 You're Live!

Your application is now deployed and ready for production use:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: Managed PostgreSQL on Render
- **Admin**: `https://your-app.vercel.app/admin`

## 🔧 Optional: Twilio WhatsApp Setup

1. Create [Twilio account](https://www.twilio.com/)
2. Set up WhatsApp Business API
3. Add to Render environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM`
   - `WHATSAPP_TO`

## 📞 Need Help?

- Check the detailed `DEPLOYMENT.md` guide
- Review `SECURITY.md` for security best practices
- Check service logs in Render/Vercel dashboards
- Verify environment variables are set correctly

---

**Total Time: ~30 minutes** ⏱️
