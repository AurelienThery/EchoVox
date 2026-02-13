# Security Policy

## Supported Versions

We are committed to maintaining the security of EchoVox. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Updates

### Latest Security Fixes

**February 13, 2024**
- **FastAPI ReDoS Vulnerability**: Updated FastAPI from 0.104.1 to 0.109.1 to patch Content-Type Header Regular expression Denial of Service (ReDoS) vulnerability

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Email the security team at: [security contact - to be configured]
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### What to Expect

- **Response Time**: We aim to respond within 48 hours
- **Updates**: You'll receive regular updates on the progress
- **Disclosure**: We'll coordinate with you on disclosure timing
- **Credit**: We'll credit you for responsible disclosure (if desired)

## Security Best Practices

### For Developers

1. **Dependencies**: Keep all dependencies up to date
2. **Secrets**: Never commit secrets or API keys
3. **Environment Variables**: Use environment variables for sensitive data
4. **Code Review**: All code changes undergo security review
5. **Static Analysis**: Run CodeQL before merging

### For Users

1. **Environment Variables**: Configure `.env` file properly
2. **CORS**: Set `ALLOWED_ORIGINS` to your actual domains in production
3. **Secret Keys**: Generate strong random keys for `SECRET_KEY_BASE`
4. **Database**: Use strong passwords for PostgreSQL
5. **HTTPS**: Always use HTTPS in production
6. **Updates**: Keep Docker images updated

## Security Measures in Place

### Authentication
- JWT tokens with expiration
- Bcrypt password hashing
- Secure session management

### API Security
- Environment-based CORS configuration
- Input validation on all endpoints
- Rate limiting (recommended for production)

### Database Security
- Parameterized queries (SQL injection prevention)
- Connection encryption
- Proper access controls

### Infrastructure
- Docker container isolation
- Health checks for all services
- Minimal container images

## Security Scanning

We regularly scan our codebase using:
- **CodeQL**: Static analysis for security vulnerabilities
- **Dependency Scanning**: Check for vulnerable dependencies
- **Manual Review**: Code review process for all changes

### Latest Scan Results

**CodeQL Scan** (February 13, 2024):
- Ruby: 0 vulnerabilities
- JavaScript: 0 vulnerabilities  
- Python: 0 vulnerabilities

**Dependency Check** (February 13, 2024):
- All dependencies verified
- No known vulnerabilities

## Compliance

EchoVox follows security best practices and aims to comply with:
- OWASP Top 10
- CWE/SANS Top 25
- General security standards

## Security Checklist for Production

Before deploying to production:

- [ ] Set strong `SECRET_KEY_BASE`
- [ ] Configure `ALLOWED_ORIGINS` with actual domains
- [ ] Use strong database passwords
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable logging and monitoring
- [ ] Regular backup strategy
- [ ] Keep dependencies updated
- [ ] Review environment variables

## Vulnerability Disclosure Timeline

Our typical timeline for handling vulnerabilities:

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Initial assessment and response
3. **Day 3-7**: Develop and test fix
4. **Day 7-14**: Deploy fix and notify users
5. **Day 30**: Public disclosure (coordinated)

## Contact

For security-related inquiries:
- Security issues: [Configure security email]
- General questions: Open a GitHub issue (for non-sensitive topics)

## Acknowledgments

We thank the security researchers and community members who help keep EchoVox secure.

---

**Last Updated**: February 13, 2024
