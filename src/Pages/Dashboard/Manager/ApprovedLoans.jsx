import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle2,
    Search,
    Filter,
    Clock,
    Mail,
    User,
    DollarSign,
    Hash,
    XCircle,
    ShieldAlert,
} from "lucide-react";
import useApprovedLoans from "../../../Hooks/useApprovedLoans";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const ApprovedLoans = () => {
    const { data: loans = [], isLoading } = useApprovedLoans();
    const queryClient = useQueryClient();
    const wrapRef = useRef(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".al-reveal",
                { opacity: 0, y: 14, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return loans;
        return loans.filter((l) => {
            const id = String(l._id || "").toLowerCase();
            const name = String(l.userName || "").toLowerCase();
            const email = String(l.userEmail || "").toLowerCase();
            const title = String(l.loanTitle || "").toLowerCase();
            return id.includes(q) || name.includes(q) || email.includes(q) || title.includes(q);
        });
    }, [loans, search]);

    const handleCancelApproved = async (id) => {
        const result = await Swal.fire({
            title: "Cancel this approved loan?",
            text: "This will mark it as cancelled (used when approval was a mistake).",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${id}/cancel-approved`, {
            method: "PATCH",
            credentials: "include",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            Swal.fire("Error", err.message || "Failed to cancel approval.", "error");
            return;
        }

        queryClient.invalidateQueries(["approvedLoans"]);
        Swal.fire("Updated", "Approval cancelled successfully.", "success");
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
                Loading...
            </div>
        );
    }

    return (
        <div
            ref={wrapRef}
            className="space-y-6"
            style={{
                background:
                    "radial-gradient(900px 420px at 12% 8%, color-mix(in oklab, var(--secondary) 14%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 18%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 58%), transparent",
            }}
        >
            <Motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="space-y-6"
            >
                <div className="al-reveal flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                            Approved Loan Applications
                        </h1>
                        <p className="mt-1" style={{ color: "var(--muted)" }}>
                            Approved applications ready for fee payment and next steps.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div
                            className="flex items-center gap-2 rounded-2xl border px-3 h-12"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            }}
                        >
                            <Search size={18} style={{ color: "var(--muted)" }} />
                            <input
                                className="w-full sm:w-96 bg-transparent outline-none text-sm"
                                placeholder="Search by ID, applicant, email, or loan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ color: "var(--text)" }}
                            />
                            <Filter size={18} style={{ color: "var(--muted)" }} />
                        </div>

                        <span
                            className="inline-flex items-center justify-center rounded-2xl border px-4 h-12 text-sm font-bold"
                            style={{
                                borderColor: "color-mix(in oklab, var(--success) 25%, var(--border))",
                                backgroundColor: "color-mix(in oklab, var(--success) 14%, transparent)",
                                color: "var(--text)",
                                minWidth: 132,
                            }}
                        >
                            <span className="inline-flex items-center gap-2">
                                <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                                {filtered.length} Approved
                            </span>
                        </span>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="al-reveal rounded-3xl border p-8 text-center" style={shellStyle}>
                        <p className="text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                            No approved loans yet.
                        </p>
                    </div>
                ) : (
                    <div className="al-reveal rounded-3xl border overflow-hidden" style={shellStyle}>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead
                                    style={{
                                        backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                                        color: "var(--text)",
                                    }}
                                >
                                    <tr>
                                        <th className="font-semibold">Applicant</th>
                                        <th className="font-semibold">Loan</th>
                                        <th className="font-semibold">Amount</th>
                                        <th className="font-semibold">Approved</th>
                                        <th className="font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((loan, index) => (
                                        <Motion.tr
                                            key={loan._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(index * 0.02, 0.2) }}
                                            className="group"
                                            style={{ borderColor: "var(--border)" }}
                                        >
                                            <td>
                                                <div className="min-w-85">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className="grid h-10 w-10 place-items-center rounded-2xl border"
                                                            style={{
                                                                borderColor: "var(--border)",
                                                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                                color: "var(--primary)",
                                                            }}
                                                        >
                                                            <User size={16} />
                                                        </span>

                                                        <div className="min-w-0">
                                                            <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                                                                {loan.userName || "—"}
                                                            </p>
                                                            <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Mail size={14} style={{ color: "var(--muted)" }} />
                                                                    {loan.userEmail || "—"}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        <span
                                                            className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold"
                                                            style={{
                                                                borderColor: "var(--border)",
                                                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                                color: "var(--muted)",
                                                            }}
                                                        >
                                                            <Hash size={12} />
                                                            {String(loan._id || "").slice(-6)}
                                                        </span>

                                                        <span
                                                            className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold"
                                                            style={{
                                                                borderColor: "color-mix(in oklab, var(--success) 25%, var(--border))",
                                                                backgroundColor: "color-mix(in oklab, var(--success) 12%, transparent)",
                                                                color: "var(--text)",
                                                            }}
                                                        >
                                                            <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
                                                            Approved
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="min-w-60">
                                                    <p className="font-semibold" style={{ color: "var(--text)" }}>
                                                        {loan.loanTitle || "—"}
                                                    </p>
                                                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                                                        Loan ID: {loan.loanId ? String(loan.loanId).slice(-8) : "—"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td>
                                                <div
                                                    className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold"
                                                    style={{
                                                        borderColor: "var(--border)",
                                                        backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
                                                        color: "var(--text)",
                                                    }}
                                                >
                                                    <DollarSign size={16} style={{ color: "var(--primary)" }} />
                                                    {loan.amount ?? "—"}
                                                </div>
                                            </td>

                                            <td className="text-sm" style={{ color: "var(--muted)" }}>
                                                <span className="inline-flex items-center gap-2">
                                                    <Clock size={16} style={{ color: "var(--muted)" }} />
                                                    {loan.approvedAt ? new Date(loan.approvedAt).toLocaleDateString() : "—"}
                                                </span>
                                            </td>

                                            <td className="text-right">
                                                <div className="flex justify-end">
                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleCancelApproved(loan._id)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border whitespace-normal wrap-break-words cursor-pointer"
                                                        style={{
                                                            borderColor: "color-mix(in oklab, var(--danger) 28%, var(--border))",
                                                            backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)",
                                                            color: "var(--text)",
                                                            maxWidth: 220,
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <XCircle size={16} style={{ color: "var(--danger)" }} />
                                                            <span className="hidden sm:inline cursor-pointer">Cancel Approval</span>
                                                            <span className="sm:hidden">Cancel</span>
                                                        </span>
                                                    </Motion.button>
                                                </div>
                                            </td>
                                        </Motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                            }}
                        >
                            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                                <ShieldAlert size={16} style={{ color: "color-mix(in oklab, var(--danger) 70%, var(--muted))" }} />
                                Use “Cancel Approval” only when approval was a mistake.
                            </div>
                            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                Total approved: {loans.length}
                            </span>
                        </div>
                    </div>
                )}
            </Motion.div>
        </div>
    );
};

export default ApprovedLoans;
