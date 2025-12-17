import { NavLink } from "react-router";
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

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    const closeMenu = () => setMenuOpen(false);

    const navLinks = (
        <>
            <NavLink to="/" onClick={closeMenu} className="hover:text-primary">
                Home
            </NavLink>
            <NavLink to="/loans" onClick={closeMenu} className="hover:text-primary">
                All Loans
            </NavLink>
            <NavLink to="/about" onClick={closeMenu} className="hover:text-primary">
                About
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu} className="hover:text-primary">
                Contact
            </NavLink>
        </>
    );

    return (
        <header className="bg-base-100 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                <NavLink to="/" className="flex items-center gap-2">
                    <img src={logo} alt="LoanLink Logo" className="w-9 h-9" />
                    <span className="text-xl font-bold text-primary tracking-wide">
                        LoanLink
                    </span>
                </NavLink>

                <nav className="hidden lg:flex items-center gap-6 font-medium">
                    {navLinks}
                </nav>

                <div className="hidden lg:flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost btn-sm text-lg"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="btn btn-outline btn-primary btn-sm">
                                Dashboard
                            </NavLink>
                            <button className="btn btn-error btn-sm text-white">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn btn-outline btn-primary btn-sm">
                                Login
                            </NavLink>
                            <NavLink to="/register" className="btn btn-primary btn-sm">
                                Register
                            </NavLink>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="lg:hidden text-2xl"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            <div
                className={`lg:hidden bg-base-100 shadow-md transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col px-6 py-4 gap-4 font-medium">

                    {navLinks}

                    <div className="divider"></div>

                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost justify-start"
                    >
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </button>

                    {user ? (
                        <>
                            <NavLink to="/dashboard" onClick={closeMenu} className="btn btn-outline btn-primary">
                                Dashboard
                            </NavLink>
                            <button className="btn btn-error text-white">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={closeMenu} className="btn btn-outline btn-primary">
                                Login
                            </NavLink>
                            <NavLink to="/register" onClick={closeMenu} className="btn btn-primary">
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
