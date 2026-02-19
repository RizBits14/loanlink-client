import React, { useEffect, useMemo, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import {
    BadgeCheck,
    Calendar,
    Mail,
    ShieldCheck,
    User as UserIcon,
    Activity,
} from "lucide-react";

import useAuth from "../../Hooks/useAuth";
import useDbUser from "../../Hooks/useDBUser";

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const roleTone = (role = "borrower") => {
    const r = role.toLowerCase();
    if (r === "admin")
        return { dot: "var(--danger)", soft: "color-mix(in oklab, var(--danger) 14%, transparent)" };
    if (r === "manager")
        return { dot: "var(--secondary)", soft: "color-mix(in oklab, var(--secondary) 14%, transparent)" };

    return { dot: "var(--primary)", soft: "color-mix(in oklab, var(--primary) 14%, transparent)" };
};

const statusTone = (status = "active") => {
    const s = status.toLowerCase();
    if (s === "active")
        return { dot: "var(--success)", soft: "color-mix(in oklab, var(--success) 14%, transparent)" };

    return { dot: "var(--danger)", soft: "color-mix(in oklab, var(--danger) 14%, transparent)" };
};

const Chip = ({ icon, label, dot, soft }) => (
    <span
        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold capitalize"
        style={{
            borderColor: "var(--border)",
            backgroundColor: soft,
            color: "var(--text)",
        }}
    >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
        {icon}
        {label}
    </span>
);

const FieldRow = ({ icon, label, value, isLast }) => (
    <div
        className={`flex items-start justify-between gap-6 py-4 ${isLast ? "" : "border-b"}`}
        style={{ borderColor: "var(--border)" }}
    >
        <div className="flex items-center gap-3">
            <span
                className="grid h-9 w-9 place-items-center rounded-2xl border"
                style={{
                    borderColor: "var(--border)",
                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                    color: "var(--primary)",
                }}
            >
                {icon}
            </span>
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                {label}
            </p>
        </div>

        <p
            className="text-sm sm:text-base font-semibold text-right break-all"
            style={{ color: "var(--text)" }}
        >
            {value || "—"}
        </p>
    </div>
);

const Profile = () => {
    const { user } = useAuth();
    const { data: dbUser, isLoading } = useDbUser();

    const wrapRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".reveal",
                { opacity: 0, y: 16, filter: "blur(6px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.08,
                }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const role = useMemo(() => dbUser?.role?.toLowerCase() || "borrower", [dbUser]);
    const status = useMemo(() => dbUser?.status?.toLowerCase() || "active", [dbUser]);

    const joined = useMemo(() => {
        return dbUser?.createdAt
            ? new Date(dbUser.createdAt).toLocaleDateString()
            : "—";
    }, [dbUser]);

    const rt = roleTone(role);
    const st = statusTone(status);

    if (isLoading) {
        return (
            <div className="py-24 text-center font-semibold" style={{ color: "var(--muted)" }}>
                Loading profile...
            </div>
        );
    }

    return (
        <div
            className="w-full"
            style={{
                background:
                    "radial-gradient(900px 420px at 12% 8%, color-mix(in oklab, var(--secondary) 14%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 18%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 58%)",
            }}
        >
            <div ref={wrapRef} className="space-y-6">

                <Motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="reveal rounded-3xl border p-6 sm:p-7 overflow-hidden relative"
                    style={shellStyle}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">

                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-3xl overflow-hidden border p-1"
                                style={{ borderColor: "var(--border)" }}>
                                <img
                                    src={user?.photoURL || "https://i.ibb.co/2kR9K5Q/user.png"}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-bold truncate"
                                    style={{ color: "var(--text)" }}>
                                    {user?.displayName || "Unnamed User"}
                                </h1>

                                <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                                    {user?.email}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Chip icon={<ShieldCheck size={14} />} label={role} {...rt} />
                                    <Chip icon={<Activity size={14} />} label={status} {...st} />
                                </div>
                            </div>
                        </div>

                        <div className="md:ml-auto grid sm:grid-cols-2 gap-3 w-full md:w-auto">

                            <div className="rounded-2xl border p-4" style={shellStyle}>
                                <p className="text-xs font-semibold uppercase"
                                    style={{ color: "var(--muted)" }}>
                                    Joined
                                </p>
                                <p className="font-bold" style={{ color: "var(--text)" }}>
                                    {joined}
                                </p>
                            </div>

                            <div
                                className="rounded-2xl border p-4"
                                style={{
                                    borderColor: "var(--border)",
                                    background:
                                        "linear-gradient(135deg, color-mix(in oklab, var(--secondary) 12%, transparent), color-mix(in oklab, var(--primary) 12%, transparent))",
                                }}
                            >
                                <p className="text-xs font-semibold uppercase"
                                    style={{ color: "var(--muted)" }}>
                                    Security
                                </p>
                                <p className="font-bold" style={{ color: "var(--text)" }}>
                                    Verified account
                                </p>
                            </div>

                        </div>
                    </div>
                </Motion.div>

                <div className="grid lg:grid-cols-2 gap-6">

                    <Motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="reveal rounded-3xl border p-6 sm:p-7"
                        style={shellStyle}
                    >
                        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text)" }}>
                            Account Details
                        </h2>

                        <FieldRow icon={<UserIcon size={16} />} label="Full Name" value={user?.displayName} />
                        <FieldRow icon={<Mail size={16} />} label="Email" value={user?.email} />
                        <FieldRow icon={<ShieldCheck size={16} />} label="Role" value={role} />
                        <FieldRow icon={<Activity size={16} />} label="Status" value={status} />
                        <FieldRow icon={<Calendar size={16} />} label="Joined Date" value={joined} isLast />
                    </Motion.div>

                    <Motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="reveal rounded-3xl border p-6 sm:p-7"
                        style={shellStyle}
                    >
                        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text)" }}>
                            What you can do
                        </h2>

                        <p style={{ color: "var(--muted)" }}>
                            {role === "admin" && "Manage users, loans, and all applications."}
                            {role === "manager" && "Manage loans and handle applications."}
                            {role === "borrower" && "Apply for loans and track application status."}
                        </p>
                    </Motion.div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
