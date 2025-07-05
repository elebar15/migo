import { Link, useNavigate } from "react-router-dom";
import logo1 from '../assets/img/logo-migo-claro.png';

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/");
    };

    return (
        <nav className="navbar bg-coral navbar-expand-lg fixed-top shadow-sm px-4 py-2 my-navbar">
            <div className="container-fluid">

                <Link to="/home" className="navbar-brand">
                    <img src={logo1} alt="Migo logo" height="40" />
                </Link>

                <div className="ms-auto d-flex align-items-center gap-4">
                    <Link to="/home" className="nav-icon text-decoration-none">
                        <i className="fa fa-home fs-5"></i>
                    </Link>
                    {/* <Link to="/profile" className="text-secondary text-decoration-none"> */}
                    {/* <i className="fas fa-user fs-5 nav-icon"></i> */}
                    {/* </Link> */}
                    <Link to="/consejos" className="nav-icon text-decoration-none">
                        <i className="fas fa-comments fs-5"></i>
                    </Link>
                    <button className="nav-icon text-decoration-none border-0 bg-transparent" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt fs-5"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};
