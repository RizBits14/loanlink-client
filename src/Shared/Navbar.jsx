import { NavLink, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import useAuth from "../Hooks/useAuth";
import logo from "../assets/logo.png";

const getInitialTheme = () => localStorage.getItem("theme") || "light";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);
    const location = useLocation();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme(prev => (prev === "light" ? "dark" : "light"));

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = async () => {
        await logout();
        closeMenu();
    };

    const navLinkClass = (path) =>
        `transition duration-300 hover:text-primary ${location.pathname === path
            ? "text-primary font-semibold border-b-2 border-primary"
            : ""
        }`;

    return (
        <header className="bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="LoanLink" className="w-10 h-10" />
                    <span className="text-2xl font-bold text-primary tracking-wide">
                        LoanLink
                    </span>
                </Link>

                <nav className="hidden lg:flex items-center gap-8 text-lg font-medium">
                    <NavLink to="/" className={() => navLinkClass("/")}>Home</NavLink>
                    <NavLink to="/loans" className={() => navLinkClass("/loans")}>All Loans</NavLink>

                    {user && (
                        <NavLink to="/dashboard" className={() => navLinkClass("/dashboard")}>
                            Dashboard
                        </NavLink>
                    )}

                    {!user && (
                        <>
                            <NavLink to="/about" className={() => navLinkClass("/about")}>About</NavLink>
                            <NavLink to="/contact" className={() => navLinkClass("/contact")}>Contact</NavLink>
                        </>
                    )}
                </nav>

                <div className="hidden lg:flex items-center gap-4">

                    <button onClick={toggleTheme} className="text-xl transition-all">
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {!user ? (
                        <>
                            <NavLink to="/login" className="btn btn-outline btn-primary btn-sm">
                                Login
                            </NavLink>
                            <NavLink to="/register" className="btn btn-primary btn-sm">
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <img
                                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                                alt="User"
                                title={user.displayName}
                                className="w-9 h-9 rounded-full border"
                            />
                            <button
                                onClick={handleLogout}
                                className="btn btn-error btn-sm text-white"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="lg:hidden text-3xl"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            <div
                className={`lg:hidden bg-base-100 transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col px-6 py-6 gap-5 font-medium">

                    {user && (
                        <div className="flex items-center gap-3 pb-4 border-b">
                            <img
                                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                                alt="User"
                                className="w-12 h-12 rounded-full border"
                            />
                            <div>
                                <p className="font-semibold">
                                    {user.displayName || "User"}
                                </p>
                                <p className="text-sm opacity-70">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    <NavLink to="/" onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/loans" onClick={closeMenu}>All Loans</NavLink>

                    {user && (
                        <NavLink to="/dashboard" onClick={closeMenu}>
                            Dashboard
                        </NavLink>
                    )}

                    {!user && (
                        <>
                            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
                        </>
                    )}

                    <div className="divider"></div>

                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost justify-start"
                    >
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </button>

                    {!user ? (
                        <>
                            <NavLink to="/login" onClick={closeMenu} className="btn btn-outline btn-primary w-full">
                                Login
                            </NavLink>
                            <NavLink to="/register" onClick={closeMenu} className="btn btn-primary w-full">
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="btn btn-error w-full text-white"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
