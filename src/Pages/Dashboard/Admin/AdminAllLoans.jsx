import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import useAllLoans from "../../../Hooks/useAllLoans";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Search,
    Filter,
    ShieldCheck,
    Trash2,
    PencilLine,
    Home as HomeIcon,
    Percent,
    DollarSign,
    Tag,
    User2,
    Hash,
    Image as ImageIcon,
} from "lucide-react";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const AdminAllLoans = () => {
    const { data: loans = [], isLoading } = useAllLoans();
    const queryClient = useQueryClient();
    const wrapRef = useRef(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".aal-reveal",
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
            const title = String(l.title || "").toLowerCase();
            const cat = String(l.category || "").toLowerCase();
            const creator = String(l.createdBy || "").toLowerCase();
            const id = String(l._id || "").toLowerCase();
            return title.includes(q) || cat.includes(q) || creator.includes(q) || id.includes(q);
        });
    }, [loans, search]);

    const toggleShowOnHome = async (id, currentValue) => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${id}`, {
            credentials: "include",
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ showOnHome: !currentValue }),
        });
        queryClient.invalidateQueries(["allLoans"]);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Loan?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${id}`, {
            credentials: "include",
            method: "DELETE",
        });

        queryClient.invalidateQueries(["allLoans"]);
        Swal.fire("Deleted!", "Loan has been deleted.", "success");
    };

    const handleUpdate = async (loan) => {
        const imagesText = Array.isArray(loan.images) ? loan.images.join("\n") : "";
        const emiText = Array.isArray(loan.emiPlans) ? loan.emiPlans.join("\n") : "";

        const result = await Swal.fire({
            title: "",
            width: "min(980px, 92vw)",
            padding: 0,
            background: "color-mix(in oklab, var(--surface) 96%, transparent)",
            backdrop: "rgba(2, 6, 23, 0.72)",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Save Changes",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                popup: "rounded-3xl p-0 overflow-hidden",
                htmlContainer: "p-0 m-0 w-full",
                title: "hidden",
                actions: "w-full flex flex-col-reverse sm:flex-row gap-2 px-5 sm:px-6 pb-5 sm:pb-6 mt-0",
                confirmButton: "flex-1 h-11 rounded-2xl text-sm font-semibold",
                cancelButton: "flex-1 h-11 rounded-2xl text-sm font-semibold border",
                closeButton: "rounded-2xl",
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                const close = Swal.getCloseButton();
                const confirm = Swal.getConfirmButton();
                const cancel = Swal.getCancelButton();

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
              Admin
            </p>

            <div class="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p class="text-xl sm:text-2xl font-extrabold tracking-tight" style="color: var(--text)">
                  Update Loan
                </p>
                <p class="mt-1 text-sm" style="color: var(--muted)">
                  Edit the fields below and save to update the loan.
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
            <div
              class="mt-4"
              style="max-height: calc(100vh - 260px); overflow: auto; padding-right: 2px;"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  class="rounded-2xl border p-4 sm:col-span-2"
                  style="border-color: var(--border); background-color: color-mix(in oklab, var(--surface) 92%, transparent);"
                >
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Loan Title</p>
                    <span class="text-[11px] font-semibold" style="color: var(--muted)">Required</span>
                  </div>
                  <input
                    id="sw-title"
                    class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                    style="
                      border-color: var(--border);
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
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
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
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
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
                      color: var(--text);
                    "
                    value="${loan.category || ""}"
                    placeholder="e.g., Personal, Business"
                  />
                </div>

                <div
                  class="rounded-2xl border p-4"
                  style="border-color: var(--border); background-color: color-mix(in oklab, var(--primary) 10%, transparent);"
                >
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Interest Rate (%)</p>
                  <input
                    id="sw-interest"
                    type="number"
                    class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                    style="
                      border-color: var(--border);
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
                      color: var(--text);
                    "
                    value="${loan.interestRate ?? ""}"
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div
                  class="rounded-2xl border p-4 sm:col-span-2"
                  style="border-color: var(--border); background-color: color-mix(in oklab, var(--secondary) 10%, transparent);"
                >
                  <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">Maximum Loan Limit</p>
                  <input
                    id="sw-max"
                    type="number"
                    class="mt-2 w-full rounded-2xl border px-3 h-11 text-sm outline-none"
                    style="
                      border-color: var(--border);
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
                      color: var(--text);
                    "
                    value="${loan.maxLoanLimit ?? ""}"
                    placeholder="e.g., 50000"
                  />
                  <p class="mt-2 text-xs" style="color: var(--muted)">
                    This sets the maximum amount users can request.
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
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
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
                    <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--muted)">EMI Plans</p>
                    <span class="text-[11px] font-semibold" style="color: var(--muted)">One per line</span>
                  </div>
                  <textarea
                    id="sw-emi"
                    class="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                    style="
                      border-color: var(--border);
                      background-color: color-mix(in oklab, var(--surface) 96%, transparent);
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

                if (!title || !description || !category) return Swal.showValidationMessage("Missing fields");
                if (!Number.isFinite(interestRate) || interestRate < 0) return Swal.showValidationMessage("Invalid interest");
                if (!Number.isFinite(maxLoanLimit) || maxLoanLimit <= 0) return Swal.showValidationMessage("Invalid max");
                if (!images.length || !emiPlans.length) return Swal.showValidationMessage("Missing data");

                return { title, description, category, interestRate, maxLoanLimit, images, emiPlans };
            },
        });

        if (!result.isConfirmed) return;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${loan._id}`, {
            credentials: "include",
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(result.value),
        });

        queryClient.invalidateQueries(["allLoans"]);
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
            <Motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-6">
                <div className="aal-reveal flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                            All Loans
                        </h1>
                        <p className="mt-1" style={{ color: "var(--muted)" }}>
                            Manage visibility, update details, and remove loans across the system.
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
                                placeholder="Search by title, category, creator, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ color: "var(--text)" }}
                            />
                            <Filter size={18} style={{ color: "var(--muted)" }} />
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
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck size={16} style={{ color: "var(--primary)" }} />
                                Total: {filtered.length}
                            </span>
                        </span>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="aal-reveal rounded-3xl border p-8 text-center" style={shellStyle}>
                        <p className="text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                            No loans match your search.
                        </p>
                    </div>
                ) : (
                    <div className="aal-reveal rounded-3xl border overflow-hidden" style={shellStyle}>
                        <div className="overflow-x-auto">
                            <table className="table w-full min-w-275">
                                <thead
                                    style={{
                                        backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                                        color: "var(--text)",
                                    }}
                                >
                                    <tr>
                                        <th className="font-semibold">Loan</th>
                                        <th className="font-semibold">Category</th>
                                        <th className="font-semibold">Interest</th>
                                        <th className="font-semibold">Max</th>
                                        <th className="font-semibold">Creator</th>
                                        <th className="font-semibold">Show on Home</th>
                                        <th className="font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((loan, i) => (
                                        <Motion.tr
                                            key={loan._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(i * 0.015, 0.2) }}
                                            className="group"
                                            style={{ borderColor: "var(--border)" }}
                                        >
                                            <td className="whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src={loan.images?.[0] || "https://via.placeholder.com/120x80?text=Loan"}
                                                            className="w-16 h-12 rounded-2xl object-cover shrink-0 border"
                                                            style={{ borderColor: "var(--border)" }}
                                                            alt={loan.title}
                                                        />
                                                        <span
                                                            className="absolute -bottom-2 -right-2 grid h-7 w-7 place-items-center rounded-2xl border"
                                                            style={{
                                                                borderColor: "var(--border)",
                                                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                                color: "var(--muted)",
                                                            }}
                                                        >
                                                            <ImageIcon size={14} />
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-bold truncate max-w-85" style={{ color: "var(--text)" }}>
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold"
                                                    style={{
                                                        borderColor: "var(--border)",
                                                        backgroundColor: "color-mix(in oklab, var(--secondary) 10%, transparent)",
                                                        color: "var(--text)",
                                                    }}
                                                >
                                                    <Tag size={16} style={{ color: "var(--secondary)" }} />
                                                    {loan.category || "—"}
                                                </span>
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
                                                    <Percent size={16} style={{ color: "var(--primary)" }} />
                                                    {loan.interestRate}%
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold"
                                                    style={{
                                                        borderColor: "var(--border)",
                                                        backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                        color: "var(--text)",
                                                    }}
                                                >
                                                    <DollarSign size={16} style={{ color: "var(--muted)" }} />
                                                    {loan.maxLoanLimit}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                                                    <User2 size={16} style={{ color: "var(--muted)" }} />
                                                    <span className="truncate max-w-65">{loan.createdBy || "—"}</span>
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={!!loan.showOnHome}
                                                        onChange={() => toggleShowOnHome(loan._id, loan.showOnHome)}
                                                    />
                                                    <span
                                                        className="inline-flex items-center gap-2 text-sm font-semibold"
                                                        style={{ color: "var(--muted)" }}
                                                    >
                                                        <HomeIcon size={16} style={{ color: loan.showOnHome ? "var(--primary)" : "var(--muted)" }} />
                                                        {loan.showOnHome ? "Visible" : "Hidden"}
                                                    </span>
                                                </label>
                                            </td>

                                            <td className="text-right whitespace-nowrap">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleUpdate(loan)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                        style={{
                                                            borderColor: "color-mix(in oklab, var(--info) 28%, var(--border))",
                                                            backgroundColor: "color-mix(in oklab, var(--info) 12%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <PencilLine size={16} style={{ color: "var(--info)" }} />
                                                            <span className="hidden sm:inline">Update</span>
                                                        </span>
                                                    </Motion.button>

                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleDelete(loan._id)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                        style={{
                                                            borderColor: "color-mix(in oklab, var(--danger) 28%, var(--border))",
                                                            backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <Trash2 size={16} style={{ color: "var(--danger)" }} />
                                                            <span className="hidden sm:inline">Delete</span>
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
                                Tip: Toggle “Home” to control which loans appear on the landing page.
                            </p>
                            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                                Showing: {filtered.filter((l) => !!l.showOnHome).length} / {filtered.length}
                            </span>
                        </div>
                    </div>
                )}
            </Motion.div>
        </div>
    );
};

export default AdminAllLoans;
