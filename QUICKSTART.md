# EchoVox - Quick Start Guide

## Prerequisites

Before you begin, make sure you have:
- Docker Desktop installed and running
- (Optional) OpenAI API key for advanced text simplification

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AurelienThery/EchoVox.git
cd EchoVox
```

### 2. Configure Environment Variables (Optional)

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key (optional)
# The app works without it using fallback simplification
nano .env  # or use your preferred editor
```

### 3. Start the Application

```bash
# Build and start all services
docker-compose up --build

# Wait for services to start (this may take a few minutes on first run)
# You should see logs indicating all services are ready
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000/health
- **Python Service**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs

### 5. Create Your First Account

1. Go to http://localhost:5173
2. Click "S'inscrire" (Register)
3. Fill in your details:
   - Name
   - Email
   - Password (minimum 6 characters)
4. Click "S'inscrire"

### 6. Create Your First Document

1. After logging in, click "Nouveau Document"
2. Enter some text in French (or English/Spanish)
3. Make sure "Simplifier automatiquement" is checked
4. Click "Créer le document"
5. Wait a moment for the text to be simplified

### 7. Use the Speech Features

On the document page:
1. Click "🔊 Lire le texte" to hear the text read aloud
2. Click "▶ Afficher" in the "Contrôles de Lecture Vocale" section to adjust:
   - Voice selection
   - Speed (0.5x to 2x)
   - Pitch (0 to 2)
   - Volume (0% to 100%)
3. Watch the text highlight as it's being read

## Common Issues

### Port Already in Use

If you see an error about ports being in use:

```bash
# Stop the containers
docker-compose down

# Check which process is using the port
lsof -i :3000  # or :5173 or :8000

# Kill the process or change the port in docker-compose.yml
```

### Services Not Starting

If services fail to start:

```bash
# Check logs for specific service
docker-compose logs backend
docker-compose logs python-service
docker-compose logs frontend

# Rebuild a specific service
docker-compose up --build backend
```

### Database Connection Issues

```bash
# Reset the database
docker-compose down -v  # This removes volumes!
docker-compose up --build
```

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (database data will be lost!)
docker-compose down -v
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API documentation at http://localhost:8000/docs
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Getting Help

- Open an issue on GitHub
- Check existing issues for solutions
- Read the documentation

Enjoy using EchoVox! 🎙️
