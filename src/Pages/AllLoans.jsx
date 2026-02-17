import { NavLink } from "react-router";
import { useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight, Percent, Tag, Wallet } from "lucide-react";
import useAllLoans from "../Hooks/useAllLoans";

const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const AllLoans = () => {
    const { data: loans = [], isLoading, isError } = useAllLoans();
    const wrapRef = useRef(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".al-reveal",
                { opacity: 0, y: 24, filter: "blur(6px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "power3.out",
                    stagger: 0.08,
                    scrollTrigger: { trigger: el, start: "top 88%" },
                }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapRef} className="max-w-7xl mx-auto px-6 py-24 space-y-16">
            <div className="text-center max-w-2xl mx-auto al-reveal">
                <Motion.h1
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="text-4xl md:text-5xl font-bold tracking-tight"
                    style={{ color: "var(--text)" }}
                >
                    All <span className="bg-linear-to-r from-(--primary) to-(--secondary) bg-clip-text text-transparent">Loan</span>{" "}
                    Programs
                </Motion.h1>

                <Motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mt-5 text-lg"
                    style={{ color: "var(--muted)" }}
                >
                    Browse loan programs crafted for individuals, startups, and growing businesses with clear terms and
                    role-based approvals.
                </Motion.p>

                <div className="mt-8 flex flex-wrap justify-center gap-3 al-reveal">
                    <span
                        className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            color: "var(--text)",
                        }}
                    >
                        <ShieldBadge />
                        Transparent workflow
                    </span>

                    <span
                        className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            color: "var(--text)",
                        }}
                    >
                        <Wallet size={16} style={{ color: "var(--success)" }} />
                        Clear limits & rates
                    </span>

                    <span
                        className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            color: "var(--text)",
                        }}
                    >
                        <Tag size={16} style={{ color: "var(--secondary)" }} />
                        Curated categories
                    </span>
                </div>
            </div>

            {isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-3xl border overflow-hidden"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                boxShadow: "var(--card-shadow)",
                            }}
                        >
                            <div className="h-56 animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                            <div className="p-8 space-y-4">
                                <div className="h-5 w-3/4 rounded-lg animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                                <div className="h-4 w-1/2 rounded-lg animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                                <div className="h-10 w-full rounded-2xl animate-pulse" style={{ backgroundColor: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <div
                    className="rounded-3xl border p-6 text-center"
                    style={{
                        borderColor: "color-mix(in oklab, var(--danger) 35%, var(--border))",
                        backgroundColor: "color-mix(in oklab, var(--danger) 6%, var(--surface))",
                    }}
                >
                    <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>
                        Failed to load loan programs.
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        Please refresh the page or try again later.
                    </p>
                </div>
            )}

            {!isLoading && !isError && (
                <Motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ staggerChildren: 0.08 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {loans.map((loan) => (
                        <Motion.div
                            key={loan._id}
                            variants={fadeUp}
                            whileHover={{ y: -10 }}
                            className="group rounded-3xl border overflow-hidden"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                boxShadow: "var(--card-shadow)",
                            }}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={loan.images?.[0]}
                                    alt={loan.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                                />
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background:
                                            "linear-linear(135deg, color-mix(in oklab, var(--primary) 18%, transparent), transparent 50%, color-mix(in oklab, var(--secondary) 14%, transparent))",
                                    }}
                                />
                                <div className="absolute left-4 top-4">
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
                                </div>
                            </div>

                            <div className="p-8 flex flex-col min-h-65">
                                <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                                    {loan.title}
                                </h2>

                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span
                                        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                            color: "var(--text)",
                                        }}
                                    >
                                        <Percent size={14} style={{ color: "var(--secondary)" }} />
                                        Interest: <span className="font-bold">{loan.interestRate}%</span>
                                    </span>

                                    <span
                                        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                            color: "var(--text)",
                                        }}
                                    >
                                        <Wallet size={14} style={{ color: "var(--success)" }} />
                                        Max: <span className="font-bold">${loan.maxLoanLimit}</span>
                                    </span>
                                </div>

                                <div className="mt-7">
                                    <NavLink
                                        to={`/loans/${loan._id}`}
                                        className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300"
                                        style={{
                                            background: "linear-linear(135deg, var(--primary), var(--secondary))",
                                            color: "white",
                                            boxShadow: "0 16px 40px color-mix(in oklab, var(--primary) 20%, transparent)",
                                        }}
                                    >
                                        View Details
                                        <ArrowUpRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                                        />
                                    </NavLink>
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </Motion.div>
            )}
        </div>
    );
};

const ShieldBadge = () => (
    <span className="grid h-6 w-6 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklab, var(--success) 16%, transparent)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--success)" }}
            />
            <path
                d="M8.5 12.5l2.2 2.2 4.8-5.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--success)" }}
            />
        </svg>
    </span>
);

export default AllLoans;
