import React from 'react';
import { motion as Motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import useAuth from "../../Hooks/useAuth";
import useMyLoans from "../../Hooks/useMyLoans";
import useAllUsers from "../../Hooks/useAllUsers";
import useAllLoans from "../../Hooks/useAllLoans";
import useAllApplications from "../../Hooks/useAllApplications";
import usePendingLoans from "../../Hooks/usePendingLoans";
import useApprovedLoans from "../../Hooks/useApprovedLoans";
import useDbUser from '../../Hooks/useDBUser';

const palette = [
    "hsl(262 83% 58%)",
    "hsl(198 93% 60%)",
    "hsl(142 71% 45%)",
    "hsl(24 94% 53%)",
    "hsl(0 84% 60%)",
    "hsl(48 96% 53%)",
    "hsl(291 64% 42%)",
    "hsl(174 72% 56%)"
];

const Card = ({ title, value, sub }) => (
    <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {sub ? <p className="text-sm opacity-70 mt-2">{sub}</p> : null}
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
        { name: "Cancelled", value: counts.cancelled }
    ];
};

const BorrowerOverview = () => {
    const { data: my = [], isLoading } = useMyLoans();
    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }
    const total = my.length;
    const statusData = makeStatusData(my);
    const paid = my.filter((x) => x.feeStatus === "paid").length;
    const unpaid = my.filter((x) => x.feeStatus === "unpaid").length;
    const monthly = groupByMonth(my, "createdAt");
    const totalRequested = my.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
                <Card title="Total Applications" value={total} />
                <Card title="Requested Amount" value={`$${totalRequested}`} sub="Sum of all applied amounts" />
                <Card title="Fee Paid" value={paid} />
                <Card title="Fee Unpaid" value={unpaid} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                    <h3 className="text-lg font-semibold mb-4">Application Status</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                                    {statusData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'hsl(var(--b1))', borderRadius: 12 }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                    <h3 className="text-lg font-semibold mb-4">Applications Over Time</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthly}>
                                <CartesianGrid stroke="hsl(var(--bc) / 0.15)" strokeDasharray="4 4" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip contentStyle={{ background: 'hsl(var(--b1))', borderRadius: 12 }} />
                                <Line type="monotone" dataKey="count" stroke="hsl(262 83% 58%)" strokeWidth={4} dot={{ r: 5, fill: 'hsl(198 93% 60%)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManagerOverview = () => {
    const { user } = useAuth();
    const { data: allLoans = [], isLoading: loansLoading } = useAllLoans();
    const { data: pending = [], isLoading: pendingLoading } = usePendingLoans();
    const { data: approved = [], isLoading: approvedLoading } = useApprovedLoans();
    if (loansLoading || pendingLoading || approvedLoading) {
        return <div className="flex justify-center items-center py-24"><span className="loading loading-spinner loading-lg text-primary" /></div>;
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
    const topLoans = [...appCountMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
                <Card title="Loans You Created" value={myLoans.length} />
                <Card title="Pending Applications" value={myPending.length} />
                <Card title="Approved Applications" value={myApproved.length} />
                <Card title="Total Applications" value={myPending.length + myApproved.length} sub="Pending + Approved" />
            </div>
            <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                <h3 className="text-lg font-semibold mb-4">Most Applied Loans (Your Loans)</h3>
                {topLoans.length === 0 ? <p className="opacity-70">No applications found for your loans yet.</p> : (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topLoans}>
                                <CartesianGrid stroke="hsl(var(--bc) / 0.15)" strokeDasharray="4 4" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip contentStyle={{ background: 'hsl(var(--b1))', borderRadius: 12 }} />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                    {topLoans.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

const AdminOverview = () => {
    const { data: users = [], isLoading: usersLoading } = useAllUsers();
    const { data: loans = [], isLoading: loansLoading } = useAllLoans();
    const { data: apps = [], isLoading: appsLoading } = useAllApplications();
    if (usersLoading || loansLoading || appsLoading) {
        return <div className="flex justify-center items-center py-24"><span className="loading loading-spinner loading-lg text-primary" /></div>;
    }
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const suspendedUsers = users.filter((u) => u.status === "suspended").length;
    const roleCounts = users.reduce((acc, u) => {
        const r = (u.role || "borrower").toLowerCase();
        acc[r] = (acc[r] || 0) + 1;
        return acc;
    }, { admin: 0, manager: 0, borrower: 0 });
    const roleData = [
        { name: "Admins", value: roleCounts.admin || 0 },
        { name: "Managers", value: roleCounts.manager || 0 },
        { name: "Borrowers", value: roleCounts.borrower || 0 }
    ];
    const homeLoans = loans.filter((l) => !!l.showOnHome).length;
    const statusData = makeStatusData(apps);
    const paidCount = apps.filter((a) => a.feeStatus === "paid").length;
    const revenue = paidCount * 10;
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
                <Card title="Total Users" value={totalUsers} sub={`${activeUsers} active • ${suspendedUsers} suspended`} />
                <Card title="Total Loans" value={loans.length} sub={`${homeLoans} showing on Home`} />
                <Card title="Total Applications" value={apps.length} />
                <Card title="Fee Revenue (est.)" value={`$${revenue}`} sub={`${paidCount} paid × $10`} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                    <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                                    {roleData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'hsl(var(--b1))', borderRadius: 12 }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                    <h3 className="text-lg font-semibold mb-4">Applications by Status</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid stroke="hsl(var(--bc) / 0.15)" strokeDasharray="4 4" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip contentStyle={{ background: 'hsl(var(--b1))', borderRadius: 12 }} />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                    {statusData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardHome = () => {
    const { data: dbUser, isLoading } = useDbUser();
    const role = (dbUser?.role || "borrower").toLowerCase();
    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }
    return (
        <Motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
            <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
                <p className="opacity-70 mt-1">Role: <span className="capitalize font-semibold">{role}</span></p>
            </div>
            {role === "admin" ? <AdminOverview /> : role === "manager" ? <ManagerOverview /> : <BorrowerOverview />}
        </Motion.div>
    );
};

export default DashboardHome;