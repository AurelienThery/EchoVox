import { useState, useEffect } from 'react';
import SpeechController from './components/SpeechController';
import LanguageSelector from './components/LanguageSelector';
import PictogramDisplay from './components/PictogramDisplay';
import { processDocument, login, register, logout, getAuthToken } from './services/apiService';
import './App.css';

const LANGUAGES = [
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'es', label: 'Español', locale: 'es-ES' },
  { code: 'fr', label: 'Français', locale: 'fr-FR' },
  { code: 'de', label: 'Deutsch', locale: 'de-DE' },
  { code: 'it', label: 'Italiano', locale: 'it-IT' },
  { code: 'pt', label: 'Português', locale: 'pt-PT' },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const result = await login(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.data.error || 'Login failed');
      }
    } catch (error) {
      setAuthError('An error occurred during login');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const result = await register(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.data.status?.message || 'Registration failed');
      }
    } catch (error) {
      setAuthError('An error occurred during registration');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setInputText('');
    setSimplifiedText('');
  };

  const handleProcess = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await processDocument(inputText, selectedLanguage.code);
      
      if (result.status === 'success') {
        setSimplifiedText(result.document.simplified_content || inputText);
      } else {
        setError('Failed to process text. Using original text.');
        setSimplifiedText(inputText);
      }
    } catch (err) {
      console.error('Error processing document:', err);
      setError('Failed to process text. Using original text.');
      setSimplifiedText(inputText);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>🎤 EchoVox</h1>
          <p className="subtitle">Text Simplification & Speech Synthesis</p>
          
          <div className="auth-tabs">
            <button
              className={showAuthForm === 'login' ? 'active' : ''}
              onClick={() => setShowAuthForm('login')}
            >
              Login
            </button>
            <button
              className={showAuthForm === 'register' ? 'active' : ''}
              onClick={() => setShowAuthForm('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={showAuthForm === 'login' ? handleLogin : handleRegister}>
            {authError && <div className="error-message">{authError}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              {showAuthForm === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎤 EchoVox</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="input-section">
            <div className="section-header">
              <h2>Text Input</h2>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
            
            <textarea
              className="text-input"
              rows="6"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <button
              className="btn btn-primary btn-large"
              onClick={handleProcess}
              disabled={processing || !inputText.trim()}
            >
              {processing ? 'Processing...' : 'Simplify & Prepare'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </section>

          {simplifiedText && (
            <>
              <section className="speech-section">
                <h2>Text to Speech</h2>
                <SpeechController
                  text={simplifiedText}
                  language={selectedLanguage.locale}
                />
              </section>

              <section className="pictogram-section">
                <PictogramDisplay
                  text={simplifiedText}
                  language={selectedLanguage.code}
                />
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          EchoVox - Making text accessible through simplification, speech synthesis, and pictograms
        </p>
      </footer>
    </div>
  );
}

export default App;
