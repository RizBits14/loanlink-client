/* eslint-disable no-unused-vars */
import { NavLink, Outlet } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import ScrollToTop from "../Shared/ScrollToTop";

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role } = useUserRole();

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
     ${isActive
            ? "bg-primary text-white shadow-md"
            : "hover:bg-base-300 text-base-content"
        }`;

    return (
        <div className="min-h-screen flex flex-col bg-base-200">

            <Navbar />
            <ScrollToTop></ScrollToTop>

            <div className="flex flex-1">

                <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r shadow-lg sticky top-18 h-[calc(100vh-72px)]">

                    <div className="px-6 py-5 border-b">
                        <h2 className="text-2xl font-bold text-primary">
                            Dashboard
                        </h2>
                        <p className="text-sm opacity-70 mt-1">
                            {role?.toUpperCase()} PANEL
                        </p>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

                        <NavLink to="/dashboard" end className={linkClass}>
                            📊 Overview
                        </NavLink>

                        {role === "admin" && (
                            <>
                                <p className="mt-6 mb-2 px-2 text-xs uppercase opacity-60">
                                    Admin Controls
                                </p>
                                <NavLink to="/dashboard/manage-users" className={linkClass}>
                                    👥 Manage Users
                                </NavLink>
                                <NavLink to="/dashboard/all-loan" className={linkClass}>
                                    📄 All Loans
                                </NavLink>
                                <NavLink to="/dashboard/loan-applications" className={linkClass}>
                                    📝 Loan Applications
                                </NavLink>
                            </>
                        )}

                        {role === "manager" && (
                            <>
                                <p className="mt-6 mb-2 px-2 text-xs uppercase opacity-60">
                                    Loan Management
                                </p>
                                <NavLink to="/dashboard/add-loan" className={linkClass}>
                                    ➕ Add Loan
                                </NavLink>
                                <NavLink to="/dashboard/manage-loans" className={linkClass}>
                                    ⚙️ Manage Loans
                                </NavLink>
                                <NavLink to="/dashboard/pending-loans" className={linkClass}>
                                    ⏳ Pending Applications
                                </NavLink>
                                <NavLink to="/dashboard/approved-loans" className={linkClass}>
                                    ✅ Approved Applications
                                </NavLink>
                            </>
                        )}

                        {role === "borrower" && (
                            <>
                                <p className="mt-6 mb-2 px-2 text-xs uppercase opacity-60">
                                    My Area
                                </p>
                                <NavLink to="/dashboard/my-loans" className={linkClass}>
                                    💳 My Loans
                                </NavLink>
                            </>
                        )}

                        <p className="mt-6 mb-2 px-2 text-xs uppercase opacity-60">
                            Account
                        </p>
                        <NavLink to="/dashboard/profile" className={linkClass}>
                            👤 My Profile
                        </NavLink>

                    </nav>
                </aside>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">

                    <div className="bg-base-100 rounded-2xl shadow-xl p-6 min-h-[calc(100vh-180px)]">
                        <Outlet />
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardLayout;
