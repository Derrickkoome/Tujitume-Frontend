# 🚀 Complete Deployment Guide: Netlify + Render + PostgreSQL

This guide will walk you through deploying the Tujitume platform:
- **Frontend**: Netlify
- **Backend**: Render with PostgreSQL
- **Authentication**: Firebase

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ GitHub account with your repositories pushed
- ✅ Netlify account (sign up at https://netlify.com)
- ✅ Render account (sign up at https://render.com)
- ✅ Firebase project set up with Authentication enabled
- ✅ All code committed and pushed to GitHub
- ✅ Local testing completed successfully

---

## Part 1: Deploy Backend to Render (with PostgreSQL)

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Log in with your account

2. **Create New PostgreSQL Database**
   - Click **"New +"** button (top right)
   - Select **"PostgreSQL"**

3. **Configure Database**
   ```
   Name: tujitume-db (or your preferred name)
   Database: tujitume
   User: tujitume_user (auto-generated, can change)
   Region: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
   PostgreSQL Version: 16 (latest)
   Datadog API Key: Leave blank
   Plan: Free (or paid if needed)
   ```

4. **Create Database**
   - Click **"Create Database"**
   - Wait 2-3 minutes for provisioning

5. **Copy Connection Details**
   - Once created, you'll see the database dashboard
   - **IMPORTANT**: Copy these values (you'll need them):
     ```
     Internal Database URL: postgres://user:pass@host/db
     External Database URL: postgres://user:pass@host/db
     PSQL Command: psql -h hostname -U username dbname
     ```
   - **Use Internal Database URL** for your backend service

### Step 2: Prepare Backend for Deployment

1. **Navigate to Backend Directory**
   ```bash
   cd /home/derrick-koome/Development/code/SE-prep/Phase3/end-of-phase-project/tujitume-backend
   ```

2. **Update Requirements (if needed)**
   
   Verify `requirements.txt` includes:
   ```
   alembic==1.17.2
   fastapi==0.123.5
   uvicorn==0.38.0
   sqlalchemy==2.0.44
   psycopg2-binary==2.9.11
   firebase-admin==6.5.0
   python-dotenv==1.2.1
   pydantic==2.12.5
   ```

3. **Create `.env.example` for Reference**
   ```bash
   cat > .env.example << 'EOF'
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/database

   # Firebase Admin SDK
   FIREBASE_CREDENTIALS_PATH=/etc/secrets/firebase-credentials.json

   # Optional
   ENVIRONMENT=production
   EOF
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "chore: prepare backend for Render deployment"
   git push origin dev
   ```

### Step 3: Deploy Backend to Render

1. **Create New Web Service**
   - In Render Dashboard, click **"New +"**
   - Select **"Web Service"**

2. **Connect Repository**
   - Click **"Connect a repository"** or **"+ New Web Service"**
   - Authorize Render to access your GitHub account
   - Select your backend repository: `tujitume-backend`
   - Click **"Connect"**

3. **Configure Web Service**
   ```
   Name: tujitume-backend
   Region: Same as your database (important for low latency!)
   Branch: dev (or main)
   Root Directory: . (leave empty if backend is in root)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt && alembic upgrade head
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Plan: Free (or paid)
   ```

4. **Add Environment Variables**
   
   Click **"Advanced"** → **"Add Environment Variable"**
   
   Add these variables:
   
   ```
   DATABASE_URL
   Value: [Paste Internal Database URL from Step 1.5]
   
   ENVIRONMENT
   Value: production
   
   PYTHON_VERSION
   Value: 3.12.0
   ```

5. **Add Firebase Credentials (Secret File)**
   
   **Option A: Using Secret File (Recommended)**
   
   - Click **"Advanced"** → **"Secret Files"**
   - Click **"Add Secret File"**
   - **Filename**: `/etc/secrets/firebase-credentials.json`
   - **Contents**: Copy your Firebase Admin SDK JSON
     
     To get Firebase Admin SDK:
     1. Go to Firebase Console: https://console.firebase.google.com
     2. Select your project
     3. Click ⚙️ (Settings) → "Project settings"
     4. Go to "Service accounts" tab
     5. Click "Generate new private key"
     6. Download JSON file
     7. Copy entire contents and paste into Render
   
   - Add environment variable:
     ```
     FIREBASE_CREDENTIALS_PATH
     Value: /etc/secrets/firebase-credentials.json
     ```
   
   **Option B: Using Environment Variable**
   
   - Minify the JSON (remove newlines)
   - Add as environment variable:
     ```
     FIREBASE_CREDENTIALS
     Value: {"type":"service_account","project_id":"...","private_key":"..."}
     ```
   - Update backend code to read from env var

6. **Create Web Service**
   - Click **"Create Web Service"**
   - Wait 3-5 minutes for build and deployment
   - Watch the logs for any errors

7. **Verify Deployment**
   - Once deployed, you'll get a URL: `https://tujitume-backend.onrender.com`
   - Test it: `https://tujitume-backend.onrender.com/health`
   - Should return: `{"status":"healthy"}`
   - Test docs: `https://tujitume-backend.onrender.com/docs`

### Step 4: Run Database Migrations

The migrations should run automatically via build command. If not:

1. **Access Render Shell**
   - In your web service dashboard
   - Click **"Shell"** tab
   - Run: `alembic upgrade head`

2. **Verify Tables Created**
   - Go to your PostgreSQL database in Render
   - Click **"Connect"** → **"External Connection"**
   - Use provided `psql` command or a GUI tool (e.g., pgAdmin, DBeaver)
   - Check tables exist: `users`, `gigs`, `applications`, `reviews`

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Prepare Frontend for Deployment

1. **Navigate to Frontend Directory**
   ```bash
   cd /home/derrick-koome/Development/code/SE-prep/Phase3/end-of-phase-project/Tujitume-Frontend
   ```

2. **Update Environment Variables**
   
   Create `.env.production` (for production-specific values):
   ```bash
   cat > .env.production << 'EOF'
   # Backend API - UPDATE with your Render URL
   VITE_API_BASE_URL=https://tujitume-backend.onrender.com

   # Firebase Configuration (same as .env)
   VITE_FIREBASE_API_KEY=AIzaSyD5TT5AKZLJEuL6kG2IFsafSptKgKSIP4k
   VITE_FIREBASE_AUTH_DOMAIN=tujitume-frontend-4fbbf.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tujitume-frontend-4fbbf
   VITE_FIREBASE_STORAGE_BUCKET=tujitume-frontend-4fbbf.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=910055545928
   VITE_FIREBASE_APP_ID=1:910055545928:web:0944a2569bb63d9279cc7d
   VITE_FIREBASE_MEASUREMENT_ID=G-N3FFSPD9TF
   EOF
   ```

3. **Test Production Build Locally**
   ```bash
   npm run build
   ```
   
   Should create `dist/` folder with no errors.

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "chore: prepare frontend for Netlify deployment"
   git push origin dev
   ```

### Step 2: Deploy to Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Log in with your account

2. **Add New Site**
   - Click **"Add new site"** → **"Import an existing project"**

3. **Connect to Git Provider**
   - Click **"GitHub"**
   - Authorize Netlify to access your repositories
   - Select your frontend repository: `Tujitume-Frontend`
   - Click **"Install"** if prompted

4. **Configure Build Settings**
   ```
   Branch to deploy: dev (or main)
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: dist
   ```

5. **Add Environment Variables**
   
   Click **"Show advanced"** → **"New variable"**
   
   Add each variable from your `.env` file:
   ```
   VITE_API_BASE_URL=https://tujitume-backend.onrender.com
   VITE_FIREBASE_API_KEY=AIzaSyD5TT5AKZLJEuL6kG2IFsafSptKgKSIP4k
   VITE_FIREBASE_AUTH_DOMAIN=tujitume-frontend-4fbbf.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tujitume-frontend-4fbbf
   VITE_FIREBASE_STORAGE_BUCKET=tujitume-frontend-4fbbf.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=910055545928
   VITE_FIREBASE_APP_ID=1:910055545928:web:0944a2569bb63d9279cc7d
   VITE_FIREBASE_MEASUREMENT_ID=G-N3FFSPD9TF
   ```

6. **Deploy Site**
   - Click **"Deploy site"**
   - Wait 2-3 minutes for build and deployment
   - Watch the deploy logs for errors

7. **Get Your Site URL**
   - Once deployed, you'll get a random URL: `https://random-name-123456.netlify.app`
   - You can customize this later

### Step 3: Configure Custom Domain (Optional)

1. **Set Site Name**
   - In Netlify dashboard, go to **"Site settings"**
   - Click **"Change site name"**
   - Enter: `tujitume` (or your preferred name)
   - New URL: `https://tujitume.netlify.app`

2. **Add Custom Domain (if you own one)**
   - Go to **"Domain settings"**
   - Click **"Add custom domain"**
   - Enter your domain: `tujitume.com`
   - Follow DNS configuration instructions

---

## Part 3: Update CORS and Firebase Settings

### Step 1: Update Backend CORS

1. **Update CORS Origins**
   
   In Render dashboard:
   - Go to your backend web service
   - Click **"Environment"**
   - Add new variable:
     ```
     ALLOWED_ORIGINS
     Value: https://tujitume.netlify.app,https://tujitume-frontend-4fbbf.firebaseapp.com
     ```

2. **Update Backend Code**
   
   If your backend reads from environment:
   ```python
   # app/main.py
   import os
   
   allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=allowed_origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
   
   Or hardcode:
   ```python
   allow_origins=[
       "https://tujitume.netlify.app",  # Production
       "http://localhost:5173",  # Local dev
   ]
   ```

3. **Commit and Push**
   ```bash
   cd tujitume-backend
   git add app/main.py
   git commit -m "fix: update CORS for production deployment"
   git push origin dev
   ```
   
   Render will auto-redeploy.

### Step 2: Add Netlify Domain to Firebase

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project

2. **Add Authorized Domain**
   - Click **"Authentication"** → **"Settings"** tab
   - Scroll to **"Authorized domains"**
   - Click **"Add domain"**
   - Enter: `tujitume.netlify.app` (your Netlify URL)
   - Click **"Add"**

3. **Repeat for Custom Domain** (if applicable)
   - Add: `tujitume.com`

---

## Part 4: Testing Production Deployment

### Step 1: Test Backend API

1. **Health Check**
   ```bash
   curl https://tujitume-backend.onrender.com/health
   ```
   Expected: `{"status":"healthy"}`

2. **API Documentation**
   - Visit: `https://tujitume-backend.onrender.com/docs`
   - Should see FastAPI Swagger UI

3. **Database Connection**
   - Test creating a user via Swagger UI
   - Or use curl:
   ```bash
   curl -X POST https://tujitume-backend.onrender.com/users/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User"}'
   ```

### Step 2: Test Frontend Application

1. **Open Your Netlify Site**
   - Visit: `https://tujitume.netlify.app`

2. **Test Authentication**
   - Click "Sign Up"
   - Create account with email/password
   - Or use Google Sign-In
   - Verify successful login

3. **Test API Integration**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Create a new gig
   - Check API calls go to Render backend
   - Verify Authorization headers present

4. **Test Full Workflow**
   - ✅ Sign up/Login
   - ✅ Create a gig
   - ✅ View gig list
   - ✅ Apply to a gig
   - ✅ View applications
   - ✅ Select applicant
   - ✅ Mark gig complete
   - ✅ Leave review

### Step 3: Check for Common Issues

**Issue**: Frontend loads but can't connect to API

**Check**:
1. Network tab shows 404 or CORS errors
2. Verify `VITE_API_BASE_URL` in Netlify environment variables
3. Check backend CORS includes Netlify URL
4. Redeploy frontend after fixing

**Issue**: "Firebase Error: unauthorized-domain"

**Check**:
1. Go to Firebase Console → Authentication → Settings
2. Add Netlify domain to authorized domains
3. Clear browser cache and try again

**Issue**: "Database connection failed"

**Check**:
1. Verify `DATABASE_URL` in Render environment variables
2. Check PostgreSQL database is running
3. Check Render logs for connection errors
4. Verify backend and database are in same region

**Issue**: Backend shows "Internal Server Error"

**Check**:
1. View Render logs: Web Service → Logs tab
2. Look for Python exceptions
3. Verify all environment variables are set
4. Check Firebase credentials file is uploaded

---

## Part 5: Enable Auto-Deployment

### Netlify Auto-Deploy

Already enabled! Every push to your branch triggers a new build.

**To configure**:
1. Go to Site settings → Build & deploy
2. Under "Build settings", set branch to watch
3. Under "Deploy contexts", configure:
   - Production branch: `main`
   - Branch deploys: `All` or specific branches
   - Deploy previews: Enable for pull requests

### Render Auto-Deploy

Already enabled! Every push to your branch triggers a new build.

**To configure**:
1. Go to your web service → Settings
2. Under "Build & Deploy":
   - Auto-Deploy: Yes
   - Branch: dev (or main)
3. Click "Save Changes"

---

## Part 6: Monitoring and Maintenance

### Monitor Netlify

1. **Check Deploy Logs**
   - Go to Deploys tab
   - Click on latest deploy
   - View build logs for errors

2. **Check Analytics**
   - Go to Analytics (paid feature)
   - View traffic, page views, etc.

3. **Set Up Notifications**
   - Settings → Notifications & integrations
   - Add email/Slack for deploy failures

### Monitor Render

1. **Check Service Logs**
   - Go to Logs tab
   - Filter by error/warning
   - Set up log alerts

2. **Monitor Database**
   - Go to PostgreSQL database
   - Check Metrics tab
   - Monitor connections, CPU, memory

3. **Set Up Notifications**
   - Settings → Notifications
   - Add email for service failures

### Backup Database

1. **Manual Backup**
   - PostgreSQL dashboard → Connect
   - Use `pg_dump` command:
   ```bash
   pg_dump -h hostname -U username -d dbname > backup.sql
   ```

2. **Automated Backups** (Paid plans)
   - Enable in PostgreSQL settings
   - Configure retention period

---

## 📊 Cost Breakdown

### Free Tier Limits

**Netlify Free**:
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- HTTPS included

**Render Free**:
- Web Services: Sleep after 15 min inactivity
- PostgreSQL: Expires after 90 days
- 750 hours/month
- 512 MB RAM
- 0.1 CPU

### Paid Plans (if needed)

**Netlify Pro**: $19/month
- 1 TB bandwidth
- More build minutes
- Form submissions

**Render Starter**:
- Web Service: $7/month (always on, 512 MB RAM)
- PostgreSQL: $7/month (persistent, 1 GB storage)

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- ✅ Frontend loads on Netlify URL
- ✅ Backend responds on Render URL
- ✅ Database connected and migrations ran
- ✅ Firebase authentication works
- ✅ CORS configured correctly
- ✅ Environment variables set
- ✅ Auto-deploy enabled
- ✅ All protected routes work
- ✅ Can create/view/apply to gigs
- ✅ Can leave reviews
- ✅ No console errors in browser
- ✅ API calls successful (check Network tab)
- ✅ SSL certificates working (https://)

---

## 🔧 Troubleshooting Commands

### Check Render Logs
```bash
# View live logs
# Go to Render Dashboard → Web Service → Logs tab

# Or use Render CLI
curl -X GET https://api.render.com/v1/services/{serviceId}/logs \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Test Backend Locally with Production DB
```bash
# In backend directory
export DATABASE_URL="postgresql://user:pass@host/db"
source venv/bin/activate
uvicorn app.main:app --reload
```

### Test Frontend Production Build Locally
```bash
# In frontend directory
npm run build
npm run preview
# Opens on http://localhost:4173
```

### Check Environment Variables
```bash
# Netlify CLI
netlify env:list

# Or check in Netlify Dashboard:
# Site settings → Environment variables
```

---

## 📚 Additional Resources

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Production**: https://vitejs.dev/guide/build.html

---

## 🚀 Quick Deployment Summary

**Backend (Render)**:
1. Create PostgreSQL database
2. Create Web Service
3. Set environment variables (DATABASE_URL, Firebase credentials)
4. Deploy from GitHub
5. Verify health endpoint

**Frontend (Netlify)**:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables (Firebase config, API URL)
5. Deploy

**Configuration**:
1. Update backend CORS with Netlify URL
2. Add Netlify URL to Firebase authorized domains
3. Test full authentication and API flow
4. Monitor logs for errors

---

**That's it! Your application is now live! 🎉**

If you encounter any issues, check the troubleshooting section or the logs in Netlify/Render dashboards.
