import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import useApprovedLoans from "../../../Hooks/useApprovedLoans";

const ApprovedLoans = () => {
    const { data: loans = [], isLoading } = useApprovedLoans();
    const queryClient = useQueryClient();

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

        const res = await fetch(
            `http://localhost:3000/loan-applications/${id}/cancel-approved`,
            {
                method: "PATCH",
                credentials: "include",
            }
        );

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            Swal.fire("Error", err.message || "Failed to cancel approval.", "error");
            return;
        }

        queryClient.invalidateQueries(["approvedLoans"]);
        Swal.fire("Updated", "Approval cancelled successfully.", "success");
    };

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
        >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Approved Loan Applications
                </h1>

                <span className="badge badge-success badge-sm w-fit md:hidden">
                    {loans.length} Approved
                </span>

                <span className="hidden md:inline-flex badge badge-success badge-lg">
                    {loans.length} Approved
                </span>
            </div>

            {loans.length === 0 ? (
                <Motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="opacity-70 text-center py-20"
                >
                    No approved loans yet.
                </Motion.p>
            ) : (
                <Motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-x-auto bg-base-100 rounded-2xl shadow-lg border border-base-300"
                >
                    <table className="table w-full">
                        <thead className="bg-base-200 text-base font-semibold">
                            <tr>
                                <th>Loan ID</th>
                                <th>User</th>
                                <th>Loan</th>
                                <th>Amount</th>
                                <th>Approved Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loans.map((loan, index) => (
                                <Motion.tr
                                    key={loan._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-base-200/70 transition-colors"
                                >
                                    <td>{loan._id}</td>

                                    <td className="font-semibold">
                                        <p className="font-semibold text-base">{loan.userName}</p>
                                        <p className="text-xs text-base-content/60">
                                            {loan.userEmail}
                                        </p>
                                    </td>

                                    <td className="font-medium">{loan.loanTitle}</td>

                                    <td className="font-semibold text-primary">${loan.amount}</td>

                                    <td className="text-sm text-base-content/70">
                                        {loan.approvedAt
                                            ? new Date(loan.approvedAt).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td className="text-right">
                                        <div className="flex justify-end items-center">
                                            <button
                                                onClick={() => handleCancelApproved(loan._id)}
                                                className="btn btn-xs btn-error btn-outline whitespace-normal wrap-break-word max-w-full"
                                            >
                                                <span className="hidden sm:inline">Cancel Approval</span>
                                                <span className="sm:hidden">Cancel</span>
                                            </button>

                                        </div>
                                    </td>
                                </Motion.tr>
                            ))}
                        </tbody>
                    </table>
                </Motion.div>
            )}
        </Motion.div>
    );
};

export default ApprovedLoans;
