import React from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Eye,
    Search,
    Filter,
    Clock,
    Mail,
    User,
    DollarSign,
    Hash,
} from "lucide-react";
import usePendingLoans from "../../../Hooks/usePendingLoans";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const PendingLoans = () => {
    const { data: loans = [], isLoading } = usePendingLoans();
    const queryClient = useQueryClient();
    const wrapRef = useRef(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".pl-reveal",
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

    const handleView = (loan) => {
        const status = (loan.status || "pending").toLowerCase();
        const tone =
            status === "approved"
                ? { bg: "var(--success)", soft: "color-mix(in oklab, var(--success) 16%, transparent)" }
                : status === "rejected"
                    ? { bg: "var(--danger)", soft: "color-mix(in oklab, var(--danger) 16%, transparent)" }
                    : status === "cancelled"
                        ? { bg: "var(--muted)", soft: "color-mix(in oklab, var(--muted) 16%, transparent)" }
                        : { bg: "var(--warning)", soft: "color-mix(in oklab, var(--warning) 16%, transparent)" };

        Swal.fire({
            title: "",
            width: "min(860px, 92vw)",
            padding: 0,
            background: "color-mix(in oklab, var(--surface) 96%, transparent)",
            backdrop: "rgba(2, 6, 23, 0.72)",
            showCloseButton: true,
            showConfirmButton: false,
            buttonsStyling: false,
            customClass: {
                popup: "rounded-3xl p-0 overflow-hidden",
                htmlContainer: "p-0 m-0 w-full",
                closeButton: "rounded-2xl",
                title: "hidden",
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                const close = Swal.getCloseButton();

                if (popup) {
                    popup.style.border = "1px solid var(--border)";
                    popup.style.boxShadow = "var(--card-shadow)";
                    popup.style.position = "relative";
                }

                if (close) {
                    close.style.position = "absolute";
                    close.style.top = "14px";
                    close.style.right = "14px";
                    close.style.width = "42px";
                    close.style.height = "42px";
                    close.style.display = "flex";
                    close.style.alignItems = "center";
                    close.style.justifyContent = "center";
                    close.style.padding = "0";
                    close.style.border = "1px solid var(--border)";
                    close.style.borderRadius = "16px";
                    close.style.backgroundColor = "color-mix(in oklab, var(--surface) 92%, transparent)";
                    close.style.color = "var(--muted)";
                    close.style.margin = "0";
                    close.style.fontSize = "28px";
                    close.style.fontWeight = "800";
                    close.style.lineHeight = "1";
                    close.style.textAlign = "center";
                    close.style.transform = "translateY(-1px)";
                }
            },
            html: `
      <div class="text-left" style="color: var(--text)">
        <div
          class="rounded-3xl border overflow-hidden"
          style="
            border-color: var(--border);
            background-color: color-mix(in oklab, var(--surface) 92%, transparent);
            box-shadow: var(--card-shadow);
          "
        >
          <div class="p-5 sm:p-6" style="background-color: color-mix(in oklab, var(--surface) 92%, transparent);">
            <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Application</p>

            <div class="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p class="text-xl sm:text-2xl font-extrabold tracking-tight" style="color: var(--text)">
                  Loan Application Details
                </p>
                <p class="mt-1 text-sm" style="color: var(--muted)">
                  Submitted ${loan.createdAt ? new Date(loan.createdAt).toLocaleString() : "—"}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold capitalize"
                  style="border-color: var(--border); background-color: ${tone.soft}; color: ${tone.bg};"
                >
                  <span class="h-1.5 w-1.5 rounded-full" style="background-color: ${tone.bg}"></span>
                  ${status}
                </span>

                <span
                  class="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold"
                  style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent); color: var(--muted);"
                  title="Short ID"
                >
                  <span class="h-1.5 w-1.5 rounded-full" style="background-color: var(--muted)"></span>
                  ID: …${String(loan._id || "").slice(-6)}
                </span>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--primary) 10%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Requested Amount</p>
                <p class="mt-1 text-2xl font-extrabold tracking-tight" style="color: var(--text)">$${loan.amount ?? "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Full Loan ID</p>
                <p class="mt-1 font-medium break-all" style="color: var(--text)">${loan._id || "—"}</p>
              </div>
            </div>
          </div>

          <div class="p-5 sm:p-6 pt-0 sm:pt-0" style="background-color: color-mix(in oklab, var(--surface) 96%, transparent);">
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Applicant</p>
                <p class="mt-1 font-bold" style="color: var(--text)">${loan.userName || "—"}</p>
                <p class="mt-1 text-sm break-all" style="color: var(--muted)">${loan.userEmail || "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Loan</p>
                <p class="mt-1 font-bold" style="color: var(--text)">${loan.loanTitle || "—"}</p>
                <p class="mt-1 text-sm break-all" style="color: var(--muted)">${loan.loanId || "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Applicant Message</p>
                ${loan.message
                    ? `
                      <div
                        class="mt-3 rounded-2xl border p-4 text-sm leading-relaxed"
                        style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 88%, transparent); color: var(--text);"
                      >
                        ${loan.message}
                      </div>
                    `
                    : `<p class="mt-2 text-sm" style="color: var(--muted)">No message provided.</p>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
        });
    };



    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: "Approve Loan?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Approve",
            confirmButtonColor: "#22c55e",
        });

        if (!result.isConfirmed) return;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${id}/approve`, {
            method: "PATCH",
            credentials: "include",
        });

        queryClient.invalidateQueries(["pendingLoans"]);
        Swal.fire("Approved", "Loan has been approved.", "success");
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: "Reject Loan?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reject",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${id}/reject`, {
            method: "PATCH",
        });

        queryClient.invalidateQueries(["pendingLoans"]);
        Swal.fire("Rejected", "Loan has been rejected.", "success");
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                <div className="pl-reveal flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                            Pending Loan Applications
                        </h1>
                        <p className="mt-1" style={{ color: "var(--muted)" }}>
                            Review, approve, or reject applications awaiting decision.
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
                                borderColor: "color-mix(in oklab, var(--warning) 25%, var(--border))",
                                backgroundColor: "color-mix(in oklab, var(--warning) 14%, transparent)",
                                color: "var(--text)",
                                minWidth: 120,
                            }}
                        >
                            <span className="inline-flex items-center gap-2">
                                <Clock size={16} style={{ color: "var(--warning)" }} />
                                {filtered.length} Pending
                            </span>
                        </span>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="pl-reveal rounded-3xl border p-8 text-center" style={shellStyle}>
                        <p className="text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                            No pending loan applications.
                        </p>
                    </div>
                ) : (
                    <div className="pl-reveal rounded-3xl border overflow-hidden" style={shellStyle}>
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
                                        <th className="font-semibold">Applied</th>
                                        <th className="font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((loan) => (
                                        <Motion.tr
                                            key={loan._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut" }}
                                            className="group"
                                            style={{ borderColor: "var(--border)" }}
                                        >
                                            <td>
                                                <div className="min-w-[320px]">
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
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="min-w-60">
                                                    <p className="font-semibold" style={{ color: "var(--text)" }}>
                                                        {loan.loanTitle || "—"}
                                                    </p>
                                                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                                                        ID: {loan.loanId ? String(loan.loanId).slice(-8) : "—"}
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
                                                {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : "—"}
                                            </td>

                                            <td className="text-right">
                                                <div className="flex flex-col sm:flex-row justify-end gap-2">
                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleView(loan)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                        style={{
                                                            borderColor: "var(--border)",
                                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <Eye size={16} style={{ color: "var(--muted)" }} />
                                                            View
                                                        </span>
                                                    </Motion.button>

                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleApprove(loan._id)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                        style={{
                                                            borderColor: "color-mix(in oklab, var(--success) 28%, var(--border))",
                                                            backgroundColor: "color-mix(in oklab, var(--success) 12%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                                                            Approve
                                                        </span>
                                                    </Motion.button>

                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleReject(loan._id)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                        style={{
                                                            borderColor: "color-mix(in oklab, var(--danger) 28%, var(--border))",
                                                            backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <XCircle size={16} style={{ color: "var(--danger)" }} />
                                                            Reject
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
                            className="flex items-center justify-between gap-3 px-5 py-4 border-t"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                            }}
                        >
                            <p className="text-sm" style={{ color: "var(--muted)" }}>
                                Tip: Open “View” to see full applicant details before deciding.
                            </p>
                            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                Total pending: {loans.length}
                            </span>
                        </div>
                    </div>
                )}
            </Motion.div>
        </div>
    );
};

export default PendingLoans;
