import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from '../assets/img/logo-migo-claro.png';
import { translations } from "../services/translations";

export const PasswordUpdate = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState(null); 
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const [language, setLanguage] = useState(sessionStorage.getItem("lang") || "es");
    const t = translations[language];

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000); 
            return () => clearTimeout(timer); 
        }
    }, [message]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const passwordToSend = String(newPassword);
        const url = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${url}/update-password`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${searchParams.get("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: passwordToSend }),
            });

            if (response.ok) {
                setMessage({ type: "success", text: t.pwd_updated });
                    setTimeout(() => {
                    navigate("/"); 
                }, 2000); 

            } else if (!passwordToSend) {
                setMessage({ type: "danger", text: t.need_pwd });
            } else {
                setMessage({ type: "danger", text: t.pwd_chg_err });
            }
        } catch {
            setMessage({ type: "danger", text: t.pwd_chg_err });
        }
    };

    return (
        <div className="container-fluid login-body">
            <div className="row justify-content-center">
                <div className="py-5 text-center">
                    <img src={logo} alt="Migo logo" className="my-logo" />
                </div>

                <div className="col-4 p-4 bg-yellow rounded">
                    <h3 className="text-center mb-4">{ t.pwd_update }</h3>

                    {message && (
                        <div className={`alert alert-${message.type}`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form
                        className="m-2 p-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="btnPassword"
                                name="newPassword"
                                placeholder={ t.new_pwd }
                                onChange={(event) => setNewPassword(event.target.value)}
                                value={newPassword}
                            />
                        </div>

                        <button
                            className="btn w-100 text-white fw-bold bg-secondary"
                        >{ t.pwd_update }</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
