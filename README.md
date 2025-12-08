# Tujitume - Freelance Gig Marketplace

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/tujitume-app/deploys)

A modern full-stack freelance marketplace platform connecting service providers with clients for casual gigs and services.

🌐 **Live Demo**: [https://tujitume-app.netlify.app/](https://tujitume-app.netlify.app/)

## 🚀 Features

- **User Authentication**: Firebase Authentication (Email/Password + Google OAuth)
- **Gig Management**: Browse, post, and apply to gigs
- **Advanced Search**: Filter by category, budget type, skills, and location
- **Application System**: Submit applications with cover letters
- **User Dashboard**: Manage posted gigs and track applications
- **Review System**: Rate and review completed work
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first, fully responsive UI
- **Progressive Web App**: Installable with offline support

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Firebase SDK** - Authentication
- **React Hot Toast** - Notifications

### Backend
- **FastAPI** (Python) - REST API
- **PostgreSQL** - Database
- **Firebase Admin SDK** - Token verification
- **SQLAlchemy** - ORM

### DevOps & Testing
- **Jest** + **@testing-library/react** - Unit testing
- **GitHub Actions** - CI/CD pipeline
- **Netlify** - Frontend hosting
- **Render** - Backend hosting

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project
- Backend API running (see backend repo)

## 🏁 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Derrickkoome/Tujitume-Frontend.git
   cd Tujitume-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Backend API
   VITE_API_BASE_URL=http://localhost:8000

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- GigList.test.jsx
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
Tujitume-Frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Theme)
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── lib/            # Utilities (API client)
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── __tests__/      # Test files
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── .env                # Environment variables
├── netlify.toml        # Netlify configuration
└── package.json        # Dependencies
```

## 🔑 Key Features Implementation

### 1. Authentication Flow
- Firebase email/password and Google OAuth
- JWT token management with automatic refresh
- Protected routes with authentication checks
- Token stored in localStorage and sent with every API request

### 2. Gig Management
- **Browse Gigs**: Paginated list with search and filters
- **Post Gig**: Form with real-time validation using Zod
- **Apply to Gigs**: Submit applications with cover letters
- **Track Applications**: View all submitted applications

### 3. Dark Mode
- System preference detection
- Manual toggle with sun/moon icon
- Persists in localStorage
- Smooth transitions across all components

### 4. API Integration
- Centralized Axios instance (`src/lib/api.js`)
- Request interceptor adds Firebase token
- Response interceptor handles 401 errors
- CORS configured for production and development

## 🧪 Testing

Test coverage includes:
- Component rendering tests
- Accessibility (a11y) tests
- User interaction tests
- Authentication hook tests

**Test Results**: 7 test suites, 8 tests passing ✅

## 🚢 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link GitHub repository to Netlify
   - Set branch to deploy: `main`

2. **Configure Build Settings**
   ```toml
   [build]
     command = "npm install && npm run build"
     publish = "dist"

   [build.environment]
     NODE_VERSION = "20"
   ```

3. **Set Environment Variables**
   - Add all `VITE_*` variables in Netlify dashboard
   - Settings → Environment variables

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Live at: https://tujitume-app.netlify.app/

## 🔗 API Endpoints

The frontend connects to the following backend endpoints:

- `GET /api/gigs` - List all gigs
- `POST /api/gigs` - Create new gig
- `GET /api/gigs/{id}` - Get gig details
- `POST /api/gigs/{id}/apply` - Apply to gig
- `GET /api/users/me` - Get current user
- `GET /api/users/me/applications` - Get user's applications
- `POST /api/reviews` - Submit review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Derrick Koome**
- **Amos Ombworo**
- **Ahmed Ali**
- **Branice Nashilu**
- **Ahadi Ethan**

## 🙏 Acknowledgments

- Firebase for authentication infrastructure
- Netlify for hosting and CI/CD
- React and Vite communities