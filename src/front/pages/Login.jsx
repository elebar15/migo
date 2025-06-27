import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                navigate("/home");
            } else {
                alert(data.msg || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error en el servidor");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3">Iniciar Sesión</h2>
                <div className="col-12 col-md-6">
                    <form className="border rounded m-2 p-4" onSubmit={handleLogin}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="emailInput">Correo</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                placeholder="contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="passwordInput">Contraseña</label>
                        </div>

                        <button type="submit" className="btn btn-outline-primary w-100">Ingresar</button>
                    </form>

                    <div className="d-flex justify-content-between my-3 px-2">
                        <Link to="/register">No tengo cuenta</Link>
                        <Link to="/recovery-password">¿Olvidaste tu contraseña?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
