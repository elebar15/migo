import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
    >
      <option value="en">En</option>
      <option value="es">Es</option>
      <option value="fr">Fr</option>
    </select>
  );
}

export default LanguageSwitcher;