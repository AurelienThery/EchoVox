import './LanguageSelector.css';

const LANGUAGES = [
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'es', label: 'Español', locale: 'es-ES' },
  { code: 'fr', label: 'Français', locale: 'fr-FR' },
  { code: 'de', label: 'Deutsch', locale: 'de-DE' },
  { code: 'it', label: 'Italiano', locale: 'it-IT' },
  { code: 'pt', label: 'Português', locale: 'pt-PT' },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const handleChange = (event) => {
    const langCode = event.target.value;
    const language = LANGUAGES.find(lang => lang.code === langCode);
    onLanguageChange(language);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select">Language:</label>
      <select
        id="language-select"
        value={selectedLanguage.code}
        onChange={handleChange}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
