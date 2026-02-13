# EchoVox

Une application fullstack accessible pour la simplification de texte et la synthèse vocale, conforme aux normes WCAG.

## 🎯 Fonctionnalités

- **Backend Rails 7 API**: Gestion des documents et utilisateurs avec authentification JWT
- **Microservice Python FastAPI**: Simplification de texte en FALC avec LangChain et pictogrammes ARASAAC
- **Frontend React**: Interface accessible avec contrôles Web Speech API
- **Accessibilité WCAG**: Conception prioritaire pour l'accessibilité
- **Docker Compose**: Orchestration complète des services

## 🏗️ Architecture

```
EchoVox/
├── backend/           # Rails 7 API (port 3000)
├── python-service/    # FastAPI microservice (port 8000)
├── frontend/          # React application (port 5173)
└── docker-compose.yml # Orchestration des services
```

### Services

1. **Backend (Rails 7)**
   - Modèles: User, Document
   - API RESTful avec authentification JWT
   - Appelle le microservice Python pour simplification

2. **Microservice Python (FastAPI)**
   - Simplification FALC avec LangChain
   - Intégration API ARASAAC pour pictogrammes
   - Support multilingue (FR, EN, ES)

3. **Frontend (React)**
   - Interface accessible (WCAG 2.1 AA)
   - Contrôles Web Speech API (vitesse, tonalité, voix)
   - Affichage texte + pictogrammes
   - Surlignage pendant la lecture

## 🚀 Démarrage Rapide

### Prérequis

- Docker et Docker Compose
- (Optionnel) Clé API OpenAI pour la simplification LLM avancée

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/AurelienThery/EchoVox.git
   cd EchoVox
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env et ajouter votre OPENAI_API_KEY (optionnel)
   ```

3. **Lancer les services**
   ```bash
   docker-compose up --build
   ```

4. **Accéder à l'application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Python Service: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Premiers pas

1. Créer un compte via l'interface à http://localhost:5173/register
2. Créer un nouveau document
3. Le texte sera automatiquement simplifié (FALC)
4. Utiliser les contrôles vocaux pour écouter le texte
5. Voir les pictogrammes associés

## 📚 Documentation API

### Backend API (Rails)

#### Authentication

```bash
# Register
POST /auth/register
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Documents

```bash
# List documents
GET /documents
Authorization: Bearer <token>

# Get document
GET /documents/:id
Authorization: Bearer <token>

# Create document
POST /documents
Authorization: Bearer <token>
{
  "document": {
    "text": "Votre texte ici"
  },
  "auto_simplify": true,
  "locale": "fr"
}

# Simplify document
POST /documents/:id/simplify
Authorization: Bearer <token>
{
  "locale": "fr"
}

# Delete document
DELETE /documents/:id
Authorization: Bearer <token>
```

### Python Service API

```bash
# Simplify text
POST /simplify
{
  "text": "Votre texte complexe",
  "locale": "fr"
}

# Get pictograms
POST /pictograms
{
  "keywords": ["maison", "école", "livre"],
  "locale": "fr"
}
```

## 🎨 Fonctionnalités d'Accessibilité

### WCAG 2.1 AA Conformance

- ✅ Contraste des couleurs conforme
- ✅ Taille de police adaptable
- ✅ Navigation au clavier complète
- ✅ Focus visible sur tous les éléments interactifs
- ✅ Étiquettes ARIA appropriées
- ✅ Structure sémantique HTML
- ✅ Support du mode contraste élevé
- ✅ Support de la réduction des mouvements
- ✅ Cibles tactiles minimum 44x44px

### Web Speech API

- **Vitesse**: 0.5x à 2x
- **Tonalité**: 0 à 2
- **Volume**: 0% à 100%
- **Sélection de voix**: Toutes les voix disponibles
- **Genre de voix**: Automatiquement détecté
- **Surlignage**: Mot en cours de lecture

### Simplification FALC

- Phrases courtes et simples
- Vocabulaire courant
- Voix active
- Une idée par phrase
- Exemples concrets

## 🛠️ Développement

### Structure du Projet

#### Backend (Rails)
```
backend/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── authentication_controller.rb
│   │   └── documents_controller.rb
│   └── models/
│       ├── user.rb
│       └── document.rb
├── config/
├── db/
│   └── migrate/
└── lib/
```

#### Python Service
```
python-service/
├── app/
│   ├── main.py
│   └── services/
│       ├── text_simplifier.py
│       └── pictogram_service.py
└── requirements.txt
```

#### Frontend (React)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── DocumentList.jsx
│   │   ├── DocumentViewer.jsx
│   │   ├── CreateDocument.jsx
│   │   └── SpeechControls.jsx
│   ├── hooks/
│   │   └── useSpeechSynthesis.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── documentService.js
│   └── App.jsx
└── package.json
```

### Commandes de Développement

```bash
# Lancer en mode développement
docker-compose up

# Voir les logs
docker-compose logs -f [service]

# Arrêter les services
docker-compose down

# Rebuild un service
docker-compose up --build [service]

# Accéder à un container
docker-compose exec backend bash
docker-compose exec python-service bash
docker-compose exec frontend sh
```

### Backend Rails

```bash
# Console Rails
docker-compose exec backend bundle exec rails console

# Migrations
docker-compose exec backend bundle exec rails db:migrate

# Seeds
docker-compose exec backend bundle exec rails db:seed

# Tests
docker-compose exec backend bundle exec rspec
```

### Python Service

```bash
# Tests Python
docker-compose exec python-service pytest

# Accéder à Python shell
docker-compose exec python-service python
```

### Frontend React

```bash
# Installer dépendances
docker-compose exec frontend npm install

# Linter
docker-compose exec frontend npm run lint

# Build production
docker-compose exec frontend npm run build
```

## 🔒 Sécurité

- Authentification JWT
- Hachage bcrypt des mots de passe
- CORS configuré
- Variables d'environnement pour les secrets
- Validation des entrées
- Protection CSRF

## 🌍 Internationalisation

Langues supportées:
- Français (fr) - Par défaut
- Anglais (en)
- Espagnol (es)

## 📝 Licence

MIT License - voir LICENSE pour plus de détails

## 👥 Contribution

Les contributions sont les bienvenues! Voir CONTRIBUTING.md pour les guidelines.

## 🐛 Signaler un Bug

Ouvrir une issue sur GitHub avec:
- Description du bug
- Étapes pour reproduire
- Comportement attendu
- Captures d'écran si applicable

## 📞 Support

Pour toute question ou assistance:
- Ouvrir une issue sur GitHub
- Documentation: Voir /docs

---

**EchoVox** - Rendre la communication accessible à tous 🎙️♿
