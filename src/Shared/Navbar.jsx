import { NavLink, Link, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import useAuth from "../Hooks/useAuth";
import logo from "../assets/logo.png";

const getInitialTheme = () => localStorage.getItem("theme") || "light";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setBase = () => {
      gsap.set(header, {
        backdropFilter: "blur(14px)",
        backgroundColor:
          theme === "dark"
            ? "rgba(17,24,39,0.78)"
            : "rgba(255,255,255,0.82)",
        boxShadow:
          theme === "dark"
            ? "0 8px 30px rgba(0,0,0,0.55)"
            : "0 8px 30px rgba(15,23,42,0.10)",
      });
    };

    const setScrolled = () => {
      gsap.to(header, {
        backdropFilter: "blur(20px)",
        backgroundColor:
          theme === "dark"
            ? "rgba(17,24,39,0.92)"
            : "rgba(255,255,255,0.92)",
        boxShadow:
          theme === "dark"
            ? "0 14px 44px rgba(0,0,0,0.75)"
            : "0 14px 44px rgba(15,23,42,0.14)",
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const handleScroll = () => {
      if (window.scrollY > 40) setScrolled();
      else setBase();
    };

    setBase();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  const navLinkClass = (path) =>
    `relative px-1 py-2 transition-colors duration-300 ${
      location.pathname === path
        ? "text-[var(--primary)] font-semibold"
        : "text-base hover:text-[var(--primary-soft)]"
    }`;

  return (
    <Motion.header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-base"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <Motion.img
            src={logo}
            alt="LoanLink"
            className="w-10 h-10"
            whileHover={{ rotate: 8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          />
          <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
            LoanLink
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10 text-lg font-medium">
          <NavLink to="/" className={() => navLinkClass("/")}>
            Home
          </NavLink>
          <NavLink to="/loans" className={() => navLinkClass("/loans")}>
            All Loans
          </NavLink>

          {user && (
            <NavLink to="/dashboard" className={() => navLinkClass("/dashboard")}>
              Dashboard
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink to="/about" className={() => navLinkClass("/about")}>
                About
              </NavLink>
              <NavLink to="/contact" className={() => navLinkClass("/contact")}>
                Contact
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.08 }}
            onClick={toggleTheme}
            className="text-xl cursor-pointer select-none"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </Motion.button>

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="px-5 py-2 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <Motion.img
                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt="User"
                title={user.displayName}
                className="w-9 h-9 rounded-full border border-base object-cover"
                whileHover={{ scale: 1.08 }}
              />
              <Motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-[var(--danger)] text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Logout
              </Motion.button>
            </>
          )}
        </div>

        <Motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden text-3xl text-base"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </Motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-6 py-6 bg-surface border-t border-base flex flex-col gap-5 font-medium">
              {user && (
                <div className="flex items-center gap-3 pb-4 border-b border-base">
                  <img
                    src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt="User"
                    className="w-12 h-12 rounded-full border border-base object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.displayName || "User"}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                  </div>
                </div>
              )}

              <NavLink to="/" onClick={closeMenu} className="text-base">
                Home
              </NavLink>
              <NavLink to="/loans" onClick={closeMenu} className="text-base">
                All Loans
              </NavLink>

              {user && (
                <NavLink to="/dashboard" onClick={closeMenu} className="text-base">
                  Dashboard
                </NavLink>
              )}

              {!user && (
                <>
                  <NavLink to="/about" onClick={closeMenu} className="text-base">
                    About
                  </NavLink>
                  <NavLink to="/contact" onClick={closeMenu} className="text-base">
                    Contact
                  </NavLink>
                </>
              )}

              <div className="border-t border-base pt-4 flex flex-col gap-3">
                <button
                  onClick={toggleTheme}
                  className="text-left px-4 py-2 rounded-xl hover:bg-base transition-all duration-300"
                >
                  {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>

                {!user ? (
                  <>
                    <NavLink
                      to="/login"
                      onClick={closeMenu}
                      className="w-full px-5 py-2 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-center"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={closeMenu}
                      className="w-full px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-center"
                    >
                      Register
                    </NavLink>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-2 rounded-xl bg-[var(--danger)] text-white"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.header>
  );
};

export default Navbar;
