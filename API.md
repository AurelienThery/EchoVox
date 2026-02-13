# EchoVox API Documentation

Base URL: `http://localhost:3000` (development)

## Authentication

EchoVox uses JWT (JSON Web Tokens) for authentication. After logging in, include the JWT token in the Authorization header for all authenticated requests:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register a New User

```
POST /signup
```

**Request Body:**
```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
}
```

**Response (200 OK):**
```json
{
  "status": {
    "code": 200,
    "message": "Signed up successfully."
  },
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
}
```

#### Login

```
POST /login
```

**Request Body:**
```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Response (200 OK):**
```json
{
  "status": {
    "code": 200,
    "message": "Logged in successfully."
  },
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
}
```

**Response Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### Logout

```
DELETE /logout
```

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Logged out successfully."
}
```

### Documents

#### List Documents

```
GET /api/v1/documents
```

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "content": "Original text",
    "simplified_content": "Simplified text",
    "language": "en",
    "user_id": 1,
    "pictogram_links": {},
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get a Specific Document

```
GET /api/v1/documents/:id
```

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "content": "Original text",
  "simplified_content": "Simplified text",
  "language": "en",
  "user_id": 1,
  "pictogram_links": {},
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Process Document

Process text through the Python service and save the result.

```
POST /api/v1/documents/process
```

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This is a complex text that needs simplification.",
  "language": "en"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "document": {
    "id": 1,
    "content": "This is a complex text that needs simplification.",
    "simplified_content": "This is simple text.",
    "language": "en",
    "pictogram_links": {}
  }
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "status": "error",
  "errors": ["Content can't be blank"]
}
```

## Supported Languages

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese

## Error Responses

### 401 Unauthorized

```json
{
  "error": "You need to sign in or sign up before continuing."
}
```

### 404 Not Found

```json
{
  "error": "Record not found"
}
```

### 500 Internal Server Error

```json
{
  "status": 500,
  "error": "Internal Server Error"
}
```

## Rate Limiting

Currently, there are no rate limits in development. Consider implementing rate limiting in production using gems like `rack-attack`.

## CORS

The API allows cross-origin requests from all origins in development. In production, configure CORS to allow only your frontend domain.

## Python Service Integration

The `/api/v1/documents/process` endpoint communicates with a Python FastAPI service for text simplification. If the service is unavailable, the endpoint will fall back to using the original text.

### Expected Python Service Endpoint

```
POST {PYTHON_SERVICE_URL}/process
```

**Request Body:**
```json
{
  "text": "Text to simplify",
  "language": "en"
}
```

**Expected Response:**
```json
{
  "simplified_text": "Simplified version",
  "pictogram_links": {}
}
```

## ARASAAC Pictogram API

The frontend integrates with the ARASAAC API for pictogram support:

```
GET https://api.arasaac.org/api/pictograms/{locale}/search/{term}
```

**Parameters:**
- `{locale}`: Language code (en, es, fr, de, it, pt)
- `{term}`: Search term

**Example:**
```
GET https://api.arasaac.org/api/pictograms/en/search/hello
```

This API does not require authentication and is publicly available.

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@example.com","password":"password123","password_confirmation":"password123"}}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@example.com","password":"password123"}}' \
  -i
```

**Process Document:**
```bash
curl -X POST http://localhost:3000/api/v1/documents/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"content":"Hello world","language":"en"}'
```

### Using Postman

1. Import the endpoints into Postman
2. Set up an environment variable for the JWT token
3. Test each endpoint

## Version History

### v1.0.0 (2024)
- Initial release
- User authentication with JWT
- Document processing endpoint
- Text simplification integration
- Pictogram support
