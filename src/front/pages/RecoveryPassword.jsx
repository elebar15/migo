import { useState, useEffect } from "react";
import logo from '../assets/img/logo-migo-claro.png';
import { Link } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

export const RecoveryPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { lang } = useLanguage();
  const t = translations[lang] || translations.es;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    if (!isValidEmail) {
      alert(t.missing.email);
      return;
    }

    const url = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true);

      const response = await fetch(`${url}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: t.recovery_link_m });
      } else {
        setMessage({ type: "danger", text: data.message || t.recovery_err });
      }

    } catch (error) {
      setMessage({ type: "danger", text: t.recovery_err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="py-5 text-center">
        <img src={logo} alt="Migo logo" className="my-logo" />
      </div>

      <div className="d-flex justify-content-center">
        <div className="p-4 bg-yellow rounded shadow aut-form">
          <h3 className="text-center mb-4">{t.recover}</h3>

          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                placeholder={t.email}
                className="form-control"
                id="btnEmail"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                required
              />
              <label htmlFor="btnEmail">{t.email}</label>
            </div>

            <button
              className="btn w-100 text-white fw-bold bg-secondary"
              disabled={loading}
            >
              {loading ? t.sending : t.send_link}
            </button>
          </form>

          <div className="d-flex justify-content-center mt-3 small">
            <Link to="/" className="text-dark text-decoration-none">
              {t.back}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
