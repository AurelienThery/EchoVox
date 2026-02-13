import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { documentService } from '../services/documentService'
import './DocumentList.css'

const DocumentList = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const data = await documentService.getAll()
      setDocuments(data)
    } catch (err) {
      setError('Erreur lors du chargement des documents')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await documentService.delete(id)
        setDocuments(documents.filter((doc) => doc.id !== id))
      } catch (err) {
        setError('Erreur lors de la suppression')
        console.error(err)
      }
    }
  }

  if (loading) {
    return <div className="loading-message">Chargement...</div>
  }

  return (
    <div className="document-list-container">
      <div className="list-header">
        <h2>Mes Documents</h2>
        <Link to="/document/new" className="new-document-button">
          Nouveau Document
        </Link>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="empty-state card">
          <p>Aucun document. Créez votre premier document !</p>
          <Link to="/document/new" className="new-document-button">
            Créer un document
          </Link>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((document) => (
            <div key={document.id} className="document-card card">
              <div className="document-content">
                <p className="document-text">
                  {document.text.substring(0, 150)}
                  {document.text.length > 150 ? '...' : ''}
                </p>
                {document.simplified && (
                  <p className="document-simplified">
                    <strong>Simplifié:</strong> {document.simplified.substring(0, 100)}...
                  </p>
                )}
              </div>
              
              <div className="document-actions">
                <Link
                  to={`/document/${document.id}`}
                  className="view-button"
                  aria-label={`Voir le document`}
                >
                  Voir
                </Link>
                <button
                  onClick={() => handleDelete(document.id)}
                  className="delete-button"
                  aria-label={`Supprimer le document`}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentList
