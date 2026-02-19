import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import {
    BadgeCheck,
    FileText,
    Image as ImageIcon,
    Landmark,
    Percent,
    ReceiptText,
    SlidersHorizontal,
    Wallet,
} from "lucide-react";
import useAuth from "../../../Hooks/useAuth";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const AddLoan = () => {
    const { user } = useAuth();
    const wrapRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    // eslint-disable-next-line react-hooks/incompatible-library
    const watched = watch();

    const preview = useMemo(() => {
        const title = watched?.title || "Loan title preview";
        const category = watched?.category || "Category";
        const rate = watched?.interestRate ? `${watched.interestRate}%` : "—";
        const max = watched?.maxLoanLimit ? `$${Number(watched.maxLoanLimit).toLocaleString()}` : "—";
        const emi = watched?.emiPlans ? watched.emiPlans.split(",").map((x) => x.trim()).filter(Boolean) : [];
        const docs = watched?.requiredDocuments ? watched.requiredDocuments.split(",").map((x) => x.trim()).filter(Boolean) : [];
        const img = watched?.image || "";
        return { title, category, rate, max, emi, docs, img };
    }, [watched]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".aln-reveal",
                { opacity: 0, y: 16, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.07 }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const onSubmit = async (data) => {
        const loanData = {
            title: data.title,
            description: data.description,
            category: data.category,
            interestRate: data.interestRate,
            maxLoanLimit: data.maxLoanLimit,
            requiredDocuments: data.requiredDocuments.split(","),
            emiPlans: data.emiPlans.split(","),
            images: [data.image],
            showOnHome: data.showOnHome || false,
            createdBy: user.email,
        };

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans`, {
            credentials: "include",
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(loanData),
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Loan Added",
                text: "The loan has been successfully created.",
                confirmButtonColor: "#16a34a",
            });
            reset();
        }
    };

    return (
        <div
            className="w-full"
            style={{
                background:
                    "radial-gradient(900px 420px at 12% 8%, color-mix(in oklab, var(--secondary) 14%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 18%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 58%), transparent",
            }}
        >
            <section ref={wrapRef} className="max-w-6xl mx-auto">
                <div className="aln-reveal mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                        Add New Loan
                    </h1>
                    <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                        Create a new loan product with interest rates, limits, and EMI plans.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <Motion.div
                        className="aln-reveal lg:col-span-7 rounded-3xl border p-6 md:p-8"
                        style={shellStyle}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <FieldLabel icon={<Landmark size={16} />} label="Loan Title" />
                                <input
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="e.g. Small Business Loan"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <FieldLabel icon={<FileText size={16} />} label="Description" />
                                <textarea
                                    className="textarea textarea-bordered w-full min-h-32 resize-none rounded-2xl"
                                    placeholder="Describe the loan features and benefits"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <FieldLabel icon={<SlidersHorizontal size={16} />} label="Category" />
                                <input
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="Business / Education / Agriculture"
                                    {...register("category", { required: true })}
                                />
                                {errors.category && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        Category is required
                                    </p>
                                )}
                            </div>

                            <div>
                                <FieldLabel icon={<Percent size={16} />} label="Interest Rate (%)" />
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="e.g. 7.5"
                                    {...register("interestRate", { required: true })}
                                />
                                {errors.interestRate && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        Interest rate is required
                                    </p>
                                )}
                            </div>

                            <div>
                                <FieldLabel icon={<Wallet size={16} />} label="Maximum Loan Limit" />
                                <input
                                    type="number"
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="e.g. 500000"
                                    {...register("maxLoanLimit", { required: true })}
                                />
                                {errors.maxLoanLimit && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        Maximum limit is required
                                    </p>
                                )}
                            </div>

                            <div>
                                <FieldLabel icon={<ReceiptText size={16} />} label="EMI Plans" />
                                <input
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="6 months, 12 months, 24 months"
                                    {...register("emiPlans", { required: true })}
                                />
                                {errors.emiPlans && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        EMI plans are required
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <FieldLabel icon={<BadgeCheck size={16} />} label="Required Documents" />
                                <input
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="NID, Bank Statement, Salary Slip"
                                    {...register("requiredDocuments", { required: true })}
                                />
                                {errors.requiredDocuments && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        Required documents are needed
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <FieldLabel icon={<ImageIcon size={16} />} label="Loan Image URL" />
                                <input
                                    className="input input-bordered w-full rounded-2xl"
                                    placeholder="https://example.com/loan.jpg"
                                    {...register("image", { required: true })}
                                />
                                {errors.image && (
                                    <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
                                        Image URL is required
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Show on Home
                                    </p>
                                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                                        Display this loan on the home page for borrowers to discover.
                                    </p>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary" {...register("showOnHome")} />
                            </div>

                            <div className="md:col-span-2 pt-2">
                                <Motion.button
                                    type="submit"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full rounded-2xl px-5 py-3 text-sm sm:text-base font-semibold transition-all duration-300"
                                    style={{
                                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                        color: "white",
                                        boxShadow: "0 16px 44px color-mix(in oklab, var(--primary) 20%, transparent)",
                                    }}
                                >
                                    Add Loan
                                </Motion.button>
                            </div>
                        </form>
                    </Motion.div>

                    <div className="aln-reveal lg:col-span-5">
                        <div className="lg:sticky lg:top-23 space-y-4">
                            <div className="rounded-3xl border p-6" style={shellStyle}>
                                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                    Live Preview
                                </p>

                                <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                                    <div className="relative h-40">
                                        {preview.img ? (
                                            <img src={preview.img} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div
                                                className="w-full h-full grid place-items-center"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, color-mix(in oklab, var(--secondary) 10%, transparent), color-mix(in oklab, var(--primary) 10%, transparent))",
                                                }}
                                            >
                                                <div className="text-center">
                                                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)", color: "var(--primary)" }}>
                                                        <ImageIcon size={18} />
                                                    </span>
                                                    <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                                                        Add an image URL to preview
                                                    </p>
                                                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                                                        This will appear on loan cards
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background:
                                                    "linear-gradient(180deg, transparent 10%, rgba(0,0,0,0.45))",
                                            }}
                                        />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-sm font-bold text-white line-clamp-1">{preview.title}</p>
                                            <p className="text-xs text-white/80 line-clamp-1">{preview.category}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-3" style={{ backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
                                        <div className="grid grid-cols-2 gap-3">
                                            <MiniStat label="Interest" value={preview.rate} />
                                            <MiniStat label="Max limit" value={preview.max} />
                                        </div>

                                        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
                                            <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                                EMI plans
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {(preview.emi.length ? preview.emi : ["—"]).map((x, i) => (
                                                    <span key={i} className="badge badge-outline">
                                                        {x}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
                                            <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                                Required documents
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {(preview.docs.length ? preview.docs : ["—"]).map((x, i) => (
                                                    <span key={i} className="badge badge-outline">
                                                        {x}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="mt-4 rounded-2xl border p-4"
                                    style={{
                                        borderColor: "var(--border)",
                                        background:
                                            "linear-gradient(135deg, color-mix(in oklab, var(--secondary) 10%, transparent), color-mix(in oklab, var(--primary) 10%, transparent))",
                                    }}
                                >
                                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                        Tip
                                    </p>
                                    <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Use comma-separated values for EMI plans and documents (e.g., “6 months, 12 months”).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FieldLabel = ({ icon, label }) => (
    <div className="mb-2 flex items-center gap-2">
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
        <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {label}
        </label>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)" }}>
        <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
            {label}
        </p>
        <p className="mt-1 text-sm font-bold" style={{ color: "var(--text)" }}>
            {value}
        </p>
    </div>
);

export default AddLoan;
