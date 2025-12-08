# 🚀 Tujitume Frontend - Deployment Guide

## Prerequisites
- Node.js 16+
- Firebase project configured

## Environment Variables

Create a `.env` file with:

```env
# Backend API
VITE_API_URL=https://your-backend-api.com

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

### 3. Test Production Build Locally
```bash
npm run preview
```

## Deployment Platforms

### Netlify (Recommended)

1. **Via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

2. **Via Git:**
- Connect your GitHub repo in Netlify dashboard
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Netlify dashboard

3. **Redirects for SPA:**
Create `public/_redirects`:
```
/*    /index.html   200
```

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

Or connect GitHub repo in Vercel dashboard.

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

2. Initialize:
```bash
firebase init hosting
```

3. Deploy:
```bash
npm run build
firebase deploy --only hosting
```

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Update vite.config.js:
```js
export default defineConfig({
  base: '/Tujitume-Frontend/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

## Docker Deployment

```dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment-Specific Builds

### Production
```bash
npm run build
```

### Staging
```bash
VITE_API_URL=https://staging-api.com npm run build
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test login with Google/Facebook
- [ ] Test gig creation
- [ ] Test application flow
- [ ] Check API connectivity
- [ ] Verify responsive design
- [ ] Test dark mode
- [ ] Check error handling
- [ ] Verify all routes work (no 404s)

## Firebase Console Setup

1. Enable Authentication methods (Google, Facebook)
2. Add authorized domains:
   - `localhost` (for development)
   - Your production domain
3. Update OAuth redirect URLs

## Performance Optimization

The build is already optimized with:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Lazy loading routes

## Monitoring

Consider adding:
- Google Analytics
- Sentry for error tracking
- Firebase Analytics

## Recent Updates (Dec 8, 2025)

✅ Complete user profile editing
✅ Enhanced application tracking
✅ Worker profile display with ratings
✅ Dashboard with real statistics
✅ Improved data presentation

## Troubleshooting

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not working
- Ensure variables start with `VITE_`
- Restart dev server after changing .env
- Check .env is not in .gitignore for production

### Firebase auth not working
- Check authorized domains in Firebase Console
- Verify all Firebase env variables
- Ensure auth methods are enabled

## Support

For issues, check the main documentation or open an issue on GitHub.
