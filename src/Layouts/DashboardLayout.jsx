import { NavLink, Outlet } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { LayoutDashboard, Users, FileText, ClipboardList, PlusCircle, Settings, Hourglass, BadgeCheck, CreditCard, User, ShieldCheck } from "lucide-react";

import useAuth from "../Hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import ScrollToTop from "../Shared/ScrollToTop";

const IconWrap = ({ children }) => (
    <span
        className="grid h-9 w-9 place-items-center rounded-xl border"
        style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            boxShadow: "0 10px 28px color-mix(in oklab, var(--text) 10%, transparent)",
        }}
    >
        {children}
    </span>
);

const SectionLabel = ({ children }) => (
    <p className="mt-8 mb-2 px-2 text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
        {children}
    </p>
);

const SidebarLink = ({ to, end, label, icon, onClick }) => {
    const location = useMemo(() => window.location.pathname, []);
    const isActive = end ? location === to : location.startsWith(to);

    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive: navActive }) => {
                const active = navActive ?? isActive;
                return [
                    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300",
                    active ? "text-white" : "",
                ].join(" ");
            }}
            style={({ isActive: navActive }) => {
                const active = navActive ?? isActive;
                return active
                    ? {
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        boxShadow: "0 16px 40px color-mix(in oklab, var(--primary) 22%, transparent)",
                    }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--text)",
                    };
            }}
        >
            <span
                className="grid h-9 w-9 place-items-center rounded-xl border transition-all duration-300"
                style={{
                    borderColor: "var(--border)",
                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                }}
            >
                {icon}
            </span>
            <span className="text-sm font-semibold">{label}</span>
            <span
                className="ml-auto h-8 w-1 rounded-full opacity-0 transition-opacity duration-300"
                style={{ backgroundColor: "color-mix(in oklab, var(--secondary) 70%, transparent)" }}
            />
        </NavLink>
    );
};

const Sidebar = ({ role, onLinkClick, user }) => {
    const roleLabel = role ? role.toUpperCase() : "USER";

    return (
        <div className="flex h-full flex-col">
            <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                            Dashboard
                        </h2>
                        <p className="mt-1 text-xs font-semibold tracking-wider" style={{ color: "var(--muted)" }}>
                            {roleLabel} PANEL
                        </p>
                    </div>
                    <IconWrap>
                        <ShieldCheck size={18} style={{ color: "var(--secondary)" }} />
                    </IconWrap>
                </div>

                {user && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: "var(--border)" }}>
                        <img
                            src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                            alt="User"
                            className="h-10 w-10 rounded-xl border object-cover"
                            style={{ borderColor: "var(--border)" }}
                        />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold" style={{ color: "var(--text)" }}>
                                {user.displayName || "User"}
                            </p>
                            <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 px-4 py-6 overflow-y-auto">
                <SidebarLink
                    to="/dashboard"
                    end
                    label="Overview"
                    icon={<LayoutDashboard size={18} style={{ color: "var(--primary)" }} />}
                    onClick={onLinkClick}
                />

                {role === "admin" && (
                    <>
                        <SectionLabel>Admin controls</SectionLabel>
                        <SidebarLink
                            to="/dashboard/manage-users"
                            label="Manage Users"
                            icon={<Users size={18} style={{ color: "var(--primary)" }} />}
                            onClick={onLinkClick}
                        />
                        <SidebarLink
                            to="/dashboard/all-loan"
                            label="All Loans"
                            icon={<FileText size={18} style={{ color: "var(--primary)" }} />}
                            onClick={onLinkClick}
                        />
                        <SidebarLink
                            to="/dashboard/loan-applications"
                            label="Loan Applications"
                            icon={<ClipboardList size={18} style={{ color: "var(--primary)" }} />}
                            onClick={onLinkClick}
                        />
                    </>
                )}

                {role === "manager" && (
                    <>
                        <SectionLabel>Loan management</SectionLabel>
                        <SidebarLink
                            to="/dashboard/add-loan"
                            label="Add Loan"
                            icon={<PlusCircle size={18} style={{ color: "var(--primary)" }} />}
                            onClick={onLinkClick}
                        />
                        <SidebarLink
                            to="/dashboard/manage-loans"
                            label="Manage Loans"
                            icon={<Settings size={18} style={{ color: "var(--primary)" }} />}
                            onClick={onLinkClick}
                        />
                        <SidebarLink
                            to="/dashboard/pending-loans"
                            label="Pending Applications"
                            icon={<Hourglass size={18} style={{ color: "var(--warning)" }} />}
                            onClick={onLinkClick}
                        />
                        <SidebarLink
                            to="/dashboard/approved-loans"
                            label="Approved Applications"
                            icon={<BadgeCheck size={18} style={{ color: "var(--success)" }} />}
                            onClick={onLinkClick}
                        />
                    </>
                )}

                {role === "borrower" && (
                    <>
                        <SectionLabel>My area</SectionLabel>
                        <SidebarLink
                            to="/dashboard/my-loans"
                            label="My Loans"
                            icon={<CreditCard size={18} style={{ color: "var(--primary)" }} />}
                            onClick={onLinkClick}
                        />
                    </>
                )}

                <SectionLabel>Account</SectionLabel>
                <SidebarLink
                    to="/dashboard/profile"
                    label="My Profile"
                    icon={<User size={18} style={{ color: "var(--primary)" }} />}
                    onClick={onLinkClick}
                />
            </div>

        </div>
    );
};

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const [isOpen, setIsOpen] = useState(false);

    const shellRef = useRef(null);
    const sideRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                sideRef.current,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );
            gsap.fromTo(
                shellRef.current,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: 0.05 }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg)" }}>
            <Navbar />
            <ScrollToTop />

            <div className="md:hidden px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconWrap>
                            <LayoutDashboard size={18} style={{ color: "var(--primary)" }} />
                        </IconWrap>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                Dashboard
                            </p>
                            <p className="text-xs font-semibold tracking-wider" style={{ color: "var(--muted)" }}>
                                {(role || "user").toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <Motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsOpen((v) => !v)}
                        className="grid h-11 w-11 place-items-center rounded-2xl border"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            color: "var(--text)",
                        }}
                        aria-label="Toggle sidebar"
                    >
                        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </Motion.button>
                </div>
            </div>

            <div className="flex flex-1">
                <aside
                    ref={sideRef}
                    className="hidden md:flex w-72 border-r sticky top-18 h-[calc(100vh-72px)]"
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                        boxShadow: "0 10px 36px color-mix(in oklab, var(--text) 10%, transparent)",
                    }}
                >
                    <Sidebar role={role} user={user} />
                </aside>

                <AnimatePresence>
                    {isOpen && (
                        <Motion.div
                            className="fixed inset-0 z-50 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Motion.div
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                            />
                            <Motion.aside
                                initial={{ x: -320 }}
                                animate={{ x: 0 }}
                                exit={{ x: -320 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="absolute left-0 top-0 h-full w-80"
                                style={{
                                    backgroundColor: "color-mix(in oklab, var(--surface) 94%, transparent)",
                                    borderRight: `1px solid var(--border)`,
                                    boxShadow: "0 22px 70px rgba(0,0,0,0.35)",
                                    backdropFilter: "blur(16px)",
                                }}
                            >
                                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                                    <div className="flex items-center gap-3">
                                        <IconWrap>
                                            <ShieldCheck size={18} style={{ color: "var(--secondary)" }} />
                                        </IconWrap>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                                Dashboard
                                            </p>
                                            <p className="text-xs font-semibold tracking-wider" style={{ color: "var(--muted)" }}>
                                                {(role || "user").toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="grid h-11 w-11 place-items-center rounded-2xl border"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                            color: "var(--text)",
                                        }}
                                        aria-label="Close sidebar"
                                    >
                                        <FiX className="text-2xl" />
                                    </button>
                                </div>

                                <Sidebar role={role} user={user} onLinkClick={() => setIsOpen(false)} />
                            </Motion.aside>
                        </Motion.div>
                    )}
                </AnimatePresence>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div
                        ref={shellRef}
                        className="rounded-3xl border p-5 sm:p-7 md:p-8 min-h-[calc(100vh-180px)]"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            boxShadow: "var(--card-shadow)",
                        }}
                    >
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardLayout;
