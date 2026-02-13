import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import DocumentList from './components/DocumentList'
import DocumentViewer from './components/DocumentViewer'
import CreateDocument from './components/CreateDocument'
import { authService } from './services/authService'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = authService.getToken()
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        
        {isAuthenticated && <Header onLogout={handleLogout} />}
        
        <main id="main-content" className="container">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Register onRegister={handleLogin} />
              } 
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <DocumentList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/document/new"
              element={
                isAuthenticated ? <CreateDocument /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/document/:id"
              element={
                isAuthenticated ? <DocumentViewer /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
