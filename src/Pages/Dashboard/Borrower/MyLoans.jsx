import { useEffect, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Ban,
  CreditCard,
  Eye,
  Hourglass,
  Receipt,
  XCircle,
} from "lucide-react";
import useMyLoans from "../../../Hooks/useMyLoans";

const badgeTone = (status) => {
  if (status === "approved") return { bg: "var(--success)", soft: "color-mix(in oklab, var(--success) 16%, transparent)" };
  if (status === "rejected") return { bg: "var(--danger)", soft: "color-mix(in oklab, var(--danger) 16%, transparent)" };
  if (status === "cancelled") return { bg: "var(--muted)", soft: "color-mix(in oklab, var(--muted) 16%, transparent)" };
  return { bg: "var(--warning)", soft: "color-mix(in oklab, var(--warning) 16%, transparent)" };
};

const money = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return `$${v}`;
  return `$${n.toLocaleString()}`;
};

const MyLoans = () => {
  const { data: loans = [], isLoading } = useMyLoans();
  const queryClient = useQueryClient();
  const wrapRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const applicationId = params.get("applicationId");

    if (success === "true" && applicationId) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${applicationId}/pay`, {
        credentials: "include",
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provider: "stripe",
          amount: 10,
          currency: "usd",
          transactionId: `TXN-${Date.now()}`,
        }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message || "Payment update failed");
          return data;
        })
        .then(() => {
          Swal.fire("Payment Successful", "Fee paid successfully.", "success");
          queryClient.invalidateQueries(["myLoans"]);
          window.history.replaceState({}, document.title, "/dashboard/my-loans");
        })
        .catch((err) => {
          Swal.fire("Error", err.message, "error");
          window.history.replaceState({}, document.title, "/dashboard/my-loans");
        });
    }
  }, [queryClient]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ml-reveal",
        { opacity: 0, y: 18, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Loan?",
      text: "You can only cancel pending applications.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancel Application",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${id}/cancel`, {
      credentials: "include",
      method: "PATCH",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return Swal.fire("Error", data?.message || "Cancel failed", "error");
    }

    queryClient.invalidateQueries(["myLoans"]);
    Swal.fire("Cancelled", "Loan application cancelled.", "success");
  };

  const handlePay = async (loan) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-payment-session`, {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        applicationId: loan._id,
        userEmail: loan.userEmail,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return Swal.fire("Error", data?.message || "Failed to start payment", "error");

    window.location.assign(data.url);
  };

  const handlePaymentDetails = async (loan) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications/${loan._id}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to load payment info");

      const p = data.paymentInfo || {};

      Swal.fire({
        title: "Payment Details",
        width: "90%",
        html: `
          <div class="space-y-3 text-base-content">
            <div class="p-4 rounded-xl bg-base-200">
              <p class="text-xs uppercase opacity-60">Payment Status</p>
              <p class="font-semibold text-lg">Paid</p>
              <p class="text-sm opacity-70">${data.paidAt ? new Date(data.paidAt).toLocaleString() : "—"}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-4 rounded-xl bg-base-100 border">
                <p class="text-xs uppercase opacity-60">Email</p>
                <p class="font-medium break-all">${p.email || data.userEmail || "—"}</p>
              </div>
              <div class="p-4 rounded-xl bg-base-100 border">
                <p class="text-xs uppercase opacity-60">Transaction ID</p>
                <p class="font-medium break-all">${p.transactionId || "—"}</p>
              </div>
              <div class="p-4 rounded-xl bg-base-100 border">
                <p class="text-xs uppercase opacity-60">Application ID</p>
                <p class="font-medium break-all">${data._id || "—"}</p>
              </div>
              <div class="p-4 rounded-xl bg-base-100 border">
                <p class="text-xs uppercase opacity-60">Loan ID</p>
                <p class="font-medium break-all">${p.loanId || data.loanId || "—"}</p>
              </div>
              <div class="p-4 rounded-xl bg-base-100 border">
                <p class="text-xs uppercase opacity-60">Loan Title</p>
                <p class="font-medium">${p.loanTitle || data.loanTitle || "—"}</p>
              </div>
              <div class="p-4 rounded-xl bg-base-100 border">
                <p class="text-xs uppercase opacity-60">Amount</p>
                <p class="font-medium">$${p.amount ?? 10} ${(p.currency || "usd").toUpperCase()}</p>
              </div>
              <div class="p-4 rounded-xl bg-base-100 border sm:col-span-2">
                <p class="text-xs uppercase opacity-60">Provider</p>
                <p class="font-medium capitalize">${p.provider || "stripe"}</p>
                ${p.sessionId ? `<p class="text-sm opacity-70 break-all">Session: ${p.sessionId}</p>` : ""}
              </div>
            </div>
          </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleView = (loan) => {
    Swal.fire({
      title: "Loan Details",
      width: "90%",
      html: `
        <div class="space-y-4 text-base-content">
          <div class="p-4 bg-base-200 rounded-xl shadow-sm">
            <p class="text-sm uppercase opacity-60">Loan Title</p>
            <p class="font-semibold text-lg">${loan.loanTitle}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 bg-base-100 rounded-xl shadow-sm border">
              <p class="text-xs uppercase opacity-60">Loan Amount</p>
              <p class="font-semibold text-primary">$${loan.amount}</p>
            </div>
            <div class="p-4 bg-base-100 rounded-xl shadow-sm border">
              <p class="text-xs uppercase opacity-60">Status</p>
              <span class="badge ${loan.status === "approved"
          ? "badge-success"
          : loan.status === "rejected"
            ? "badge-error"
            : loan.status === "cancelled"
              ? "badge-neutral"
              : "badge-warning"}">
                ${loan.status}
              </span>
            </div>
          </div>
          <div class="p-4 bg-base-200 rounded-xl shadow-sm">
            <p class="text-xs uppercase opacity-60">Application Fee</p>
            <p class="font-semibold">${loan.feeStatus === "paid" ? "Paid" : "Unpaid"}</p>
            ${loan.feeStatus === "paid"
          ? `<p class="text-sm opacity-70">${loan.paidAt ? new Date(loan.paidAt).toLocaleDateString() : "—"}</p>`
          : ""}
          </div>
          <div class="p-4 bg-base-200 rounded-xl shadow-sm">
            <p class="text-xs uppercase opacity-60">Application ID</p>
            <p class="text-sm break-all">${loan._id}</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });
  };

  const totals = useMemo(() => {
    const total = loans.length;
    const pending = loans.filter((l) => l.status === "pending").length;
    const approved = loans.filter((l) => l.status === "approved").length;
    const rejected = loans.filter((l) => l.status === "rejected").length;
    const cancelled = loans.filter((l) => l.status === "cancelled").length;
    const unpaidFees = loans.filter((l) => l.status === "approved" && l.feeStatus === "unpaid").length;
    return { total, pending, approved, rejected, cancelled, unpaidFees };
  }, [loans]);

  if (isLoading) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  return (
    <Motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="ml-reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            My Loans
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Track your applications, fee payments, and decisions in one place.
          </p>
        </div>

        <div
          className="rounded-2xl border px-4 py-3"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
          }}
        >
          <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
            Total applications
          </p>
          <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
            {totals.total}
          </p>
        </div>
      </div>

      <div className="ml-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <SummaryChip icon={<Hourglass size={16} />} label="Pending" value={totals.pending} tone="warning" />
        <SummaryChip icon={<BadgeCheck size={16} />} label="Approved" value={totals.approved} tone="success" />
        <SummaryChip icon={<XCircle size={16} />} label="Rejected" value={totals.rejected} tone="danger" />
        <SummaryChip icon={<Ban size={16} />} label="Cancelled" value={totals.cancelled} tone="muted" />
        <SummaryChip icon={<Receipt size={16} />} label="Fee unpaid" value={totals.unpaidFees} tone="secondary" span2 />
      </div>

      {loans.length === 0 ? (
        <div
          className="ml-reveal rounded-3xl border p-8 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            You haven’t applied for any loans yet.
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Browse programs and submit your first application.
          </p>
        </div>
      ) : (
        <div
          className="ml-reveal rounded-3xl border overflow-hidden"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead
                style={{
                  backgroundColor: "color-mix(in oklab, var(--surface) 86%, transparent)",
                  color: "var(--muted)",
                }}
              >
                <tr>
                  <th className="font-semibold">Loan</th>
                  <th className="font-semibold">Amount</th>
                  <th className="font-semibold">Status</th>
                  <th className="font-semibold">Application Fee</th>
                  <th className="font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => {
                  const tone = badgeTone(loan.status);
                  const isPending = loan.status === "pending";
                  const canPay = loan.status === "approved" && loan.feeStatus === "unpaid";

                  return (
                    <tr
                      key={loan._id}
                      className="transition-colors"
                      style={{
                        borderColor: "var(--border)",
                      }}
                    >
                      <td>
                        <div className="min-w-[220px]">
                          <p className="font-semibold" style={{ color: "var(--text)" }}>
                            {loan.loanTitle}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                            ID: {loan._id?.slice(-6)}
                          </p>
                        </div>
                      </td>

                      <td className="font-semibold" style={{ color: "var(--text)" }}>
                        {money(loan.amount)}
                      </td>

                      <td>
                        <span
                          className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold capitalize"
                          style={{
                            borderColor: "var(--border)",
                            backgroundColor: tone.soft,
                            color: tone.bg,
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.bg }} />
                          {loan.status}
                        </span>
                      </td>

                      <td>
                        {loan.feeStatus === "paid" ? (
                          <button
                            onClick={() => handlePaymentDetails(loan)}
                            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5"
                            style={{
                              borderColor: "var(--border)",
                              backgroundColor: "color-mix(in oklab, var(--success) 14%, transparent)",
                              color: "var(--success)",
                            }}
                          >
                            <Receipt size={14} />
                            Paid
                          </button>
                        ) : (
                          <span
                            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold"
                            style={{
                              borderColor: "var(--border)",
                              backgroundColor: "color-mix(in oklab, var(--muted) 10%, transparent)",
                              color: "var(--muted)",
                            }}
                          >
                            Unpaid
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          <ActionBtn
                            label="View"
                            icon={<Eye size={14} />}
                            onClick={() => handleView(loan)}
                            tone="base"
                          />

                          {isPending && (
                            <ActionBtn
                              label="Cancel"
                              icon={<Ban size={14} />}
                              onClick={() => handleCancel(loan._id)}
                              tone="danger"
                            />
                          )}

                          {canPay && (
                            <ActionBtn
                              label="Pay $10"
                              icon={<CreditCard size={14} />}
                              onClick={() => handlePay(loan)}
                              tone="primary"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Motion.div>
  );
};

const SummaryChip = ({ icon, label, value, tone, span2 }) => {
  const toneColor =
    tone === "success"
      ? "var(--success)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "danger"
          ? "var(--danger)"
          : tone === "secondary"
            ? "var(--secondary)"
            : "var(--muted)";

  return (
    <div
      className={`rounded-2xl border p-4 ${span2 ? "lg:col-span-2" : ""}`}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ backgroundColor: `color-mix(in oklab, ${toneColor} 16%, transparent)`, color: toneColor }}
          >
            {icon}
          </span>
          <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
            {label}
          </p>
        </div>
        <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
};

const ActionBtn = ({ label, icon, onClick, tone = "base" }) => {
  const styles =
    tone === "primary"
      ? {
        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
        color: "white",
        boxShadow: "0 14px 34px color-mix(in oklab, var(--primary) 18%, transparent)",
        borderColor: "transparent",
      }
      : tone === "danger"
        ? {
          backgroundColor: "color-mix(in oklab, var(--danger) 14%, transparent)",
          color: "var(--danger)",
          borderColor: "color-mix(in oklab, var(--danger) 28%, var(--border))",
        }
        : {
          backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
          color: "var(--text)",
          borderColor: "var(--border)",
        };

  return (
    <Motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all duration-300"
      style={styles}
    >
      {icon}
      {label}
    </Motion.button>
  );
};

export default MyLoans;
