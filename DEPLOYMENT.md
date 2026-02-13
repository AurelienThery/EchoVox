# EchoVox Deployment Guide

This guide will help you deploy the EchoVox application to production.

## Prerequisites

- Ruby 3.2+
- Node.js 18+
- PostgreSQL or SQLite3
- A server or cloud platform (e.g., Heroku, AWS, DigitalOcean)

## Backend Deployment

### Environment Variables

Set the following environment variables in your production environment:

```bash
RAILS_ENV=production
DEVISE_JWT_SECRET_KEY=your-very-secure-secret-key-here
PYTHON_SERVICE_URL=https://your-python-service.com
SECRET_KEY_BASE=your-rails-secret-key-base
DATABASE_URL=your-database-url (if using PostgreSQL)
```

### Generate Secrets

```bash
# Generate JWT secret
ruby -e "require 'securerandom'; puts SecureRandom.hex(64)"

# Generate Rails secret key base
cd backend
bundle exec rake secret
```

### Database Setup

```bash
cd backend
RAILS_ENV=production bundle exec rake db:create db:migrate
```

### Start the Server

```bash
cd backend
RAILS_ENV=production bundle exec rails server -p 3000 -b 0.0.0.0
```

Or use a process manager like Puma with systemd or PM2.

## Frontend Deployment

### Build for Production

1. Update `.env` file or set environment variables:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

2. Build the application:

```bash
cd frontend
npm run build
```

3. The built files will be in the `frontend/dist` directory.

### Serving the Frontend

You can serve the frontend using:

- **Nginx**: Configure Nginx to serve the `dist` directory
- **CDN**: Upload to a CDN like Cloudflare Pages, Vercel, or Netlify
- **Apache**: Configure Apache to serve the `dist` directory

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/EchoVox/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Docker Deployment (Optional)

### Backend Dockerfile

```dockerfile
FROM ruby:3.2

WORKDIR /app

COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install

COPY backend .

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18 as build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - RAILS_ENV=production
      - DEVISE_JWT_SECRET_KEY=${DEVISE_JWT_SECRET_KEY}
      - PYTHON_SERVICE_URL=${PYTHON_SERVICE_URL}
    volumes:
      - ./backend/db:/app/db

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

## SSL/TLS Configuration

For production, always use HTTPS. You can use:

- **Let's Encrypt**: Free SSL certificates
- **Cloudflare**: Free SSL with CDN
- **AWS Certificate Manager**: Free SSL for AWS resources

## Python Service (Optional)

If you have a Python FastAPI service for text simplification:

1. Deploy it separately
2. Set the `PYTHON_SERVICE_URL` environment variable to point to it
3. Ensure the backend can communicate with the Python service

If the Python service is not available, the backend will fall back to using the original text.

## Security Checklist

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly (don't use `*` in production)
- [ ] Set up a firewall
- [ ] Enable rate limiting
- [ ] Configure database backups
- [ ] Use environment variables for sensitive data
- [ ] Review and update dependencies regularly

## Monitoring

Consider setting up:

- **Application monitoring**: New Relic, Datadog, or Sentry
- **Server monitoring**: Prometheus, Grafana
- **Log aggregation**: ELK Stack, Splunk
- **Uptime monitoring**: UptimeRobot, Pingdom

## Backup Strategy

- Database: Daily automated backups
- Code: Version control with GitHub
- Environment configs: Securely stored offline

## Troubleshooting

### Backend Won't Start

- Check database connection
- Verify all environment variables are set
- Check logs: `tail -f backend/log/production.log`

### Frontend Can't Connect to Backend

- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration
- Verify API is accessible from the frontend domain

### Authentication Issues

- Verify JWT secret is set correctly
- Check token expiration settings
- Ensure cookies/session storage is working

## Support

For issues or questions, please open an issue on GitHub.
