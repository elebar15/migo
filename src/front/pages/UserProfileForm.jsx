import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    country: "",
    city: ""
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { lang } = useLanguage();
  const t = translations[lang] || translations.es;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async res => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) throw new Error("Invalid response: " + res.status);
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Unexpected response:", text);
          throw new Error("Response is not JSON");
        }
        return res.json();
      })
      .then(data => {
        setFormData({
          name: data.name || "",
          lastname: data.lastname || "",
          email: data.email || "",
          country: data.country || "",
          city: data.city || ""
        });
      })
      .catch(err => {
        console.error("Error loading user data:", err);
        setMessage({ text: t.user_data_load_err, type: "danger" });
      });
  }, [token, t]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = ({ target }) => {
    setFormData(prev => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error(t.update_data_err);
      setMessage({ text: t.user_data_updated, type: "success" });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: t.user_data_update_err, type: "danger" });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">{t.edit_profile_title}</h3>

        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="nameInput"
              name="name"
              placeholder={t.first_name_label}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="nameInput">{t.first_name_label}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="lastnameInput"
              name="lastname"
              placeholder={t.last_name_label}
              value={formData.lastname}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastnameInput">{t.last_name_label}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              name="email"
              placeholder={t.email}
              value={formData.email}
              disabled
            />
            <label htmlFor="emailInput">{t.email}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="countryInput"
              name="country"
              placeholder={t.country}
              value={formData.country}
              onChange={handleChange}
            />
            <label htmlFor="countryInput">{t.country}</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="cityInput"
              name="city"
              placeholder={t.city}
              value={formData.city}
              onChange={handleChange}
            />
            <label htmlFor="cityInput">{t.city}</label>
          </div>

          <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
            {t.save_changes}
          </button>
        </form>

        <div className="d-flex justify-content-center my-3">
          <button onClick={() => navigate("/profile")} className="btn btn-link text-dark text-decoration-none">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
