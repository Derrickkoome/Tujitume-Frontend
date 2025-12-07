# 🚀 Quick Deployment Reference Card

## 1️⃣ Backend (Render + PostgreSQL) - 10 minutes

### Create Database
1. Render Dashboard → New + → PostgreSQL
2. Name: `tujitume-db`, Plan: Free
3. **Copy Internal Database URL**

### Deploy Backend
1. Render Dashboard → New + → Web Service
2. Connect GitHub repo: `tujitume-backend`
3. Configure:
   - Build: `pip install -r requirements.txt && alembic upgrade head`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `DATABASE_URL`: [Paste Internal Database URL]
   - `FIREBASE_CREDENTIALS_PATH`: `/etc/secrets/firebase-credentials.json`
5. Add Secret File:
   - Path: `/etc/secrets/firebase-credentials.json`
   - Content: [Firebase Admin SDK JSON]
6. Deploy → Wait 3-5 min
7. **Copy Backend URL**: `https://tujitume-backend.onrender.com`

---

## 2️⃣ Frontend (Netlify) - 5 minutes

### Deploy Frontend
1. Netlify Dashboard → Add new site → Import from GitHub
2. Select repo: `Tujitume-Frontend`
3. Configure:
   - Build: `npm run build`
   - Publish: `dist`
4. Add Environment Variables:
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
5. Deploy → Wait 2-3 min
6. **Copy Netlify URL**: `https://your-site.netlify.app`

---

## 3️⃣ Update CORS & Firebase - 2 minutes

### Update Backend CORS
In `tujitume-backend/app/main.py`:
```python
allow_origins=[
    "https://your-site.netlify.app",  # Add your Netlify URL
    "http://localhost:5173",
]
```
Commit and push → Auto-redeploys

### Add Domain to Firebase
1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain
3. Add: `your-site.netlify.app`

---

## 4️⃣ Test Production - 3 minutes

✅ Visit: `https://your-site.netlify.app`  
✅ Sign up with email/password  
✅ Create a test gig  
✅ Check Network tab (API calls to Render)  
✅ No CORS errors  

---

## 🆘 Quick Fixes

**"Cannot connect to API"**
→ Check `VITE_API_BASE_URL` in Netlify env vars

**"CORS error"**
→ Add Netlify URL to backend CORS origins

**"Firebase unauthorized-domain"**
→ Add Netlify URL to Firebase authorized domains

**"Backend Internal Server Error"**
→ Check Render logs for Python exceptions

**"Database connection failed"**
→ Verify `DATABASE_URL` in Render env vars

---

## 📱 Useful URLs

- **Netlify Dashboard**: https://app.netlify.com
- **Render Dashboard**: https://dashboard.render.com
- **Firebase Console**: https://console.firebase.google.com
- **Your Frontend**: `https://your-site.netlify.app`
- **Your Backend**: `https://tujitume-backend.onrender.com`
- **Backend Health**: `https://tujitume-backend.onrender.com/health`
- **API Docs**: `https://tujitume-backend.onrender.com/docs`

---

## 💰 Cost: $0/month (Free Tier)

**Netlify**: 100 GB bandwidth, 300 build min/month  
**Render**: 750 hours/month, sleeps after 15 min inactivity  
**PostgreSQL**: Expires after 90 days (backup required)

**Need always-on?** Upgrade to paid: ~$14-20/month total

---

**Full guide**: See `DEPLOYMENT_GUIDE.md` for detailed instructions
