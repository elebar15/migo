import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import logo from "../assets/img/logo-migo-claro.png";

const Login = () => {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);

        navigate("/home");
      } else {
        alert(data.msg || t.login_error);
      }
    } catch (error) {
      console.error(error);
      alert(t.server_error);
    }
  };

  return (
    <div className="login-body">
      <div className="py-5 text-center">
        <img src={logo} alt="Migo logo" className="my-logo" />
      </div>

      <div className="d-flex justify-content-center">
        <div className="p-4 bg-yellow rounded shadow aut-form">
          <h3 className="text-center mb-4">{t.login_title}</h3>

          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>{t.email}</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>{t.password}</label>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-bold bg-secondary"
            >
              {t.login_button}
            </button>
          </form>

          <div className="d-flex justify-content-between mt-3 small">
            <Link to="/register">{t.no_account}</Link>
            <Link to="/recovery-password">{t.forgot_password}</Link>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <LanguageSwitcher language={lang} setLanguage={setLang} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
