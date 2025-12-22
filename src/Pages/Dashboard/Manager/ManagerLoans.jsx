import React from 'react';
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import useManagerLoans from "../../../Hooks/useManagerLoans";

const ManageLoans = () => {
    const { data: loans = [], isLoading } = useManagerLoans();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

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
            title: "Update Loan",
            html: `
        <div style="text-align:left; display:grid; gap:10px;">
          <label>Title</label>
          <input id="sw-title" class="swal2-input" value="${loan.title || ""}" />

          <label>Description</label>
          <textarea id="sw-desc" class="swal2-textarea">${loan.description || ""}</textarea>

          <label>Category</label>
          <input id="sw-cat" class="swal2-input" value="${loan.category || ""}" />

          <label>Interest Rate (%)</label>
          <input id="sw-interest" type="number" class="swal2-input" value="${loan.interestRate ?? ""}" />

          <label>Max Loan Limit</label>
          <input id="sw-max" type="number" class="swal2-input" value="${loan.maxLoanLimit ?? ""}" />

          <label>Image URL(s) (one per line)</label>
          <textarea id="sw-images" class="swal2-textarea">${imagesText}</textarea>

          <label>Available EMI Plans (one per line)</label>
          <textarea id="sw-emi" class="swal2-textarea">${emiText}</textarea>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: "Save Changes",
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
        return <div className="py-20 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Loans</h1>
                    <p className="opacity-70">All loans created by you</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        className="input input-bordered w-full md:w-80"
                        placeholder="Search by title or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="badge badge-primary badge-lg">
                        {filteredLoans.length}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow border border-base-200">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base font-semibold">
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Interest</th>
                            <th>Category</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredLoans.map((loan) => (
                            <tr key={loan._id} className="hover:bg-base-200/60">
                                <td>
                                    <img
                                        src={loan.images?.[0] || "https://via.placeholder.com/120x80?text=Loan"}
                                        alt={loan.title}
                                        className="w-20 h-14 object-cover rounded-xl shadow"
                                    />
                                </td>

                                <td>
                                    <p className="font-semibold">{loan.title}</p>
                                    <p className="text-xs opacity-70">ID: {loan._id.slice(-6)}</p>
                                </td>

                                <td className="font-medium text-primary">{loan.interestRate}%</td>

                                <td>
                                    <span className="badge badge-outline">{loan.category}</span>
                                </td>

                                <td className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <button
                                            onClick={() => handleUpdate(loan)}
                                            className="btn btn-xs btn-info btn-outline bg-info text-black"
                                        >
                                            Update
                                        </button>

                                        <button
                                            onClick={() => handleDelete(loan._id)}
                                            className="btn btn-xs btn-error btn-outline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredLoans.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-10 opacity-70">
                                    No loans found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageLoans;
