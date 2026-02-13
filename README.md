# EchoVox

EchoVox is an accessible text-to-speech application that combines text simplification, speech synthesis, and pictogram visualization to make written content more accessible.

## Features

### Backend (Ruby on Rails 7 API)
- **Document Management**: Create and manage text documents
- **Text Processing**: Integration with Python FastAPI service for text simplification
- **JWT Authentication**: Secure user authentication using Devise JWT
- **RESTful API**: Clean API endpoints for document processing

### Frontend (React)
- **Speech Synthesis**: Text-to-speech using Web Speech API
  - Adjustable rate, pitch, and volume controls
  - Voice gender selection
  - Real-time word highlighting during playback
- **Language Support**: Multiple language support (English, Spanish, French, German, Italian, Portuguese)
- **ARASAAC Integration**: Visual pictogram support for enhanced comprehension
- **Responsive Design**: WCAG compliant accessible interface

## Project Structure

```
EchoVox/
├── backend/           # Rails 7 API
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── services/
│   ├── config/
│   ├── db/
│   └── ...
└── frontend/          # React application
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── ...
    └── ...
```

## Installation

### Prerequisites
- Ruby 3.2+
- Node.js 18+
- SQLite3

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
bundle install
```

3. Set up the database:
```bash
bundle exec rake db:create db:migrate
```

4. Start the Rails server:
```bash
bundle exec rails server -p 3000
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Login and receive JWT token
- `DELETE /logout` - Logout and revoke token

### Documents
- `GET /api/v1/documents` - List all documents
- `GET /api/v1/documents/:id` - Get a specific document
- `POST /api/v1/documents/process` - Process text and create document

## Environment Variables

### Backend
- `DEVISE_JWT_SECRET_KEY` - Secret key for JWT tokens
- `PYTHON_SERVICE_URL` - URL of the Python text simplification service (default: http://localhost:8000)

### Frontend
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)

## Python Service Integration

The backend expects a Python FastAPI service for text simplification. The service should expose:

```
POST /process
{
  "text": "Your text here",
  "language": "en"
}

Response:
{
  "simplified_text": "Simplified version",
  "pictogram_links": {}
}
```

If the Python service is not available, the system will fall back to using the original text.

## ARASAAC API

EchoVox integrates with the ARASAAC API for pictogram support:
- API Base: `https://api.arasaac.org/api/pictograms`
- Endpoint: `/{locale}/search/{term}`
- Supported locales: en, es, fr, de, it, pt

## Usage

1. **Register/Login**: Create an account or login to access the application
2. **Enter Text**: Type or paste text in the input area
3. **Select Language**: Choose your preferred language from the dropdown
4. **Process**: Click "Simplify & Prepare" to process the text
5. **Listen**: Use the speech controls to hear the text read aloud
6. **Adjust Settings**: Fine-tune rate, pitch, and volume to your preference
7. **View Pictograms**: Load pictograms for visual comprehension aid

## Accessibility Features

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible
- Adjustable text sizes
- Real-time word highlighting for easier following

## Technologies Used

### Backend
- Ruby on Rails 7
- Devise & Devise-JWT
- SQLite3
- HTTParty
- Rack-CORS

### Frontend
- React
- Vite
- Web Speech API
- ARASAAC API

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or contributions, please open an issue on GitHub.