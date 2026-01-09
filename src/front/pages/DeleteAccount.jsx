import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

export const DeleteAccount = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const { lang } = useLanguage();
  const t = translations[lang] || translations.es;

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(t.user_not_elim);

      localStorage.removeItem("token");
      setMessage({ type: "success", text: t.user_elim });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage({ type: "danger", text: t.user_not_elim });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
      <div className="green-light rounded shadow p-4 back-login w-100 text-center" style={{ maxWidth: "500px" }}>
        <h2 className="mb-3">{t.del_account}</h2>
        <p className="mb-4">{t.sure_del_account_}</p>
        <button className="btn btn-danger fw-bold" onClick={() => setShowModal(true)}>
          {t.sure_del_account}
        </button>

        <div className="mt-3">
          <button className="btn btn-outline-dark" onClick={() => navigate("/profile")}>
            {t.cancel}
          </button>
        </div>

        {message && (
          <div className={`alert alert-${message.type} mt-4`} role="alert">
            {message.text}
          </div>
        )}

        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t.confirm}</h5>
                  <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>{t.del_all}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t.cancel}</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>{t.del_account}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
