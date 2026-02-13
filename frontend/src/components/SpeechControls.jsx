import React, { useState } from 'react'
import './SpeechControls.css'

const SpeechControls = ({ speech, onStop }) => {
  const [showControls, setShowControls] = useState(false)

  const getVoiceGender = (voice) => {
    const name = voice.name.toLowerCase()
    if (name.includes('female') || name.includes('femme') || name.includes('woman')) {
      return 'Féminine'
    }
    if (name.includes('male') || name.includes('homme') || name.includes('man')) {
      return 'Masculine'
    }
    return 'Non spécifié'
  }

  return (
    <div className="speech-controls-container card" aria-label="Contrôles de lecture vocale">
      <div className="controls-header">
        <h3>Contrôles de Lecture Vocale</h3>
        <button
          onClick={() => setShowControls(!showControls)}
          className="toggle-button"
          aria-expanded={showControls}
          aria-controls="speech-controls-panel"
        >
          {showControls ? '▼ Masquer' : '▶ Afficher'}
        </button>
      </div>

      {showControls && (
        <div id="speech-controls-panel" className="controls-panel">
          {/* Voice Selection */}
          <div className="control-group">
            <label htmlFor="voice-select">
              Voix ({speech.voices.length} disponible{speech.voices.length > 1 ? 's' : ''})
            </label>
            <select
              id="voice-select"
              value={speech.selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = speech.voices.find((v) => v.name === e.target.value)
                speech.setSelectedVoice(voice)
              }}
              aria-describedby="voice-help"
            >
              {speech.voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang}) - {getVoiceGender(voice)}
                </option>
              ))}
            </select>
            <small id="voice-help" className="help-text">
              Choisissez la voix pour la lecture
            </small>
          </div>

          {/* Rate Control */}
          <div className="control-group">
            <label htmlFor="rate-slider">
              Vitesse: {speech.rate.toFixed(1)}x
            </label>
            <input
              id="rate-slider"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speech.rate}
              onChange={(e) => speech.setRate(parseFloat(e.target.value))}
              aria-valuemin="0.5"
              aria-valuemax="2"
              aria-valuenow={speech.rate}
              aria-label="Vitesse de lecture"
            />
            <div className="range-labels">
              <span>Lent (0.5x)</span>
              <span>Rapide (2x)</span>
            </div>
          </div>

          {/* Pitch Control */}
          <div className="control-group">
            <label htmlFor="pitch-slider">
              Tonalité: {speech.pitch.toFixed(1)}
            </label>
            <input
              id="pitch-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={speech.pitch}
              onChange={(e) => speech.setPitch(parseFloat(e.target.value))}
              aria-valuemin="0"
              aria-valuemax="2"
              aria-valuenow={speech.pitch}
              aria-label="Tonalité de la voix"
            />
            <div className="range-labels">
              <span>Grave (0)</span>
              <span>Aigu (2)</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="control-group">
            <label htmlFor="volume-slider">
              Volume: {Math.round(speech.volume * 100)}%
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={speech.volume}
              onChange={(e) => speech.setVolume(parseFloat(e.target.value))}
              aria-valuemin="0"
              aria-valuemax="1"
              aria-valuenow={speech.volume}
              aria-label="Volume de lecture"
            />
            <div className="range-labels">
              <span>Muet (0%)</span>
              <span>Maximum (100%)</span>
            </div>
          </div>

          {/* Playback Controls */}
          {speech.speaking && (
            <div className="playback-controls">
              <button
                onClick={speech.pause}
                className="control-button pause-button"
                aria-label="Mettre en pause"
              >
                ⏸ Pause
              </button>
              <button
                onClick={speech.resume}
                className="control-button resume-button"
                aria-label="Reprendre"
              >
                ▶ Reprendre
              </button>
              <button
                onClick={onStop}
                className="control-button stop-button"
                aria-label="Arrêter"
              >
                ⏹ Arrêter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SpeechControls
