# Deployment Guide

This guide covers deploying the Tujitume platform to production.

## Frontend Deployment (Netlify)

### Prerequisites
1. Netlify account (free tier works)
2. Firebase project with Authentication enabled
3. GitHub repository

### Step 1: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Google** provider
   - Enable **Email/Password** provider
4. Get Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Copy the configuration values

### Step 2: Set Up Netlify

1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub account
   - Select the `Tujitume-Frontend` repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are already set in netlify.toml)

3. **Set Environment Variables**:
   Go to Site settings > Environment variables and add:

   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Configure Firebase Auth Domain**:
   - After Netlify gives you a domain (e.g., `yourapp.netlify.app`)
   - Go to Firebase Console > Authentication > Settings
   - Add your Netlify domain to "Authorized domains"

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to your main branch

### Step 3: Test the Deployment

1. Visit your Netlify URL
2. Test signup with email/password
3. Test login with email/password
4. Test Google sign-in
5. Test forgot password flow
6. Test all protected routes

## Backend Deployment (Render)

### Prerequisites
1. Render account (free tier works)
2. PostgreSQL database
3. Firebase Admin SDK service account key

### Step 1: Prepare Backend

1. **Update CORS settings**:
   In `tujitume-backend/app/main.py`, update CORS origins:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://yourapp.netlify.app",  # Your Netlify URL
           "http://localhost:5173"  # Keep for local development
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Create requirements.txt** (if not exists):
   ```
   fastapi==0.123.5
   uvicorn[standard]==0.38.0
   sqlalchemy==2.0.44
   pydantic==2.12.5
   python-dotenv==1.2.1
   firebase-admin==6.5.0
   psycopg2-binary==2.9.11
   alembic==1.17.2
   ```

### Step 2: Set Up Render

1. **Create PostgreSQL Database**:
   - Go to Render Dashboard
   - Click "New" > "PostgreSQL"
   - Choose a name (e.g., `tujitume-db`)
   - Select free tier
   - Create database
   - Copy the "Internal Database URL"

2. **Create Web Service**:
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Select `tujitume-backend` folder
   - Configure:
     - Name: `tujitume-backend`
     - Environment: Python 3
     - Build Command: `pip install -r requirements.txt && alembic upgrade head`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**:
   ```
   DATABASE_URL=<your_postgresql_internal_url>
   FIREBASE_SERVICE_ACCOUNT_PATH=/etc/secrets/firebase-credentials.json
   PORT=10000
   ```

4. **Add Firebase Service Account** (Secret File):
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - In Render, go to Environment > Secret Files
   - Create file: `/etc/secrets/firebase-credentials.json`
   - Paste the JSON content

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your Render URL (e.g., `https://tujitume-backend.onrender.com`)

### Step 3: Update Frontend with Backend URL

1. In Netlify environment variables, update:
   ```
   VITE_API_BASE_URL=https://tujitume-backend.onrender.com
   ```

2. Redeploy frontend on Netlify

## Post-Deployment Checklist

### Frontend
- [ ] All pages load correctly
- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] Google sign-in works
- [ ] Forgot password sends email
- [ ] Protected routes redirect to login
- [ ] Service worker caches correctly
- [ ] PWA install banner shows
- [ ] All API calls use HTTPS

### Backend
- [ ] API documentation accessible at `/docs`
- [ ] Database migrations applied
- [ ] Firebase authentication validates tokens
- [ ] All endpoints return correct responses
- [ ] CORS allows requests from frontend domain
- [ ] PostgreSQL database connected

### Security
- [ ] All environment variables are secret
- [ ] Firebase Admin SDK key is secure
- [ ] CORS only allows production domain
- [ ] HTTPS enforced on all connections
- [ ] No sensitive data in frontend code

## Monitoring and Maintenance

### Netlify
- Monitor build logs in Netlify dashboard
- Set up build notifications
- Review function logs if using serverless functions

### Render
- Monitor service logs in Render dashboard
- Set up health checks
- Review database metrics
- Scale up if needed (paid plans)

### Firebase
- Monitor Authentication usage
- Review quota limits
- Check for suspicious activity

## Troubleshooting

### Frontend Issues

**Build fails on Netlify:**
- Check Node version (should be 18+)
- Verify all dependencies are in package.json
- Review build logs for specific errors

**Firebase authentication not working:**
- Verify Firebase config values are correct
- Check if domain is authorized in Firebase Console
- Ensure Firebase Auth is enabled

**API calls failing:**
- Check VITE_API_BASE_URL is correct
- Verify CORS is configured on backend
- Check browser console for errors

### Backend Issues

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Review connection string format

**Firebase token validation failing:**
- Check service account JSON is valid
- Verify FIREBASE_SERVICE_ACCOUNT_PATH is correct
- Ensure Firebase Admin SDK is installed

**CORS errors:**
- Add frontend domain to allowed origins
- Check middleware configuration
- Verify credentials are included in requests

## Environment Variables Reference

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
```

## Costs

### Free Tier Limits

**Netlify (Free)**:
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- Continuous deployment

**Render (Free)**:
- 750 hours/month (sleep after 15 min inactivity)
- 512 MB RAM
- Shared CPU
- PostgreSQL: 90 days retention, 1 GB storage

**Firebase (Free - Spark Plan)**:
- 10K phone auth/month
- 50K email auth/month
- 1 GB storage
- 10 GB/month data transfer

### Paid Options

If you need more resources:
- **Netlify Pro**: $19/month (more bandwidth, concurrent builds)
- **Render Standard**: $7/month (no sleep, more resources)
- **Firebase Blaze**: Pay-as-you-go (only pay for usage)

## Support

For issues:
1. Check logs (Netlify/Render dashboard)
2. Review Firebase Authentication logs
3. Test locally with production environment variables
4. Check GitHub issues or create new one
