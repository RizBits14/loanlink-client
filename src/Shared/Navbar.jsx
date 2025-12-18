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
            <NavLink to="/" onClick={closeMenu} className="hover:text-primary transition duration-300">
                Home
            </NavLink>
            <NavLink to="/loans" onClick={closeMenu} className="hover:text-primary transition duration-300">
                All Loans
            </NavLink>
            <NavLink to="/about" onClick={closeMenu} className="hover:text-primary transition duration-300">
                About
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu} className="hover:text-primary transition duration-300">
                Contact
            </NavLink>
        </>
    );

    return (
        <header className="bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <NavLink to="/" className="flex items-center gap-2">
                    <img src={logo} alt="LoanLink Logo" className="w-10 h-10" />
                    <span className="text-2xl font-bold text-primary tracking-wide">
                        LoanLink
                    </span>
                </NavLink>

                <nav className="hidden lg:flex items-center gap-8 text-lg font-medium">
                    {navLinks}
                </nav>

                <div className="hidden lg:flex items-center gap-6">
                    <button onClick={toggleTheme} className="text-xl transition-all duration-300 cursor-pointer">
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
                    className="lg:hidden text-3xl"
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            <div
                className={`lg:hidden bg-base-100 transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="flex flex-col px-6 py-4 gap-6 font-medium">
                    {navLinks}

                    <div className="divider my-4"></div>

                    <button onClick={toggleTheme} className="btn btn-ghost justify-start transition-all duration-300">
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </button>

                    {user ? (
                        <>
                            <NavLink to="/dashboard" onClick={closeMenu} className="btn btn-outline btn-primary">
                                Dashboard
                            </NavLink>
                            <button className="btn btn-error text-white" onClick={closeMenu}>
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
