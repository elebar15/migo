import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/img/logo-migo-claro.png';
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

const initialStateUser = {
    name: "",
    lastname: "",
    email: "",
    password: ""
}

export function Register() {
    const [user, setUser] = useState(initialStateUser)
    const navigate = useNavigate()

    const { lang } = useLanguage();
    const t = translations[lang] || translations.es;

    function handleChange({ target }) {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const url = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${url}/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        if (response.status === 201) {
            setUser(initialStateUser)
            setTimeout(() => {
                navigate('/')
            }, 1000)
        } else if (response.status === 400) {
            alert(t.user_exists)
        } else {
            alert(t.uregister_err)
        }
    }


    return (
        <div className="login-body">

            <div className="py-5 text-center">
                <img src={logo} alt="Migo logo" className="my-logo" />
            </div>


            <div className="d-flex justify-content-center">
                <div className="p-4 bg-yellow rounded shadow aut-form">
                    <h3 className="text-center mb-4">{t.register_t}</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nameInput"
                                name="name"
                                placeholder={t.name}
                                value={user.name}
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
                                value={user.lastname}
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
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="emailInput">{t.email}</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                name="password"
                                placeholder={t.pwd}
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="passwordInput">{t.pwd}</label>
                        </div>

                        <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
                            {t.register}
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
}
