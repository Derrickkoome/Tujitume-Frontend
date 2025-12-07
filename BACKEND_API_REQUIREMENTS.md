# Backend API Requirements for Gig List & Details

## Required Endpoints

### 1. GET /api/gigs
Fetch all gigs with optional filtering and sorting.

**Query Parameters:**
- `skip` (int, optional): Pagination offset (default: 0)
- `limit` (int, optional): Max results per page (default: 100)
- `sort_by` (string, optional): Sort field - "created_at", "budget" (default: "created_at")
- `sort_order` (string, optional): "asc" or "desc" (default: "desc")
- `budget_type` (string, optional): Filter by "fixed" or "hourly"
- `skills` (string, optional): Comma-separated skills to filter by

**Response:**
```json
[
  {
    "id": 1,
    "title": "Build a React App",
    "description": "Looking for a React developer...",
    "budget": 5000,
    "budget_type": "fixed",
    "location": "Remote",
    "skills_required": ["React", "JavaScript", "CSS"],
    "deadline": "2025-12-31T00:00:00Z",
    "owner_id": "firebase_uid_123",
    "created_at": "2025-12-01T10:30:00Z",
    "updated_at": "2025-12-01T10:30:00Z"
  }
]
```

### 2. GET /api/gigs/{gig_id}
Fetch a single gig by ID.

**Path Parameters:**
- `gig_id` (int): The gig ID

**Response:**
```json
{
  "id": 1,
  "title": "Build a React App",
  "description": "Looking for a React developer to build a modern web application...",
  "budget": 5000,
  "budget_type": "fixed",
  "location": "Remote",
  "skills_required": ["React", "JavaScript", "CSS"],
  "deadline": "2025-12-31T00:00:00Z",
  "owner_id": "firebase_uid_123",
  "created_at": "2025-12-01T10:30:00Z",
  "updated_at": "2025-12-01T10:30:00Z"
}
```

**Error Responses:**
- 404: Gig not found

### 3. POST /api/gigs (Already implemented)
Create a new gig.

**Request Body:**
```json
{
  "title": "Build a React App",
  "description": "Looking for a React developer...",
  "budget": 5000,
  "budget_type": "fixed",
  "location": "Remote",
  "skills_required": ["React", "JavaScript"],
  "deadline": "2025-12-31"
}
```

### 4. GET /api/users/{user_id}
Fetch user details (for displaying gig owner info).

**Path Parameters:**
- `user_id` (string): Firebase UID

**Response:**
```json
{
  "uid": "firebase_uid_123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-11-01T10:00:00Z"
}
```

### 5. POST /api/gigs/{gig_id}/apply
Apply to a gig.

**Request Body:**
```json
{
  "cover_letter": "I am a skilled React developer with 5 years of experience..."
}
```

**Response:**
```json
{
  "id": 1,
  "gig_id": 1,
  "applicant_id": "firebase_uid_456",
  "cover_letter": "I am a skilled React developer...",
  "status": "pending",
  "created_at": "2025-12-07T15:30:00Z"
}
```

**Error Responses:**
- 400: Already applied
- 401: Unauthorized
- 404: Gig not found

## Database Schema Updates

### Gig Model
Ensure these fields exist:
```python
class Gig(Base):
    __tablename__ = "gigs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Float)
    budget_type = Column(String)  # "fixed" or "hourly"
    location = Column(String)
    skills_required = Column(JSON)  # Array of strings
    deadline = Column(DateTime)
    owner_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Application Model
```python
class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    gig_id = Column(Integer, ForeignKey("gigs.id"))
    applicant_id = Column(String, nullable=False)
    cover_letter = Column(Text)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Implementation Notes

1. **CORS**: Ensure CORS is configured to allow requests from frontend origin
2. **Authentication**: All protected endpoints should verify Firebase token
3. **Pagination**: Implement proper offset/limit pagination for GET /api/gigs
4. **Filtering**: Support filtering by budget_type and skills
5. **Sorting**: Support sorting by created_at and budget in both directions
6. **Error Handling**: Return proper HTTP status codes and error messages
7. **Validation**: Use Pydantic schemas for request/response validation

## Testing the Backend

Use these curl commands to test:

```bash
# Get all gigs
curl http://localhost:8000/api/gigs

# Get gig by ID
curl http://localhost:8000/api/gigs/1

# Create a gig (requires auth token)
curl -X POST http://localhost:8000/api/gigs \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Gig",
    "description": "Test description",
    "budget": 1000,
    "budget_type": "fixed"
  }'

# Apply to a gig (requires auth token)
curl -X POST http://localhost:8000/api/gigs/1/apply \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cover_letter": "I am interested in this gig"
  }'
```
