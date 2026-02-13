import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { documentService } from '../services/documentService'
import './CreateDocument.css'

const CreateDocument = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [autoSimplify, setAutoSimplify] = useState(true)
  const [locale, setLocale] = useState('fr')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const document = await documentService.create({
        text,
        auto_simplify: autoSimplify,
        locale,
      })
      navigate(`/document/${document.id}`)
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Erreur lors de la création')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-document-container">
      <div className="card">
        <h2>Nouveau Document</h2>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="text">
              Texte du document
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows="10"
              placeholder="Entrez votre texte ici..."
              aria-required="true"
              aria-describedby="text-help"
            />
            <small id="text-help" className="help-text">
              Le texte sera automatiquement simplifié en FALC si l'option est activée.
            </small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoSimplify}
                onChange={(e) => setAutoSimplify(e.target.checked)}
              />
              <span>Simplifier automatiquement le texte (FALC)</span>
            </label>
          </div>

          {autoSimplify && (
            <div className="form-group">
              <label htmlFor="locale">Langue</label>
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="submit-button"
            >
              {loading ? 'Création...' : 'Créer le document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDocument
