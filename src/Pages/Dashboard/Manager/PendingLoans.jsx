import React from 'react';
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import usePendingLoans from "../../../Hooks/usePendingLoans";

const PendingLoans = () => {
    const { data: loans = [], isLoading } = usePendingLoans();
    const queryClient = useQueryClient();

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: "Approve Loan?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Approve",
            confirmButtonColor: "#22c55e",
        });

        if (!result.isConfirmed) return;

        await fetch(
            `http://localhost:3000/loan-applications/${id}/approve`,
            { method: "PATCH" }
        );

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

        await fetch(
            `http://localhost:3000/loan-applications/${id}/reject`,
            { method: "PATCH" }
        );

        queryClient.invalidateQueries(["pendingLoans"]);

        Swal.fire("Rejected", "Loan has been rejected.", "success");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-32">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Pending Loan Applications
                </h1>

                <span className="badge badge-warning badge-sm w-fit md:hidden">
                    {loans.length} Pending
                </span>

                <span className="hidden md:inline-flex badge badge-warning badge-lg">
                    {loans.length} Pending
                </span>
            </div>

            {loans.length === 0 ? (
                <p className="opacity-70">No pending loan applications.</p>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-2xl shadow border">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>User</th>
                                <th>Loan</th>
                                <th>Amount</th>
                                <th>Date (MM/DD/YY)</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan._id} className="hover:bg-base-200/60">
                                    <td>
                                        <p className="font-semibold">{loan.userName}</p>
                                        <p className="text-xs opacity-70">{loan.userEmail}</p>
                                    </td>

                                    <td>{loan.loanTitle}</td>

                                    <td className="font-medium">${loan.amount}</td>

                                    <td className="text-sm opacity-70">
                                        {new Date(loan.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="text-right">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-end sm:gap-2">
                                            <button
                                                onClick={() => handleApprove(loan._id)}
                                                className="btn btn-xs sm:btn-sm btn-success w-full sm:w-auto"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleReject(loan._id)}
                                                className="btn btn-xs sm:btn-sm btn-error w-full sm:w-auto"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Motion.div>
    );
};

export default PendingLoans;
