import { NavLink, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";

const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light";
};

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);
    const user = null;
    const location = useLocation();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const closeMenu = () => setMenuOpen(false);

    const navLinkClass = (path) =>
        `transition duration-300 hover:text-primary ${location.pathname === path
            ? "text-primary font-semibold border-b-2 border-primary"
            : ""
        }`;

    return (
        <header className="bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2">
                    <img src={logo} alt="LoanLink Logo" className="w-10 h-10" />
                    <span className="text-2xl font-bold text-primary tracking-wide">LoanLink</span>
                </NavLink>

                <nav className="hidden lg:flex items-center gap-8 text-lg font-medium">
                    <NavLink to="/" className={navLinkClass("/")}>Home</NavLink>
                    <NavLink to="/loans" className={navLinkClass("/loans")}>All Loans</NavLink>
                    <NavLink to="/about" className={navLinkClass("/about")}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass("/contact")}>Contact</NavLink>
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    <button onClick={toggleTheme} className="text-xl transition-all duration-300">
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="btn btn-outline btn-primary btn-sm">Dashboard</NavLink>
                            <button className="btn btn-error btn-sm text-white">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn btn-outline btn-primary btn-sm">Login</NavLink>
                            <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
                        </>
                    )}
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-3xl">
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            <div
                className={`lg:hidden bg-base-100 transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col px-6 py-6 gap-5 font-medium">
                    <NavLink to="/" onClick={closeMenu} className={navLinkClass("/")}>Home</NavLink>
                    <NavLink to="/loans" onClick={closeMenu} className={navLinkClass("/loans")}>All Loans</NavLink>
                    <NavLink to="/about" onClick={closeMenu} className={navLinkClass("/about")}>About</NavLink>
                    <NavLink to="/contact" onClick={closeMenu} className={navLinkClass("/contact")}>Contact</NavLink>

                    <div className="divider"></div>

                    <button onClick={toggleTheme} className="btn btn-ghost justify-start">
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </button>

                    {user ? (
                        <>
                            <NavLink to="/dashboard" onClick={closeMenu} className="btn btn-outline btn-primary w-full">Dashboard</NavLink>
                            <button className="btn btn-error w-full text-white" onClick={closeMenu}>Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={closeMenu} className="btn btn-outline btn-primary w-full">Login</NavLink>
                            <NavLink to="/register" onClick={closeMenu} className="btn btn-primary w-full">Register</NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
