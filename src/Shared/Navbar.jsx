import { NavLink } from "react-router";

const Navbar = () => {
    const user = null;

    return (
        <nav className="navbar bg-base-100 shadow-md px-4">
            <div className="navbar-start">
                <NavLink to="/" className="text-xl font-bold">
                    LoanLink
                </NavLink>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-2">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/loans">All Loans</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                </ul>
            </div>

            <div className="navbar-end gap-2">
                {/* Theme toggle (logic later) */}
                <button className="btn btn-ghost">🌙</button>

                {user ? (
                    <>
                        <NavLink to="/dashboard" className="btn btn-outline">
                            Dashboard
                        </NavLink>
                        <button className="btn btn-error text-white">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="btn btn-outline">
                            Login
                        </NavLink>
                        <NavLink to="/register" className="btn btn-primary">
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
