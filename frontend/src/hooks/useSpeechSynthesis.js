import { useState, useEffect, useCallback } from 'react'

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  // Speech settings
  const [rate, setRate] = useState(1) // 0.1 to 10
  const [pitch, setPitch] = useState(1) // 0 to 2
  const [volume, setVolume] = useState(1) // 0 to 1
  const [selectedVoice, setSelectedVoice] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        
        // Select French voice by default if available
        const frenchVoice = availableVoices.find((voice) =>
          voice.lang.startsWith('fr')
        )
        if (frenchVoice && !selectedVoice) {
          setSelectedVoice(frenchVoice)
        }
      }

      loadVoices()
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [selectedVoice])

  const speak = useCallback(
    (text, onBoundary) => {
      if (!supported) {
        console.error('Speech synthesis not supported')
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.onstart = () => {
        setSpeaking(true)
      }

      utterance.onend = () => {
        setSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setSpeaking(false)
      }

      // Word boundary event for highlighting
      if (onBoundary) {
        utterance.onboundary = (event) => {
          onBoundary(event)
        }
      }

      window.speechSynthesis.speak(utterance)
    },
    [supported, rate, pitch, volume, selectedVoice]
  )

  const pause = useCallback(() => {
    if (supported && speaking) {
      window.speechSynthesis.pause()
    }
  }, [supported, speaking])

  const resume = useCallback(() => {
    if (supported) {
      window.speechSynthesis.resume()
    }
  }, [supported])

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [supported])

  return {
    speak,
    pause,
    resume,
    cancel,
    speaking,
    supported,
    voices,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    selectedVoice,
    setSelectedVoice,
  }
}
