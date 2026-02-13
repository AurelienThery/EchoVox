# EchoVox Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Docker Compose                             │
│                                                                     │
│  ┌────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │   PostgreSQL   │  │   Backend       │  │  Python Service    │  │
│  │   Database     │  │   Rails 7 API   │  │   FastAPI          │  │
│  │                │  │                 │  │                    │  │
│  │   Port: 5432   │◄─┤   Port: 3000    │◄─┤   Port: 8000      │  │
│  │                │  │                 │  │                    │  │
│  │  ┌──────────┐  │  │  ┌───────────┐ │  │  ┌──────────────┐ │  │
│  │  │  users   │  │  │  │  JWT Auth │ │  │  │  LangChain   │ │  │
│  │  │documents │  │  │  │  CORS     │ │  │  │  Simplifier  │ │  │
│  │  └──────────┘  │  │  │  Routes   │ │  │  │              │ │  │
│  └────────────────┘  │  └───────────┘ │  │  │  ARASAAC API │ │  │
│                      │                 │  │  │  Client      │ │  │
│                      └─────────────────┘  │  └──────────────┘ │  │
│                              ▲             └────────────────────┘  │
│                              │                                     │
│                              │ HTTP API                            │
│                              │                                     │
│                      ┌───────┴──────────┐                         │
│                      │   Frontend       │                         │
│                      │   React + Vite   │                         │
│                      │                  │                         │
│                      │   Port: 5173     │                         │
│                      │                  │                         │
│                      │  ┌────────────┐  │                         │
│                      │  │Components: │  │                         │
│                      │  │- Auth      │  │                         │
│                      │  │- Documents │  │                         │
│                      │  │- Speech    │  │                         │
│                      │  └────────────┘  │                         │
│                      └──────────────────┘                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
                        [User Browser]
                        Web Speech API
```

## Data Flow

### 1. User Authentication Flow
```
User → Frontend → Backend (JWT)
                     ↓
                 PostgreSQL
                     ↓
                  Token ← Backend ← Frontend ← User
```

### 2. Document Creation with Simplification
```
User → Frontend → Backend → Python Service → OpenAI/LangChain
                     ↓             ↓
                PostgreSQL    ARASAAC API
                     ↓             ↓
                  Document ← Pictograms
                     ↓
                 Frontend ← User
```

### 3. Text-to-Speech Flow
```
User → Frontend (Web Speech API)
         ↓
    Speech Synthesis
         ↓
    Audio Output + Text Highlighting
```

## Component Details

### Backend (Rails 7)
**Purpose**: Main API server for authentication and data management

**Technologies**:
- Ruby on Rails 7.0
- PostgreSQL database
- JWT for authentication
- Rack CORS for cross-origin requests

**Key Files**:
- `app/models/user.rb` - User model with bcrypt
- `app/models/document.rb` - Document model
- `app/controllers/authentication_controller.rb` - Login/Register
- `app/controllers/documents_controller.rb` - CRUD operations
- `lib/json_web_token.rb` - JWT helper

**API Endpoints**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /documents` - List documents
- `POST /documents` - Create document
- `GET /documents/:id` - Get document
- `POST /documents/:id/simplify` - Simplify text
- `DELETE /documents/:id` - Delete document

### Python Microservice (FastAPI)
**Purpose**: Text simplification and pictogram fetching

**Technologies**:
- Python 3.11
- FastAPI framework
- LangChain for LLM integration
- HTTPX for async HTTP requests

**Key Files**:
- `app/main.py` - Main FastAPI application
- `app/services/text_simplifier.py` - FALC simplification
- `app/services/pictogram_service.py` - ARASAAC integration

**API Endpoints**:
- `GET /health` - Health check
- `POST /simplify` - Simplify text to FALC
- `POST /pictograms` - Fetch pictograms

**Features**:
- FALC (Facile À Lire et à Comprendre) simplification
- Multi-language support (FR, EN, ES)
- Fallback simplification without API key
- Keyword extraction for pictograms

### Frontend (React)
**Purpose**: User interface with accessibility features

**Technologies**:
- React 18
- Vite build tool
- Web Speech API
- React Router for navigation

**Key Components**:
- `App.jsx` - Main application component
- `Header.jsx` - Navigation header
- `Login.jsx` / `Register.jsx` - Authentication
- `DocumentList.jsx` - Document listing
- `CreateDocument.jsx` - Document creation form
- `DocumentViewer.jsx` - Document display with speech
- `SpeechControls.jsx` - Speech settings panel

**Services**:
- `authService.js` - Authentication logic
- `documentService.js` - Document API calls
- `api.js` - HTTP client with interceptors

**Custom Hooks**:
- `useSpeechSynthesis.js` - Web Speech API wrapper

**Features**:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Responsive design
- Text-to-speech with highlighting
- Adjustable speech parameters

## Accessibility Features

### Visual
- High contrast colors
- Large fonts (18px base)
- Visible focus indicators
- Color-independent information

### Motor
- Full keyboard navigation
- Large touch targets (44x44px)
- No time limits
- Skip links

### Cognitive
- Simple language
- FALC simplification
- Visual pictograms
- Consistent layout

### Auditory
- Text-to-speech
- Adjustable speed/pitch
- Visual highlighting
- Text alternatives

### Screen Readers
- Semantic HTML
- ARIA labels
- Descriptive alt text
- Status announcements

## Security Measures

1. **Authentication**: JWT tokens with secure key management
2. **Password Security**: Bcrypt hashing
3. **CORS**: Environment-based origin restrictions
4. **Input Validation**: Server and client-side validation
5. **Secret Management**: Environment variables
6. **No Hardcoded Secrets**: Enforced in production

## Deployment

### Development
```bash
docker-compose up --build
```

### Production
- Configure environment variables
- Set ALLOWED_ORIGINS
- Set SECRET_KEY_BASE
- Use production Dockerfiles
- Enable HTTPS
- Configure domain names

## Performance Considerations

- **Caching**: Redis can be added for session caching
- **CDN**: Static assets can be served via CDN
- **Database**: Connection pooling configured
- **API**: Rate limiting can be added
- **Frontend**: Code splitting with Vite

## Scalability

The architecture supports horizontal scaling:
- Backend: Multiple Rails instances behind load balancer
- Python Service: Multiple FastAPI instances
- Database: PostgreSQL replication
- Frontend: Static files on CDN

## Monitoring

Suggested monitoring points:
- Application health endpoints
- Database connections
- API response times
- Error rates
- User sessions
- Speech API usage

## Future Enhancements

Potential improvements:
- Real-time collaboration (WebSockets)
- Document sharing
- Multiple document formats (PDF, DOCX)
- Offline support (PWA)
- Mobile applications
- More language support
- Custom pictogram sets
- User preferences storage
- Analytics dashboard
