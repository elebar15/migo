import React from "react";

const supportedLanguages = ["en", "es", "fr"];

const LanguageSwitcher = ({ language, setLanguage }) => {
  const handleChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    sessionStorage.setItem("lang", lang); // persist choice
  };

  return (
    <select value={language} onChange={handleChange} className="form-select" style={{width: "5em"}}>
      {supportedLanguages.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;