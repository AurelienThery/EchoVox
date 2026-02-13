import { useState } from 'react';
import { searchPictograms, getPictogramUrl } from '../services/arasaacService';
import './PictogramDisplay.css';

const PictogramDisplay = ({ text, language = 'en' }) => {
  const [pictograms, setPictograms] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPictograms = async () => {
    if (!text) return;
    
    setLoading(true);
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))];
    
    const results = {};
    
    // Fetch pictograms for key words (nouns, verbs)
    // For simplicity, we'll fetch for all unique words
    for (const word of uniqueWords.slice(0, 10)) { // Limit to first 10 unique words
      try {
        const pictos = await searchPictograms(word, language);
        if (pictos && pictos.length > 0) {
          results[word] = pictos[0]; // Use first result
        }
      } catch (error) {
        console.error(`Error fetching pictogram for ${word}:`, error);
      }
    }
    
    setPictograms(results);
    setLoading(false);
  };

  return (
    <div className="pictogram-display">
      <div className="pictogram-header">
        <h3>Pictograms</h3>
        <button 
          onClick={fetchPictograms} 
          className="btn btn-primary"
          disabled={loading || !text}
        >
          {loading ? 'Loading...' : 'Load Pictograms'}
        </button>
      </div>
      
      {Object.keys(pictograms).length > 0 && (
        <div className="pictogram-grid">
          {Object.entries(pictograms).map(([word, pictogram]) => (
            <div key={word} className="pictogram-item">
              <img 
                src={getPictogramUrl(pictogram._id)} 
                alt={word}
                className="pictogram-image"
              />
              <p className="pictogram-label">{word}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PictogramDisplay;
