import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, NavLink } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import {
    ArrowUpRight,
    BadgeCheck,
    CreditCard,
    DollarSign,
    Layers,
    Percent,
    Tag,
} from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const LoanDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { role } = useUserRole();

    const wrapRef = useRef(null);
    const heroRef = useRef(null);

    const [activeImg, setActiveImg] = useState(0);

    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ["loan", id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${id}`);
            return res.json();
        },
    });

    const images = useMemo(() => loan?.images?.filter(Boolean) || [], [loan]);
    const safeActiveImg = Math.min(activeImg, Math.max(0, images.length - 1));
    const mainImg = images[safeActiveImg] || images[0];

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveImg(0);
    }, [id]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 16, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div
                    className="rounded-3xl border overflow-hidden"
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                        boxShadow: "var(--card-shadow)",
                    }}
                >
                    <div
                        className="h-80 animate-pulse"
                        style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }}
                    />
                    <div className="p-8 space-y-4">
                        <div className="h-7 w-2/3 rounded-xl animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                        <div className="h-4 w-full rounded-xl animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                        <div className="h-4 w-5/6 rounded-xl animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                        <div className="h-12 w-full rounded-2xl animate-pulse mt-6" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={wrapRef}
            className="w-full"
            style={{
                background:
                    "radial-gradient(900px 420px at 15% 10%, color-mix(in oklab, var(--secondary) 14%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 18%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 58%), transparent",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 py-14 lg:py-16">
                <Motion.div ref={heroRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7">
                        <div
                            className="rounded-3xl border overflow-hidden"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                boxShadow: "var(--card-shadow)",
                            }}
                        >
                            <div className="relative">
                                <img src={mainImg} alt={loan.title} className="w-full h-85 sm:h-105 object-cover" />
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.25))",
                                    }}
                                />
                                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                                    <span
                                        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold tracking-wide"
                                        style={{
                                            borderColor: "rgba(255,255,255,0.22)",
                                            backgroundColor: "rgba(17,24,39,0.40)",
                                            color: "white",
                                            backdropFilter: "blur(14px)",
                                        }}
                                    >
                                        <Tag size={14} />
                                        {loan.category}
                                    </span>

                                    <span
                                        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold tracking-wide"
                                        style={{
                                            borderColor: "rgba(255,255,255,0.22)",
                                            backgroundColor: "rgba(17,24,39,0.40)",
                                            color: "white",
                                            backdropFilter: "blur(14px)",
                                        }}
                                    >
                                        <BadgeCheck size={14} />
                                        Transparent terms
                                    </span>
                                </div>
                            </div>

                            {images.length > 1 && (
                                <div className="p-5">
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {images.map((src, idx) => {
                                            const active = idx === safeActiveImg;
                                            return (
                                                <button
                                                    key={`${src}-${idx}`}
                                                    type="button"
                                                    onClick={() => setActiveImg(idx)}
                                                    className="relative shrink-0 rounded-2xl overflow-hidden border transition-all"
                                                    style={{
                                                        width: 92,
                                                        height: 64,
                                                        borderColor: active ? "color-mix(in oklab, var(--primary) 55%, var(--border))" : "var(--border)",
                                                        boxShadow: active
                                                            ? "0 16px 40px color-mix(in oklab, var(--primary) 22%, transparent)"
                                                            : "none",
                                                        transform: active ? "translateY(-2px)" : "none",
                                                    }}
                                                    aria-label={`Select image ${idx + 1}`}
                                                >
                                                    <img src={src} alt={`${loan.title} ${idx + 1}`} className="h-full w-full object-cover" />
                                                    <span
                                                        className="absolute inset-0 pointer-events-none"
                                                        style={{
                                                            background: active
                                                                ? "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent), transparent)"
                                                                : "transparent",
                                                        }}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-9">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                                {loan.title}
                            </h1>
                            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                                {loan.description}
                            </p>

                            <div className="mt-7 grid sm:grid-cols-2 gap-3">
                                <InfoPill icon={<Tag size={16} style={{ color: "var(--secondary)" }} />} label="Category" value={loan.category} />
                                <InfoPill
                                    icon={<Percent size={16} style={{ color: "var(--secondary)" }} />}
                                    label="Interest rate"
                                    value={`${loan.interestRate}%`}
                                />
                                <InfoPill
                                    icon={<DollarSign size={16} style={{ color: "var(--success)" }} />}
                                    label="Max limit"
                                    value={`$${loan.maxLoanLimit}`}
                                />
                                <InfoPill
                                    icon={<Layers size={16} style={{ color: "var(--primary)" }} />}
                                    label="EMI plans"
                                    value={Array.isArray(loan.emiPlans) ? loan.emiPlans.join(", ") : "—"}
                                />
                            </div>
                        </Motion.div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-23 space-y-4">
                            <div
                                className="rounded-3xl border p-6 sm:p-7"
                                style={{
                                    borderColor: "var(--border)",
                                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                    boxShadow: "var(--card-shadow)",
                                }}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                            Summary
                                        </p>
                                        <p className="mt-1 text-lg font-bold" style={{ color: "var(--text)" }}>
                                            Key terms at a glance
                                        </p>
                                    </div>
                                    <span
                                        className="grid h-11 w-11 place-items-center rounded-2xl border"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <CreditCard size={18} style={{ color: "var(--primary)" }} />
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <StatTile label="Interest" value={`${loan.interestRate}%`} icon={<Percent size={16} />} tone="secondary" />
                                    <StatTile label="Max limit" value={`$${loan.maxLoanLimit}`} icon={<DollarSign size={16} />} tone="success" />
                                    <StatTile
                                        label="Category"
                                        value={loan.category || "—"}
                                        icon={<Tag size={16} />}
                                        tone="primary"
                                    />
                                    <StatTile
                                        label="EMI"
                                        value={Array.isArray(loan.emiPlans) ? `${loan.emiPlans.length} plans` : "—"}
                                        icon={<Layers size={16} />}
                                        tone="primary"
                                    />
                                </div>

                                <div className="mt-6">
                                    {role === "borrower" ? (
                                        <NavLink
                                            to={`/dashboard/apply-loan/${loan._id}`}
                                            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300"
                                            style={{
                                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                                color: "white",
                                                boxShadow: "0 16px 40px color-mix(in oklab, var(--primary) 20%, transparent)",
                                            }}
                                        >
                                            Apply Now
                                            <ArrowUpRight
                                                size={16}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </NavLink>
                                    ) : (
                                        <button
                                            className="w-full rounded-2xl px-5 py-3 text-sm font-semibold border"
                                            style={{
                                                borderColor: "var(--border)",
                                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                color: "var(--muted)",
                                                cursor: "not-allowed",
                                            }}
                                            disabled
                                        >
                                            Only borrowers can apply
                                        </button>
                                    )}

                                    <div
                                        className="mt-4 rounded-2xl border p-4"
                                        style={{
                                            borderColor: "var(--border)",
                                            background:
                                                "linear-gradient(135deg, color-mix(in oklab, var(--secondary) 10%, transparent), color-mix(in oklab, var(--primary) 10%, transparent))",
                                        }}
                                    >
                                        <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                                            What happens next?
                                        </p>
                                        <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
                                            Submit your application and track status in your dashboard.
                                        </p>
                                    </div>

                                    {user && (
                                        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                                            Signed in as <span className="font-semibold" style={{ color: "var(--text)" }}>{user.email}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div
                                className="rounded-3xl border p-6"
                                style={{
                                    borderColor: "var(--border)",
                                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                    boxShadow: "0 10px 34px color-mix(in oklab, var(--text) 10%, transparent)",
                                }}
                            >
                                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                    Note
                                </p>
                                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
                                    Rates and limits may vary by eligibility and approval outcome.
                                </p>
                            </div>
                        </div>
                    </div>
                </Motion.div>
            </div>
        </div>
    );
};

const InfoPill = ({ icon, label, value }) => (
    <div
        className="flex items-start gap-3 rounded-2xl border p-4"
        style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
        }}
    >
        <span
            className="grid h-10 w-10 place-items-center rounded-2xl border"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            }}
        >
            {icon}
        </span>
        <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                {label}
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold" style={{ color: "var(--text)" }}>
                {value || "—"}
            </p>
        </div>
    </div>
);

const StatTile = ({ label, value, icon, tone = "primary" }) => {
    const toneColor =
        tone === "success"
            ? "var(--success)"
            : tone === "secondary"
                ? "var(--secondary)"
                : "var(--primary)";

    return (
        <div
            className="rounded-2xl border p-4"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            }}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                    {label}
                </span>
                <span
                    className="grid h-8 w-8 place-items-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in oklab, ${toneColor} 16%, transparent)` }}
                >
                    <span style={{ color: toneColor }}>{icon}</span>
                </span>
            </div>
            <p className="mt-2 text-sm font-bold" style={{ color: "var(--text)" }}>
                {value || "—"}
            </p>
        </div>
    );
};

export default LoanDetails;
