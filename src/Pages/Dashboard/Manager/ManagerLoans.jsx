import React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import {
    Pencil,
    Trash2,
    Search,
    Filter,
    Image as ImageIcon,
    Percent,
    Tag,
    Hash,
} from "lucide-react";
import useManagerLoans from "../../../Hooks/useManagerLoans";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const ManageLoans = () => {
    const { data: loans = [], isLoading } = useManagerLoans();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const wrapRef = useRef(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".ml-reveal",
                { opacity: 0, y: 14, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
            );
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const filteredLoans = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return loans;

        return loans.filter((l) => {
            const title = (l.title || "").toLowerCase();
            const cat = (l.category || "").toLowerCase();
            return title.includes(q) || cat.includes(q);
        });
    }, [loans, search]);

    const handleDelete = async (loanId) => {
        const result = await Swal.fire({
            title: "Delete Loan?",
            text: "This will permanently remove the loan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/manager/loans/${loanId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            Swal.fire("Error", "Delete failed. Try again.", "error");
            return;
        }

        queryClient.invalidateQueries(["managerLoans"]);
        Swal.fire("Deleted!", "Loan deleted successfully.", "success");
    };

    const handleUpdate = async (loan) => {
        const imagesText = Array.isArray(loan.images) ? loan.images.join("\n") : "";
        const emiText = Array.isArray(loan.emiPlans) ? loan.emiPlans.join("\n") : "";

        const result = await Swal.fire({
            title: "",
            width: "min(980px, 92vw)",
            padding: 0,
            background: "transparent",
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: "Save Changes",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                popup: "rounded-3xl",
                htmlContainer: "p-0 m-0 w-full",
                closeButton: "rounded-2xl",
                actions: "w-full flex flex-col-reverse sm:flex-row gap-2 px-5 sm:px-6 pb-5 sm:pb-6 mt-0",
                confirmButton: "flex-1 h-11 rounded-2xl text-sm font-semibold",
                cancelButton: "flex-1 h-11 rounded-2xl text-sm font-semibold border",
            },
            didOpen: () => {
                const confirm = Swal.getConfirmButton();
                const cancel = Swal.getCancelButton();
                const close = Swal.getCloseButton();

                if (confirm) {
                    confirm.style.background = "linear-gradient(135deg, var(--primary), var(--secondary))";
                    confirm.style.color = "white";
                    confirm.style.border = "0";
                    confirm.style.boxShadow = "0 14px 34px color-mix(in oklab, var(--primary) 18%, transparent)";
                }

                if (cancel) {
                    cancel.style.borderColor = "var(--border)";
                    cancel.style.backgroundColor = "color-mix(in oklab, var(--surface) 92%, transparent)";
                    cancel.style.color = "var(--text)";
                }

                if (close) {
                    close.style.color = "var(--muted)";
                    close.style.margin = "14px 14px 0 0";
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
              Manage
            </p>

            <div class="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p class="text-xl sm:text-2xl font-extrabold tracking-tight" style="color: var(--text)">
                  Update Loan
                </p>
                <p class="mt-1 text-sm" style="color: var(--muted)">
                  Edit fields below and save to update this loan.
                </p>
              </div>

              <span
                class="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold"
                style="
                  border-color: var(--border);
                  background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                  color: var(--muted);
                "
                title="Loan ID"
              >
                <span class="h-1.5 w-1.5 rounded-full" style="background-color: var(--muted)"></span>
                ID: …${String(loan._id || "").slice(-6)}
              </span>
            </div>
          </div>

          <div class="p-5 sm:p-6 pt-0 sm:pt-0">
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Title</p>
                  <span class="text-[11px] font-semibold" style="color: var(--muted)">Required</span>
                </div>
                <input
                  id="sw-title"
                  class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                  "
                  value="${loan.title || ""}"
                  placeholder="Loan title"
                />
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Description</p>
                  <span class="text-[11px] font-semibold" style="color: var(--muted)">Required</span>
                </div>
                <textarea
                  id="sw-desc"
                  class="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                    min-height: 120px;
                    resize: vertical;
                  "
                  placeholder="Write a clear description..."
                >${loan.description || ""}</textarea>
              </div>

              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Category</p>
                  <span class="text-[11px] font-semibold" style="color: var(--muted)">Required</span>
                </div>
                <input
                  id="sw-cat"
                  class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                  "
                  value="${loan.category || ""}"
                  placeholder="e.g., Personal, Business"
                />
              </div>

              <div
                class="rounded-2xl border p-4"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--secondary) 10%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Interest Rate (%)</p>
                <input
                  id="sw-interest"
                  type="number"
                  class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                  "
                  value="${loan.interestRate ?? ""}"
                  placeholder="e.g., 8.5"
                />
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--primary) 10%, transparent);"
              >
                <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Max Loan Limit</p>
                <input
                  id="sw-max"
                  type="number"
                  class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                  "
                  value="${loan.maxLoanLimit ?? ""}"
                  placeholder="e.g., 50000"
                />
                <p class="mt-2 text-xs" style="color: var(--muted)">
                  Set the maximum amount users can request for this loan.
                </p>
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Image URL</p>
                </div>
                <textarea
                  id="sw-images"
                  class="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                    min-height: 110px;
                    resize: vertical;
                  "
                  placeholder="https://...
https://..."
                >${imagesText}</textarea>
                <p class="mt-2 text-xs" style="color: var(--muted)">
                  The first URL will be used as the cover image.
                </p>
              </div>

              <div
                class="rounded-2xl border p-4 sm:col-span-2"
                style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Available EMI Plans</p>
                  <span class="text-[11px] font-semibold" style="color: var(--muted)">One per line</span>
                </div>
                <textarea
                  id="sw-emi"
                  class="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style="
                    border-color: var(--border);
                    background-color: color-mix(in oklab, var(--surface) 92%, transparent);
                    color: var(--text);
                    min-height: 110px;
                    resize: vertical;
                  "
                  placeholder="e.g., 6 months
e.g., 12 months"
                >${emiText}</textarea>
                <p class="mt-2 text-xs" style="color: var(--muted)">
                  Add plans users can choose during application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
            preConfirm: () => {
                const title = document.getElementById("sw-title").value.trim();
                const description = document.getElementById("sw-desc").value.trim();
                const category = document.getElementById("sw-cat").value.trim();

                const interestRate = Number(document.getElementById("sw-interest").value);
                const maxLoanLimit = Number(document.getElementById("sw-max").value);

                const images = document
                    .getElementById("sw-images")
                    .value.split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean);

                const emiPlans = document
                    .getElementById("sw-emi")
                    .value.split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean);

                if (!title || !description || !category) {
                    Swal.showValidationMessage("Title, Description, Category are required.");
                    return;
                }
                if (!Number.isFinite(interestRate) || interestRate < 0) {
                    Swal.showValidationMessage("Interest rate must be a valid number.");
                    return;
                }
                if (!Number.isFinite(maxLoanLimit) || maxLoanLimit <= 0) {
                    Swal.showValidationMessage("Max loan limit must be > 0.");
                    return;
                }
                if (images.length === 0) {
                    Swal.showValidationMessage("Provide at least 1 image URL.");
                    return;
                }
                if (emiPlans.length === 0) {
                    Swal.showValidationMessage("Provide at least 1 EMI plan.");
                    return;
                }

                return { title, description, category, interestRate, maxLoanLimit, images, emiPlans };
            },
        });

        if (!result.isConfirmed) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/manager/loans/${loan._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(result.value),
        });

        if (!res.ok) {
            Swal.fire("Error", "Update failed. Try again.", "error");
            return;
        }

        queryClient.invalidateQueries(["managerLoans"]);
        Swal.fire("Updated!", "Loan updated successfully.", "success");
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
            <div className="ml-reveal flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                        Manage Loans
                    </h1>
                    <p className="mt-1" style={{ color: "var(--muted)" }}>
                        All loans created by you
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
                            placeholder="Search by title or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ color: "var(--text)" }}
                        />
                        <Filter size={18} style={{ color: "var(--muted)" }} />
                    </div>

                    <span
                        className="inline-flex items-center justify-center rounded-2xl border px-4 h-12 text-sm font-bold"
                        style={{
                            borderColor: "var(--border)",
                            background:
                                "linear-gradient(135deg, color-mix(in oklab, var(--secondary) 12%, transparent), color-mix(in oklab, var(--primary) 12%, transparent))",
                            color: "var(--text)",
                            minWidth: 64,
                        }}
                        title="Visible results"
                    >
                        {filteredLoans.length}
                    </span>
                </div>
            </div>

            <div className="ml-reveal rounded-3xl border overflow-hidden" style={shellStyle}>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead
                            style={{
                                backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                                color: "var(--text)",
                            }}
                        >
                            <tr>
                                <th className="font-semibold">Loan</th>
                                <th className="font-semibold">Interest</th>
                                <th className="font-semibold">Category</th>
                                <th className="font-semibold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLoans.map((loan) => (
                                <Motion.tr
                                    key={loan._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="group"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    <td>
                                        <div className="flex items-center gap-4 min-w-[320px]">
                                            <div
                                                className="h-14 w-20 rounded-2xl overflow-hidden border relative"
                                                style={{
                                                    borderColor: "var(--border)",
                                                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                }}
                                            >
                                                {loan.images?.[0] ? (
                                                    <img src={loan.images[0]} alt={loan.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full grid place-items-center" style={{ color: "var(--muted)" }}>
                                                        <ImageIcon size={18} />
                                                    </div>
                                                )}
                                                <div
                                                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 14%, transparent), transparent 55%)",
                                                    }}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                                                    {loan.title}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2">
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
                                                            borderColor: "var(--border)",
                                                            backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <Tag size={12} style={{ color: "var(--primary)" }} />
                                                        {loan.category || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div
                                            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold"
                                            style={{
                                                borderColor: "var(--border)",
                                                backgroundColor: "color-mix(in oklab, var(--secondary) 10%, transparent)",
                                                color: "var(--text)",
                                            }}
                                        >
                                            <Percent size={14} style={{ color: "var(--secondary)" }} />
                                            {loan.interestRate}%
                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className="inline-flex items-center rounded-2xl border px-3 py-2 text-sm font-semibold"
                                            style={{
                                                borderColor: "var(--border)",
                                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                color: "var(--text)",
                                            }}
                                        >
                                            {loan.category || "—"}
                                        </span>
                                    </td>

                                    <td className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Motion.button
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleUpdate(loan)}
                                                className="h-10 px-3 rounded-2xl text-sm font-semibold border transition cursor-pointer"
                                                style={{
                                                    borderColor: "var(--border)",
                                                    backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
                                                    color: "var(--text)",
                                                }}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <Pencil size={16} style={{ color: "var(--primary)" }} />
                                                    Update
                                                </span>
                                            </Motion.button>

                                            <Motion.button
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleDelete(loan._id)}
                                                className="h-10 px-3 rounded-2xl text-sm font-semibold border transition cursor-pointer"
                                                style={{
                                                    borderColor: "color-mix(in oklab, var(--danger) 28%, var(--border))",
                                                    backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)",
                                                    color: "var(--text)",
                                                }}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <Trash2 size={16} style={{ color: "var(--danger)" }} />
                                                    Delete
                                                </span>
                                            </Motion.button>
                                        </div>
                                    </td>
                                </Motion.tr>
                            ))}

                            {filteredLoans.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12" style={{ color: "var(--muted)" }}>
                                        No loans found.
                                    </td>
                                </tr>
                            )}
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
                        Tip: Use search to quickly find loans by title or category.
                    </p>
                    <span
                        className="text-xs font-semibold tracking-wider uppercase"
                        style={{ color: "var(--muted)" }}
                    >
                        Total: {loans.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ManageLoans;
