import { useState, useEffect, useRef } from 'react';
import './SpeechController.css';

const SpeechController = ({ text, language = 'en-US' }) => {
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Select default voice for the language
      const defaultVoice = availableVoices.find(voice => 
        voice.lang.startsWith(language.split('-')[0])
      );
      setSelectedVoice(defaultVoice || availableVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  // Split text into words
  useEffect(() => {
    if (text) {
      wordsRef.current = text.split(/\s+/).filter(word => word.length > 0);
    }
  }, [text]);

  const speak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.voice = selectedVoice;
    utterance.lang = language;

    // Word boundary event for highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const wordIndex = text.substring(0, charIndex).split(/\s+/).length - 1;
        setHighlightedWordIndex(wordIndex);
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightedWordIndex(-1);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setHighlightedWordIndex(-1);
  };

  const handleVoiceChange = (event) => {
    const voice = voices.find(v => v.name === event.target.value);
    setSelectedVoice(voice);
  };

  return (
    <div className="speech-controller">
      <div className="text-display">
        {wordsRef.current.map((word, index) => (
          <span
            key={index}
            className={index === highlightedWordIndex ? 'highlighted-word' : ''}
          >
            {word}{' '}
          </span>
        ))}
      </div>

      <div className="controls">
        <div className="control-buttons">
          {!isPlaying ? (
            <button onClick={speak} className="btn btn-primary">
              ▶️ Play
            </button>
          ) : isPaused ? (
            <button onClick={resume} className="btn btn-success">
              ▶️ Resume
            </button>
          ) : (
            <button onClick={pause} className="btn btn-warning">
              ⏸️ Pause
            </button>
          )}
          <button onClick={stop} className="btn btn-danger" disabled={!isPlaying}>
            ⏹️ Stop
          </button>
        </div>

        <div className="voice-selector">
          <label htmlFor="voice-select">Voice:</label>
          <select
            id="voice-select"
            value={selectedVoice?.name || ''}
            onChange={handleVoiceChange}
          >
            {voices
              .filter(voice => voice.lang.startsWith(language.split('-')[0]))
              .map((voice, index) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
          </select>
        </div>

        <div className="slider-control">
          <label htmlFor="rate-slider">
            Rate: {rate.toFixed(1)}
          </label>
          <input
            id="rate-slider"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>

        <div className="slider-control">
          <label htmlFor="pitch-slider">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            id="pitch-slider"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
          />
        </div>

        <div className="slider-control">
          <label htmlFor="volume-slider">
            Volume: {volume.toFixed(1)}
          </label>
          <input
            id="volume-slider"
            type="range"
            min="0.0"
            max="1.0"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default SpeechController;
