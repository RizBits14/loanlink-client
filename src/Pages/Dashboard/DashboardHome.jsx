/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef } from "react";
import { motion as Motion } from "framer-motion";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";
import { gsap } from "gsap";
import {
    BadgeCheck,
    BarChart3,
    ClipboardList,
    Coins,
    CreditCard,
    PieChart as PieIcon,
    ShieldCheck,
    Users,
    XCircle,
} from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import useMyLoans from "../../Hooks/useMyLoans";
import useAllUsers from "../../Hooks/useAllUsers";
import useAllLoans from "../../Hooks/useAllLoans";
import useAllApplications from "../../Hooks/useAllApplications";
import usePendingLoans from "../../Hooks/usePendingLoans";
import useApprovedLoans from "../../Hooks/useApprovedLoans";
import useDbUser from "../../Hooks/useDBUser";

const palette = [
    "hsl(262 83% 58%)",
    "hsl(198 93% 60%)",
    "hsl(142 71% 45%)",
    "hsl(24 94% 53%)",
    "hsl(0 84% 60%)",
    "hsl(48 96% 53%)",
    "hsl(291 64% 42%)",
    "hsl(174 72% 56%)",
];

const fmtUSD = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return `$${v ?? 0}`;
    return `$${n.toLocaleString()}`;
};

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const tooltipStyle = {
    backgroundColor: "color-mix(in oklab, var(--surface) 96%, transparent)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};

const gridStroke = "color-mix(in oklab, var(--text) 14%, transparent)";

const KpiCard = ({ title, value, sub, icon, tone = "primary" }) => {
    const toneColor =
        tone === "success"
            ? "var(--success)"
            : tone === "warning"
                ? "var(--warning)"
                : tone === "danger"
                    ? "var(--danger)"
                    : tone === "secondary"
                        ? "var(--secondary)"
                        : "var(--primary)";

    return (
        <Motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="rounded-3xl border p-5 sm:p-6"
            style={shellStyle}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                        {title}
                    </p>
                    <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                        {value}
                    </p>
                    {sub ? (
                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                            {sub}
                        </p>
                    ) : null}
                </div>

                <span
                    className="grid h-11 w-11 place-items-center rounded-2xl border"
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: `color-mix(in oklab, ${toneColor} 14%, transparent)`,
                        color: toneColor,
                    }}
                >
                    {icon}
                </span>
            </div>

            <div
                className="mt-5 h-px w-full"
                style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }}
            />
        </Motion.div>
    );
};

const Panel = ({ title, subtitle, icon, children }) => (
    <Motion.div variants={fadeUp} className="rounded-3xl border p-6" style={shellStyle}>
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                    {subtitle}
                </p>
                <h3 className="mt-1 text-lg font-bold" style={{ color: "var(--text)" }}>
                    {title}
                </h3>
            </div>
            <span
                className="grid h-10 w-10 place-items-center rounded-2xl border"
                style={{
                    borderColor: "var(--border)",
                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                    color: "var(--primary)",
                }}
            >
                {icon}
            </span>
        </div>
        <div className="mt-5">{children}</div>
    </Motion.div>
);

const EmptyChart = ({ label }) => (
    <div
        className="grid place-items-center rounded-2xl border"
        style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            height: 288,
        }}
    >
        <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Nothing to show yet
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {label}
            </p>
        </div>
    </div>
);

const groupByMonth = (apps, dateField = "createdAt") => {
    const map = new Map();
    for (const a of apps) {
        const d = a?.[dateField] ? new Date(a[dateField]) : null;
        if (!d || Number.isNaN(d.getTime())) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()]
        .sort((x, y) => x[0].localeCompare(y[0]))
        .map(([k, v]) => {
            const [yy, mm] = k.split("-");
            const label = new Date(Number(yy), Number(mm) - 1, 1).toLocaleString("en-US", { month: "short" });
            return { month: `${label} ${yy}`, count: v };
        });
};

const makeStatusData = (apps) => {
    const counts = { pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    for (const a of apps) {
        const s = (a.status || "").toLowerCase();
        if (counts[s] !== undefined) counts[s] += 1;
    }
    return [
        { name: "Pending", value: counts.pending },
        { name: "Approved", value: counts.approved },
        { name: "Rejected", value: counts.rejected },
        { name: "Cancelled", value: counts.cancelled },
    ];
};

const BorrowerOverview = () => {
    const { data: my = [], isLoading } = useMyLoans();

    if (isLoading) {
        return (
            <div className="py-16 text-center" style={{ color: "var(--muted)" }}>
                Loading...
            </div>
        );
    }

    const total = my.length;
    const statusData = makeStatusData(my);
    const paid = my.filter((x) => x.feeStatus === "paid").length;
    const unpaid = my.filter((x) => x.feeStatus === "unpaid").length;
    const monthly = groupByMonth(my, "createdAt");
    const totalRequested = my.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

    return (
        <Motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <KpiCard title="Total Applications" value={total} icon={<ClipboardList size={18} />} />
                <KpiCard title="Requested Amount" value={fmtUSD(totalRequested)} sub="Sum of all applied amounts" icon={<Coins size={18} />} tone="secondary" />
                <KpiCard title="Fee Paid" value={paid} icon={<BadgeCheck size={18} />} tone="success" />
                <KpiCard title="Fee Unpaid" value={unpaid} icon={<CreditCard size={18} />} tone="warning" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Panel title="Application Status" subtitle="Distribution" icon={<PieIcon size={18} />}>
                    {statusData.every((x) => x.value === 0) ? (
                        <EmptyChart label="Apply for a loan to see status analytics." />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                                        {statusData.map((_, i) => (
                                            <Cell key={i} fill={palette[i % palette.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>

                <Panel title="Applications Over Time" subtitle="Monthly trend" icon={<BarChart3 size={18} />}>
                    {monthly.length === 0 ? (
                        <EmptyChart label="Monthly trend will appear after your first application." />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthly}>
                                    <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="var(--primary)"
                                        strokeWidth={3.5}
                                        dot={{ r: 4, fill: "var(--secondary)" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>
            </div>
        </Motion.div>
    );
};

const ManagerOverview = () => {
    const { user } = useAuth();
    const { data: allLoans = [], isLoading: loansLoading } = useAllLoans();
    const { data: pending = [], isLoading: pendingLoading } = usePendingLoans();
    const { data: approved = [], isLoading: approvedLoading } = useApprovedLoans();

    if (loansLoading || pendingLoading || approvedLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    const myLoans = allLoans.filter((l) => (l.createdBy || "").toLowerCase() === (user?.email || "").toLowerCase());
    const myLoanIds = new Set(myLoans.map((l) => String(l._id)));
    const myPending = pending.filter((a) => myLoanIds.has(String(a.loanId)));
    const myApproved = approved.filter((a) => myLoanIds.has(String(a.loanId)));

    const appCountMap = new Map();
    for (const a of [...myPending, ...myApproved]) {
        const key = a.loanTitle || "Unknown";
        appCountMap.set(key, (appCountMap.get(key) || 0) + 1);
    }
    const topLoans = [...appCountMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, value]) => ({ name, value }));

    return (
        <Motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <KpiCard title="Loans You Created" value={myLoans.length} icon={<BarChart3 size={18} />} />
                <KpiCard title="Pending Applications" value={myPending.length} icon={<ClipboardList size={18} />} tone="warning" />
                <KpiCard title="Approved Applications" value={myApproved.length} icon={<BadgeCheck size={18} />} tone="success" />
                <KpiCard title="Total Applications" value={myPending.length + myApproved.length} sub="Pending + Approved" icon={<Users size={18} />} tone="secondary" />
            </div>

            <Panel title="Most Applied Loans (Your Loans)" subtitle="Top demand" icon={<BarChart3 size={18} />}>
                {topLoans.length === 0 ? (
                    <EmptyChart label="No applications found for your loans yet." />
                ) : (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topLoans}>
                                <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                    {topLoans.map((_, i) => (
                                        <Cell key={i} fill={palette[i % palette.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Panel>
        </Motion.div>
    );
};

const AdminOverview = () => {
    const { data: users = [], isLoading: usersLoading } = useAllUsers();
    const { data: loans = [], isLoading: loansLoading } = useAllLoans();
    const { data: apps = [], isLoading: appsLoading } = useAllApplications();

    if (usersLoading || loansLoading || appsLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const suspendedUsers = users.filter((u) => u.status === "suspended").length;

    const roleCounts = users.reduce(
        (acc, u) => {
            const r = (u.role || "borrower").toLowerCase();
            acc[r] = (acc[r] || 0) + 1;
            return acc;
        },
        { admin: 0, manager: 0, borrower: 0 }
    );

    const roleData = [
        { name: "Admins", value: roleCounts.admin || 0 },
        { name: "Managers", value: roleCounts.manager || 0 },
        { name: "Borrowers", value: roleCounts.borrower || 0 },
    ];

    const homeLoans = loans.filter((l) => !!l.showOnHome).length;
    const statusData = makeStatusData(apps);
    const paidCount = apps.filter((a) => a.feeStatus === "paid").length;
    const revenue = paidCount * 10;

    return (
        <Motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Users"
                    value={totalUsers}
                    sub={`${activeUsers} active • ${suspendedUsers} suspended`}
                    icon={<Users size={18} />}
                />
                <KpiCard title="Total Loans" value={loans.length} sub={`${homeLoans} showing on Home`} icon={<BarChart3 size={18} />} tone="secondary" />
                <KpiCard title="Total Applications" value={apps.length} icon={<ClipboardList size={18} />} />
                <KpiCard title="Fee Revenue (est.)" value={fmtUSD(revenue)} sub={`${paidCount} paid × $10`} icon={<Coins size={18} />} tone="success" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Panel title="Users by Role" subtitle="Distribution" icon={<Users size={18} />}>
                    {roleData.every((x) => x.value === 0) ? (
                        <EmptyChart label="No users found." />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                                        {roleData.map((_, i) => (
                                            <Cell key={i} fill={palette[i % palette.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>

                <Panel title="Applications by Status" subtitle="System-wide" icon={<XCircle size={18} />}>
                    {statusData.every((x) => x.value === 0) ? (
                        <EmptyChart label="No applications found." />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusData}>
                                    <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                        {statusData.map((_, i) => (
                                            <Cell key={i} fill={palette[i % palette.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>
            </div>
        </Motion.div>
    );
};

const DashboardHome = () => {
    const { data: dbUser, isLoading } = useDbUser();
    const role = (dbUser?.role || "borrower").toLowerCase();

    const wrapRef = useRef(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".dh-reveal",
                { opacity: 0, y: 16, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="py-16 text-center" style={{ color: "var(--muted)" }}>
                Loading...
            </div>
        );
    }

    return (
        <div ref={wrapRef} className="space-y-6">
            <Motion.div
                className="dh-reveal rounded-3xl border p-6 sm:p-7"
                style={shellStyle}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                            Overview
                        </h1>
                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                            Role:{" "}
                            <span className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1 text-xs font-bold capitalize" style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: role === "admin" ? "var(--danger)" : role === "manager" ? "var(--secondary)" : "var(--primary)" }} />
                                {role}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className="grid h-11 w-11 place-items-center rounded-2xl border"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                color: "var(--primary)",
                            }}
                        >
                            <ShieldCheck size={18} />
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                            Role-based insights
                        </span>
                    </div>
                </div>
            </Motion.div>

            <div className="dh-reveal">
                {role === "admin" ? <AdminOverview /> : role === "manager" ? <ManagerOverview /> : <BorrowerOverview />}
            </div>
        </div>
    );
};

export default DashboardHome;
