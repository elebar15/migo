import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaHeart,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTrash,
  FaLock,
} from "react-icons/fa";
import { translations } from "../services/translations";

export const Profile = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [language, setLanguage] = useState(sessionStorage.getItem("lang") || "es");
  const t = translations[language];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm p-4 profile-card">
        <h2 className="text-center mb-4">{ t.profile }</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/profile-form")}>
            <FaUserEdit className="icon" />
            { t.data }
          </li>
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/password-update")}>
            <FaLock className="icon" />
            { t.pwd_update }
          </li>
          {/* <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/siempre-conmigo")}>
            <FaHeart className="icon" />
            Siempre conMigo
          </li> */}
          {/* <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/faqs")}>
            <FaQuestionCircle className="icon" />
            FAQs
          </li> */}
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt className="icon" />
            { t.logoff }
          </li>
          <li
            className="list-group-item d-flex align-items-center option-item"
            onClick={() => handleNavigate("/eliminar-cuenta")}
            style={{ color: "#e57373" }}
          >
            <FaTrash className="me-2" style={{ color: "#e57373" }} />
            { t.erase_profile }
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{ t.sure_ }</h5>
                <button type="button" className="close btn" onClick={() => setShowLogoutModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{ t.end_session_}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>{ t.cancel }</button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>{ t.end_session }</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
