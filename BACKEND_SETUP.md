# Tujitume Backend Setup Guide

Your backend is in a **separate repository**. This frontend communicates with the backend via REST API endpoints.

## Backend Repository Structure

Create a new repository `Tujitume-Backend` with this structure:

```
Tujitume-Backend/
├── main.py                 # FastAPI application with all endpoints
├── models.py               # SQLAlchemy ORM models (User, Gig, Application)
├── schemas.py              # Pydantic validation schemas
├── crud.py                 # CRUD operations for database
├── database.py             # SQLAlchemy engine and session configuration
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── Dockerfile              # Container image (for deployment)
├── docker-compose.yml      # Local development with Docker
└── alembic/                # Database migrations (set up with Alembic)
    ├── env.py
    ├── script.py.mako
    └── versions/
```

## Key Backend Files

### `main.py` - FastAPI Application
Contains all API endpoints:
- **Auth**: `POST /api/auth/session` - Verify Firebase tokens
- **Users**: Get, create, update user profiles
- **Gigs**: CRUD operations for job postings
- **Applications**: Create, manage freelancer applications

### `models.py` - Database Models
Three main SQLAlchemy models:
- **User**: Firebase UID, email, profile data
- **Gig**: Job postings with title, description, budget, status
- **Application**: Freelancer applications to gigs

### `schemas.py` - Pydantic Schemas
Request/response validation:
- `GigCreate`, `GigUpdate` - Gig operations
- `ApplicationCreate` - Application submissions
- `UserUpdate` - Profile updates
- `GigFilter` - Search/filter parameters

### `crud.py` - Database Operations
CRUD functions for all models:
- User management (create, read, update)
- Gig operations (create, list, filter, update, delete)
- Application handling (create, accept, reject, cancel)
- Statistics (gigs posted, applications made/received)

### `database.py` - Database Configuration
- SQLAlchemy engine setup (supports PostgreSQL, SQLite)
- Session factory for dependency injection
- Database initialization on startup

## Installation Steps

### 1. Create Backend Repository
```bash
mkdir Tujitume-Backend
cd Tujitume-Backend
git init
```

### 2. Set Up Python Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

**requirements.txt content:**
```
fastapi==0.95.2
uvicorn==0.22.0
firebase-admin==6.0.1
sqlalchemy==2.0.23
pydantic==2.5.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9
alembic==1.13.0
cors==1.0.1
```

### 4. Set Up Environment Variables
```bash
cp .env.example .env
```

**`.env` template:**
```
# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-service-account.json

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tujitume
# For development: DATABASE_URL=sqlite:///./test.db

# Environment
SQL_ECHO=False
```

### 5. Initialize Database
```bash
python -c "from database import init_db; init_db()"
```

This creates all tables (User, Gig, Application) in your database.

### 6. Run Development Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server runs at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/session` - Verify Firebase ID token

### Users
- `GET /api/users/{user_id}` - Get user profile
- `POST /api/users` - Create/register user
- `PUT /api/users/{user_id}` - Update profile
- `GET /api/users/{user_id}/gigs` - Get user's posted gigs
- `GET /api/users/{user_id}/applications` - Get user's applications

### Gigs
- `GET /api/gigs` - List all gigs (with filters: category, location, budget)
- `POST /api/gigs` - Create new gig
- `GET /api/gigs/{gig_id}` - Get gig details
- `PUT /api/gigs/{gig_id}` - Update gig
- `DELETE /api/gigs/{gig_id}` - Delete gig

### Applications
- `POST /api/gigs/{gig_id}/apply` - Apply to a gig
- `GET /api/gigs/{gig_id}/applications` - Get gig's applications (creator only)
- `PUT /api/applications/{app_id}/status` - Update application status
- `GET /api/users/{user_id}/applications` - Get user's applications

### Health
- `GET /health` - Health check endpoint

## Frontend Configuration

The frontend (`src/lib/api.js`) uses this environment variable:

```javascript
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
```

### Development
In `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Production
In `.env.production`:
```
VITE_API_BASE_URL=https://your-backend-production-url.railway.app
```

## Database Migrations with Alembic

### Initialize Alembic
```bash
alembic init alembic
```

### Create Initial Migration
```bash
alembic revision --autogenerate -m "Initial migration"
```

### Apply Migrations
```bash
alembic upgrade head
```

## Docker Deployment

### Build Image
```bash
docker build -t tujitume-backend:latest .
```

### Run Container
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@host:5432/tujitume \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-credentials.json \
  tujitume-backend:latest
```

## Deployment Options

### Railway
1. Push to GitHub
2. Connect to Railway
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically on push

### Render
1. Connect Git repository
2. Create PostgreSQL service
3. Configure environment variables
4. Deploy

### Heroku
1. Create app: `heroku create tujitume-backend`
2. Add PostgreSQL: `heroku addons:create heroku-postgresql`
3. Push code: `git push heroku main`

## Common Issues

### Import Errors
Ensure all Python packages are installed:
```bash
pip install -r requirements.txt
```

### Database Connection
- Check `DATABASE_URL` in `.env`
- PostgreSQL must be running
- Verify credentials and network access

### Firebase Token Verification
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to valid service account JSON
- Check Firebase project settings

### CORS Issues
The API includes CORS middleware configured for all origins. Restrict in production:
```python
# In main.py
allow_origins=["https://yourdomain.com"]
```

## Next Steps

1. **Set up migrations** - Use Alembic for schema management
2. **Add logging** - Implement request/response logging middleware
3. **Create tests** - Write unit and integration tests
4. **API documentation** - Generate Swagger/OpenAPI docs
5. **Deploy** - Use Railway, Render, or Heroku for production

## Frontend-Backend Communication

### Token Flow
1. User logs in via Firebase (frontend)
2. Frontend gets `idToken` from Firebase
3. Sends token in `Authorization: Bearer {token}` header
4. Backend verifies token with Firebase Admin SDK
5. Backend returns user data and creates/updates database record

### API Request Example
```javascript
// Frontend (src/lib/api.js handles token injection)
const response = await api.post('/api/gigs', {
  title: 'Build a Website',
  description: 'Need help building an e-commerce site',
  category: 'web-development',
  budget: 500,
  location: 'Nairobi'
});
```

```python
# Backend receives authenticated request
@app.post('/api/gigs', response_model=GigResponse)
async def create_gig(
    gig_data: GigCreate,
    decoded: dict = Depends(verify_token),  # Token verified
    db: Session = Depends(get_db)
):
    user_id = decoded.get('uid')  # Firebase UID
    gig = crud.create_gig(db, user_id, gig_data)
    return gig
```

## Support

For issues, check:
1. Terminal/console logs
2. `.env` file configuration
3. Database connectivity
4. Firebase credentials validity
5. API endpoint documentation in `main.py`
