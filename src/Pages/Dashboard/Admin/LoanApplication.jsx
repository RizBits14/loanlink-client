import { useMemo, useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import {
    Search,
    Filter,
    Calendar,
    User2,
    Mail,
    DollarSign,
    FileText,
    Hash,
    Eye,
    BadgeCheck,
    BadgeX,
    BadgeAlert,
    Ban,
} from "lucide-react";
import useAllApplications from "../../../Hooks/useAllApplications";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const statusMeta = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") return { icon: BadgeCheck, chipBg: "color-mix(in oklab, var(--success) 14%, transparent)", chipBd: "color-mix(in oklab, var(--success) 26%, var(--border))", iconColor: "var(--success)" };
    if (s === "rejected") return { icon: BadgeX, chipBg: "color-mix(in oklab, var(--danger) 14%, transparent)", chipBd: "color-mix(in oklab, var(--danger) 26%, var(--border))", iconColor: "var(--danger)" };
    if (s === "cancelled") return { icon: Ban, chipBg: "color-mix(in oklab, var(--muted) 10%, transparent)", chipBd: "var(--border)", iconColor: "var(--muted)" };
    return { icon: BadgeAlert, chipBg: "color-mix(in oklab, var(--warning) 14%, transparent)", chipBd: "color-mix(in oklab, var(--warning) 26%, var(--border))", iconColor: "var(--warning)" };
};

const LoanApplications = () => {
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const wrapRef = useRef(null);

    const { data: applications = [], isLoading } = useAllApplications(status);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".la-reveal",
                { opacity: 0, y: 14, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return applications;

        return applications.filter((a) => {
            const id = String(a._id || "").toLowerCase();
            const name = String(a.userName || "").toLowerCase();
            const email = String(a.userEmail || "").toLowerCase();
            const loan = String(a.loanTitle || "").toLowerCase();
            const st = String(a.status || "").toLowerCase();
            return id.includes(q) || name.includes(q) || email.includes(q) || loan.includes(q) || st.includes(q);
        });
    }, [applications, search]);

    const handleView = (app) => {
        const meta = statusMeta(app.status);
        const Icon = meta.icon;

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
          <div
            class="p-5 sm:p-6"
            style="background-color: color-mix(in oklab, var(--surface) 88%, transparent);"
          >
            <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">
              Application
            </p>

            <div class="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xl sm:text-2xl font-extrabold tracking-tight" style="color: var(--text)">
                  Loan Application Details
                </p>
                <p class="mt-1 text-sm" style="color: var(--muted)">
                  Submitted ${app.createdAt ? new Date(app.createdAt).toLocaleString() : "—"}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold capitalize"
                  style="
                    border-color: ${meta.chipBd};
                    background-color: ${meta.chipBg};
                    color: var(--text);
                  "
                >
                  <span class="grid h-5 w-5 place-items-center rounded-xl border"
                        style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${meta.iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      ${app.status && String(app.status).toLowerCase() === "approved"
                    ? `<path d="M20 6L9 17l-5-5"></path>`
                    : app.status && String(app.status).toLowerCase() === "rejected"
                        ? `<path d="M18 6L6 18"></path><path d="M6 6l12 12"></path>`
                        : app.status && String(app.status).toLowerCase() === "cancelled"
                            ? `<circle cx="12" cy="12" r="10"></circle><path d="M4.9 4.9l14.2 14.2"></path>`
                            : `<path d="M12 9v4"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="10"></circle>`
                }
                    </svg>
                  </span>
                  ${String(app.status || "pending").toLowerCase()}
                </span>

                <span
                  class="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--muted);
                  "
                  title="Short ID"
                >
                  <span class="h-1.5 w-1.5 rounded-full" style="background-color: var(--muted)"></span>
                  ID: …${String(app._id || "").slice(-6)}
                </span>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--primary) 10%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Amount</p>
                <p class="mt-1 text-2xl font-extrabold tracking-tight" style="color: var(--text)">$${app.amount ?? "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--secondary) 10%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Monthly Income</p>
                <p class="mt-1 text-2xl font-extrabold tracking-tight" style="color: var(--text)">${app.monthlyIncome ?? "—"}</p>
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
                <p class="mt-1 font-bold" style="color: var(--text)">${app.userName || "—"}</p>
                <p class="mt-1 text-sm break-all" style="color: var(--muted)">${app.userEmail || "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Loan</p>
                <p class="mt-1 font-bold" style="color: var(--text)">${app.loanTitle || "—"}</p>
                <p class="mt-1 text-sm" style="color: var(--muted)">${app.loanCategory || "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Application ID</p>
                <p class="mt-2 text-sm break-all" style="color: var(--text)">${app._id || "—"}</p>
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Reason</p>
                <div
                  class="mt-3 rounded-2xl border p-4 text-sm leading-relaxed"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 88%, transparent);
                    color: var(--text);
                  "
                >
                  ${app.reason || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
        });
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
            <Motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-6">
                <div className="la-reveal flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                            Loan Applications
                        </h1>
                        <p className="mt-1" style={{ color: "var(--muted)" }}>
                            Review applications across all statuses with quick filtering and search.
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
                                className="w-full sm:w-80 bg-transparent outline-none text-sm"
                                placeholder="Search by ID, user, email, loan, status..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ color: "var(--text)" }}
                            />
                        </div>

                        <div
                            className="flex items-center gap-2 rounded-2xl border px-3 h-12"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                            }}
                        >
                            <Filter size={18} style={{ color: "var(--muted)" }} />
                            <select
                                className="bg-transparent outline-none text-sm w-full sm:w-48"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ color: "var(--text)" }}
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <span
                            className="inline-flex items-center justify-center rounded-2xl border px-4 h-12 text-sm font-bold"
                            style={{
                                borderColor: "color-mix(in oklab, var(--primary) 22%, var(--border))",
                                backgroundColor: "color-mix(in oklab, var(--primary) 12%, transparent)",
                                color: "var(--text)",
                                minWidth: 140,
                            }}
                        >
                            Total: {filtered.length}
                        </span>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="la-reveal rounded-3xl border p-8 text-center" style={shellStyle}>
                        <p className="text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                            No loan applications found.
                        </p>
                    </div>
                ) : (
                    <div className="la-reveal rounded-3xl border overflow-hidden" style={shellStyle}>
                        <div className="overflow-x-auto">
                            <table className="table w-full min-w-275">
                                <thead
                                    style={{
                                        backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                                        color: "var(--text)",
                                    }}
                                >
                                    <tr>
                                        <th className="font-semibold">Application</th>
                                        <th className="font-semibold">Loan</th>
                                        <th className="font-semibold">Amount</th>
                                        <th className="font-semibold">Status</th>
                                        <th className="font-semibold">Date</th>
                                        <th className="font-semibold text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((app, i) => {
                                        const meta = statusMeta(app.status);
                                        const Icon = meta.icon;

                                        return (
                                            <Motion.tr
                                                key={app._id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(i * 0.015, 0.2) }}
                                                className="group"
                                                style={{ borderColor: "var(--border)" }}
                                            >
                                                <td className="whitespace-nowrap">
                                                    <div className="min-w-95">
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className="grid h-10 w-10 place-items-center rounded-2xl border"
                                                                style={{
                                                                    borderColor: "var(--border)",
                                                                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                                    color: "var(--primary)",
                                                                }}
                                                            >
                                                                <FileText size={16} />
                                                            </span>

                                                            <div className="min-w-0">
                                                                <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                                                                    {app.userName || "—"}
                                                                </p>
                                                                <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Mail size={14} style={{ color: "var(--muted)" }} />
                                                                        {app.userEmail || "—"}
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
                                                                {String(app._id || "").slice(-6)}
                                                            </span>
                                                            <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                                                                Full ID: <span className="font-mono">{String(app._id || "—")}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <div className="min-w-55">
                                                        <p className="font-semibold" style={{ color: "var(--text)" }}>
                                                            {app.loanTitle || "—"}
                                                        </p>
                                                        <p className="text-sm" style={{ color: "var(--muted)" }}>
                                                            <span className="inline-flex items-center gap-2">
                                                                <User2 size={16} style={{ color: "var(--muted)" }} />
                                                                {app.loanCategory || "—"}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <span
                                                        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold"
                                                        style={{
                                                            borderColor: "var(--border)",
                                                            backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <DollarSign size={16} style={{ color: "var(--primary)" }} />
                                                        {app.amount ?? "—"}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <span
                                                        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold capitalize"
                                                        style={{
                                                            borderColor: meta.chipBd,
                                                            backgroundColor: meta.chipBg,
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <Icon size={16} style={{ color: meta.iconColor }} />
                                                        {app.status || "—"}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap text-sm" style={{ color: "var(--muted)" }}>
                                                    <span className="inline-flex items-center gap-2">
                                                        <Calendar size={16} style={{ color: "var(--muted)" }} />
                                                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                                                    </span>
                                                </td>

                                                <td className="text-right whitespace-nowrap">
                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleView(app)}
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
                                                </td>
                                            </Motion.tr>
                                        );
                                    })}
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
                            <p className="text-sm" style={{ color: "var(--muted)" }}>
                                Tip: Use status filter + search together to quickly locate specific applications.
                            </p>
                            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                Showing: {filtered.length} / {applications.length}
                            </span>
                        </div>
                    </div>
                )}
            </Motion.div>
        </div>
    );
};

export default LoanApplications;
