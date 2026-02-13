const ARASAAC_BASE_URL = 'https://api.arasaac.org/api/pictograms';

/**
 * Fetches pictograms from ARASAAC API for a given term and language
 * @param {string} term - The search term
 * @param {string} locale - The language code (en, es, fr, de, it, pt)
 * @returns {Promise<Array>} Array of pictogram results
 */
export const searchPictograms = async (term, locale = 'en') => {
  try {
    const response = await fetch(`${ARASAAC_BASE_URL}/${locale}/search/${encodeURIComponent(term)}`);
    
    if (!response.ok) {
      throw new Error(`ARASAAC API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pictograms:', error);
    return [];
  }
};

/**
 * Gets the pictogram image URL
 * @param {number} pictogramId - The pictogram ID
 * @returns {string} The pictogram image URL
 */
export const getPictogramUrl = (pictogramId) => {
  return `${ARASAAC_BASE_URL}/${pictogramId}`;
};

/**
 * Fetches pictograms for multiple words
 * @param {Array<string>} words - Array of words to search
 * @param {string} locale - The language code
 * @returns {Promise<Object>} Object mapping words to pictogram arrays
 */
export const getPictogramsForWords = async (words, locale = 'en') => {
  const results = {};
  
  // Limit concurrent requests
  const batchSize = 5;
  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const promises = batch.map(async (word) => {
      const pictograms = await searchPictograms(word, locale);
      return { word, pictograms };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ word, pictograms }) => {
      results[word] = pictograms;
    });
  }
  
  return results;
};
