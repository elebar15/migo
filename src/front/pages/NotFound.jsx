import React from "react";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.es;
  return (
    <div className="container mt-5 text-center">
      <h1>Error 404</h1>
      <p>{t.e404}</p>
    </div>
  );
};

export default NotFound;