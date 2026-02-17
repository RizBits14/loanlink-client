/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import {
    BadgeCheck,
    Coins,
    CreditCard,
    FileText,
    Landmark,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    User,
} from "lucide-react";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ApplyLoan = () => {
    const { id } = useParams();
    const isFromBanner = !id;
    const { user } = useAuth();
    const navigate = useNavigate();

    const wrapRef = useRef(null);

    const [selectedLoanId, setSelectedLoanId] = useState("");
    const [activeLoan, setActiveLoan] = useState(null);

    const { data: loanFromParam } = useQuery({
        enabled: !!id,
        queryKey: ["loan", id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${id}`);
            return res.json();
        },
    });

    const { data: loans = [] } = useQuery({
        enabled: isFromBanner,
        queryKey: ["allLoans"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans`);
            return res.json();
        },
    });

    useEffect(() => {
        if (loanFromParam) setActiveLoan(loanFromParam);
    }, [loanFromParam]);

    useEffect(() => {
        if (isFromBanner && selectedLoanId) {
            const found = loans.find((l) => l._id === selectedLoanId);
            setActiveLoan(found || null);
        }
    }, [selectedLoanId, loans, isFromBanner]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".al-reveal",
                { opacity: 0, y: 16, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const maxLimit = Number(activeLoan?.maxLoanLimit || 0);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({ mode: "onChange" });

    const loanMeta = useMemo(() => {
        if (!activeLoan) return null;
        return {
            title: activeLoan.title,
            category: activeLoan.category,
            interestRate: activeLoan.interestRate,
            maxLoanLimit: activeLoan.maxLoanLimit,
            emiPlans: Array.isArray(activeLoan.emiPlans) ? activeLoan.emiPlans : [],
        };
    }, [activeLoan]);

    const onSubmit = async (data) => {
        if (!activeLoan) {
            Swal.fire("Select a Loan", "Please select a loan type.", "warning");
            return;
        }

        const summaryHtml = `
      <div style="text-align:left">
        <div style="padding:12px;border-radius:14px;background:rgba(0,0,0,0.04);margin-bottom:12px">
          <p style="margin:0;font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.08em">Loan Summary</p>
          <p style="margin:6px 0 0;font-weight:700;font-size:16px">${activeLoan.title}</p>
          <p style="margin:6px 0 0;opacity:.8">Interest: <b>${activeLoan.interestRate}%</b> • Max: <b>$${activeLoan.maxLoanLimit}</b></p>
        </div>
        <div style="padding:12px;border-radius:14px;background:rgba(0,0,0,0.04)">
          <p style="margin:0;font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.08em">Applicant</p>
          <p style="margin:6px 0 0;font-weight:700;font-size:16px">${data.firstName} ${data.lastName}</p>
          <p style="margin:6px 0 0;opacity:.8">Requested Amount: <b>$${data.amount}</b></p>
        </div>
      </div>
    `;

        const confirm = await Swal.fire({
            title: "Confirm Loan Application",
            html: summaryHtml,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Submit Application",
        });

        if (!confirm.isConfirmed) return;

        const application = {
            userEmail: user.email,
            userName: `${data.firstName} ${data.lastName}`,
            loanId: activeLoan._id,
            loanTitle: activeLoan.title,
            loanCategory: activeLoan.category,
            amount: data.amount,
            reason: data.reason,
            monthlyIncome: Number(data.monthlyIncome),
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loan-applications`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify(application),
            });

            if (!res.ok) throw new Error("Request failed");

            Swal.fire("Success!", "Loan application submitted.", "success");
            navigate("/dashboard/my-loans");
        } catch (err) {
            Swal.fire("Error", "Failed to submit application", "error");
        }
    };

    return (
        <div
            className="w-full"
            style={{
                background:
                    "radial-gradient(900px 420px at 15% 10%, color-mix(in oklab, var(--secondary) 14%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 18%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 58%), transparent",
            }}
        >
            <div ref={wrapRef} className="max-w-6xl mx-auto px-6 py-12 lg:py-14">
                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 space-y-6">
                        <Motion.div variants={fadeUp} initial="hidden" animate="show" className="al-reveal">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                                Apply for a Loan
                            </h1>
                            <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                                Complete the form below. Your application will be reviewed by a manager, and you can track the status in your dashboard.
                            </p>
                        </Motion.div>

                        <Motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            className="al-reveal rounded-3xl border p-6 sm:p-7 space-y-5"
                            style={shellStyle}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                        >
                            <Field
                                label="Account Email"
                                icon={<Mail size={16} style={{ color: "var(--primary)" }} />}
                            >
                                <input className="input input-bordered w-full rounded-2xl" value={user.email} readOnly />
                            </Field>

                            {isFromBanner && (
                                <Field
                                    label="Select Loan Type"
                                    icon={<Landmark size={16} style={{ color: "var(--secondary)" }} />}
                                >
                                    <select
                                        className="select select-bordered w-full rounded-2xl"
                                        value={selectedLoanId}
                                        onChange={(e) => setSelectedLoanId(e.target.value)}
                                    >
                                        <option value="">Select Loan Type</option>
                                        {loans.map((loan) => (
                                            <option key={loan._id} value={loan._id}>
                                                {loan.title}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="First Name" icon={<User size={16} style={{ color: "var(--primary)" }} />}>
                                    <input
                                        className="input input-bordered w-full rounded-2xl"
                                        placeholder="First Name"
                                        {...register("firstName", { required: true })}
                                    />
                                </Field>

                                <Field label="Last Name" icon={<User size={16} style={{ color: "var(--primary)" }} />}>
                                    <input
                                        className="input input-bordered w-full rounded-2xl"
                                        placeholder="Last Name"
                                        {...register("lastName", { required: true })}
                                    />
                                </Field>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="National ID / Passport" icon={<ShieldCheck size={16} style={{ color: "var(--secondary)" }} />}>
                                    <input
                                        className="input input-bordered w-full rounded-2xl"
                                        placeholder="National ID / Passport"
                                        {...register("nid", { required: true })}
                                    />
                                </Field>

                                <Field label="Contact Number" icon={<Phone size={16} style={{ color: "var(--secondary)" }} />}>
                                    <input
                                        className="input input-bordered w-full rounded-2xl"
                                        placeholder="Contact Number (10 digits)"
                                        {...register("contact", {
                                            required: "Contact number required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Must be exactly 10 digits",
                                            },
                                        })}
                                    />
                                    {errors.contact && (
                                        <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.contact.message}
                                        </p>
                                    )}
                                </Field>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Income Source" icon={<FileText size={16} style={{ color: "var(--primary)" }} />}>
                                    <input
                                        className="input input-bordered w-full rounded-2xl"
                                        placeholder="Income Source"
                                        {...register("incomeSource", { required: true })}
                                    />
                                </Field>

                                <Field label="Monthly Income" icon={<Coins size={16} style={{ color: "var(--success)" }} />}>
                                    <input
                                        className="input input-bordered w-full rounded-2xl"
                                        placeholder="Monthly Income"
                                        {...register("monthlyIncome", { required: true })}
                                    />
                                </Field>
                            </div>

                            <Field label="Reason for Loan" icon={<FileText size={16} style={{ color: "var(--secondary)" }} />}>
                                <textarea
                                    className="textarea textarea-bordered w-full rounded-2xl min-h-28"
                                    placeholder="Reason for Loan"
                                    {...register("reason", { required: true })}
                                />
                            </Field>

                            <Field label="Requested Amount" icon={<CreditCard size={16} style={{ color: "var(--primary)" }} />}>
                                <input
                                    type="number"
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder={activeLoan ? `Loan Amount (Max $${maxLimit})` : "Select a loan first"}
                                    disabled={!activeLoan}
                                    {...register("amount", {
                                        required: true,
                                        valueAsNumber: true,
                                        validate: (v) => v <= maxLimit || `Cannot exceed $${maxLimit}`,
                                    })}
                                />
                                {errors.amount && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        {errors.amount.message}
                                    </p>
                                )}
                            </Field>

                            <Field label="Address" icon={<MapPin size={16} style={{ color: "var(--secondary)" }} />}>
                                <textarea
                                    className="textarea textarea-bordered w-full rounded-2xl min-h-24"
                                    placeholder="Address"
                                    {...register("address", { required: true })}
                                />
                            </Field>

                            <Field label="Extra Notes (optional)" icon={<FileText size={16} style={{ color: "var(--muted)" }} />}>
                                <textarea
                                    className="textarea textarea-bordered w-full rounded-2xl min-h-24"
                                    placeholder="Extra Notes"
                                    {...register("notes")}
                                />
                            </Field>

                            <Motion.button
                                type="submit"
                                disabled={!isValid || !activeLoan}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                    color: "white",
                                    boxShadow: "0 16px 40px color-mix(in oklab, var(--primary) 20%, transparent)",
                                }}
                            >
                                Submit Application
                            </Motion.button>
                        </Motion.form>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-23 space-y-4">
                            <div className="al-reveal rounded-3xl border p-6 sm:p-7" style={shellStyle}>
                                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                    Selected loan
                                </p>

                                {loanMeta ? (
                                    <>
                                        <p className="mt-2 text-lg font-bold" style={{ color: "var(--text)" }}>
                                            {loanMeta.title}
                                        </p>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <MiniStat label="Category" value={loanMeta.category || "—"} icon={<Landmark size={16} />} tone="secondary" />
                                            <MiniStat label="Interest" value={`${loanMeta.interestRate}%`} icon={<BadgeCheck size={16} />} tone="primary" />
                                            <MiniStat label="Max limit" value={`$${loanMeta.maxLoanLimit}`} icon={<Coins size={16} />} tone="success" />
                                            <MiniStat label="EMI plans" value={loanMeta.emiPlans.length ? `${loanMeta.emiPlans.length} plans` : "—"} icon={<FileText size={16} />} tone="muted" />
                                        </div>

                                        <div
                                            className="mt-5 rounded-2xl border p-4"
                                            style={{
                                                borderColor: "var(--border)",
                                                background:
                                                    "linear-gradient(135deg, color-mix(in oklab, var(--secondary) 10%, transparent), color-mix(in oklab, var(--primary) 10%, transparent))",
                                            }}
                                        >
                                            <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                                                Tip
                                            </p>
                                            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
                                                Keep the requested amount within the maximum limit for faster review.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
                                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                            Choose a loan to continue
                                        </p>
                                        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                                            Select a loan type to see its details here.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="al-reveal rounded-3xl border p-6" style={shellStyle}>
                                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                    What happens next?
                                </p>
                                <div className="mt-3 space-y-3">
                                    <StepRow idx="1" label="Submit your application" />
                                    <StepRow idx="2" label="Manager review & decision" />
                                    <StepRow idx="3" label="Pay fee after approval" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, icon, children }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <span
                className="grid h-9 w-9 place-items-center rounded-2xl border"
                style={{
                    borderColor: "var(--border)",
                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                }}
            >
                {icon}
            </span>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {label}
            </p>
        </div>
        {children}
    </div>
);

const MiniStat = ({ label, value, icon, tone = "primary" }) => {
    const toneColor =
        tone === "success"
            ? "var(--success)"
            : tone === "secondary"
                ? "var(--secondary)"
                : tone === "muted"
                    ? "var(--muted)"
                    : "var(--primary)";

    return (
        <div
            className="rounded-2xl border p-4"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                        {label}
                    </p>
                    <p className="mt-1 text-sm font-bold" style={{ color: "var(--text)" }}>
                        {value}
                    </p>
                </div>
                <span
                    className="grid h-9 w-9 place-items-center rounded-2xl border"
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: `color-mix(in oklab, ${toneColor} 14%, transparent)`,
                        color: toneColor,
                    }}
                >
                    {icon}
                </span>
            </div>
        </div>
    );
};

const StepRow = ({ idx, label }) => (
    <div className="flex items-start gap-3">
        <span
            className="grid h-8 w-8 place-items-center rounded-2xl border text-xs font-bold"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                color: "var(--text)",
            }}
        >
            {idx}
        </span>
        <div className="pt-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {label}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
                {idx === "1" ? "Review your details before submitting." : idx === "2" ? "We verify eligibility and terms." : "Complete the application fee payment."}
            </p>
        </div>
    </div>
);

export default ApplyLoan;
