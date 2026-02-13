import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { documentService } from '../services/documentService'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import SpeechControls from './SpeechControls'
import './DocumentViewer.css'

const DocumentViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const textRef = useRef(null)

  const speech = useSpeechSynthesis()

  useEffect(() => {
    loadDocument()
  }, [id])

  const loadDocument = async () => {
    try {
      const data = await documentService.getById(id)
      setDocument(data)
    } catch (err) {
      setError('Document non trouvé')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSimplify = async () => {
    setLoading(true)
    try {
      const updated = await documentService.simplify(id, 'fr')
      setDocument(updated)
    } catch (err) {
      setError('Erreur lors de la simplification')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSpeak = (textToSpeak) => {
    if (!textToSpeak) return

    const words = textToSpeak.split(' ')
    let currentIndex = 0

    speech.speak(textToSpeak, (event) => {
      // Track word boundaries for highlighting
      if (event.name === 'word') {
        setCurrentWordIndex(currentIndex)
        currentIndex++
      }
    })
  }

  const handleStop = () => {
    speech.cancel()
    setCurrentWordIndex(-1)
  }

  if (loading) {
    return <div className="loading-message">Chargement...</div>
  }

  if (error || !document) {
    return (
      <div className="error-container card">
        <p className="error-message">{error || 'Document non trouvé'}</p>
        <button onClick={() => navigate('/')}>Retour à la liste</button>
      </div>
    )
  }

  const renderTextWithHighlight = (text) => {
    if (currentWordIndex < 0 || !speech.speaking) {
      return text
    }

    const words = text.split(' ')
    return words.map((word, index) => (
      <span
        key={index}
        className={index === currentWordIndex ? 'highlighted' : ''}
      >
        {word}{' '}
      </span>
    ))
  }

  return (
    <div className="document-viewer-container">
      <div className="document-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Retour
        </button>
        {!document.simplified && (
          <button onClick={handleSimplify} className="simplify-button">
            Simplifier le texte
          </button>
        )}
      </div>

      <div className="document-content card">
        <section aria-label="Texte original">
          <h3>Texte Original</h3>
          <div className="text-content" ref={textRef}>
            {renderTextWithHighlight(document.text)}
          </div>
          <button
            onClick={() => handleSpeak(document.text)}
            disabled={speech.speaking}
            className="speak-button"
            aria-label="Lire le texte original"
          >
            🔊 Lire le texte
          </button>
        </section>

        {document.simplified && (
          <section aria-label="Texte simplifié" className="simplified-section">
            <h3>Texte Simplifié (FALC)</h3>
            <div className="text-content simplified-text">
              {renderTextWithHighlight(document.simplified)}
            </div>
            <button
              onClick={() => handleSpeak(document.simplified)}
              disabled={speech.speaking}
              className="speak-button"
              aria-label="Lire le texte simplifié"
            >
              🔊 Lire le texte simplifié
            </button>
          </section>
        )}

        {document.pictos_json && document.pictos_json.length > 0 && (
          <section aria-label="Pictogrammes" className="pictograms-section">
            <h3>Pictogrammes</h3>
            <div className="pictograms-grid">
              {document.pictos_json.map((picto, index) => (
                <div key={index} className="pictogram-item">
                  <img
                    src={picto.url}
                    alt={picto.text || picto.keyword}
                    className="pictogram-image"
                  />
                  <span className="pictogram-label">{picto.text || picto.keyword}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {speech.supported && (
        <SpeechControls
          speech={speech}
          onStop={handleStop}
        />
      )}
    </div>
  )
}

export default DocumentViewer
