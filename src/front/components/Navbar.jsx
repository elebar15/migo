import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("");
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container d-flex justify-content-between align-items-center">
                <Link to="/" className="navbar-brand mb-0 h1">
                    Migo
                </Link>

                {localStorage.getItem("token") && (
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                )}
            </div>
        </nav>
    );
};
