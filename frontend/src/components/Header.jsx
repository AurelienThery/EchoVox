import React from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import './Header.css'

const Header = ({ onLogout }) => {
  const user = authService.getCurrentUser()

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>EchoVox</h1>
        </Link>
        
        <nav className="nav" role="navigation" aria-label="Navigation principale">
          <Link to="/" className="nav-link">
            Mes Documents
          </Link>
          <Link to="/document/new" className="nav-link">
            Nouveau Document
          </Link>
        </nav>

        <div className="user-section">
          <span className="user-name">{user?.name}</span>
          <button onClick={onLogout} className="logout-button" aria-label="Se déconnecter">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
