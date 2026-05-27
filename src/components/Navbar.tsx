import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdmin } from "../pages/services/authUtils";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    function handleLogout() {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/login");
    }

    function isActive(path: string) {
        return location.pathname === path
            ? "nav-link active"
            : "nav-link";
    }

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand">
                    <span className="brand-mark">J</span>
                    <span>JoinUp</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className={isActive("/")}>
                        Home
                    </Link>

                    {token && (
                        <>
                            <Link to="/create-event" className={isActive("/create-event")}>
                                Create
                            </Link>

                            <Link to="/joined-events" className={isActive("/joined-events")}>
                                Joined
                            </Link>

                            <Link to="/my-events" className={isActive("/my-events")}>
                                My Events
                            </Link>

                            {isAdmin() && (
                                <Link to="/admin" className={isActive("/admin")}>
                                    Admin
                                </Link>
                            )}
                        </>
                    )}

                    {!token ? (
                        <>
                            <Link to="/login" className="nav-btn nav-btn-light">
                                Login
                            </Link>

                            <Link to="/register" className="nav-btn nav-btn-primary">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <button className="nav-logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;