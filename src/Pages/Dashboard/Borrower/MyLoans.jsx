import { useEffect } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import useMyLoans from "../../../Hooks/useMyLoans";

const MyLoans = () => {
    const { data: loans = [], isLoading } = useMyLoans();
    const queryClient = useQueryClient();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const success = params.get("success");
        const applicationId = params.get("applicationId");

        if (success === "true" && applicationId) {
            fetch(`http://localhost:3000/loan-applications/${applicationId}/pay`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    transaction: "stripe",
                }),
            })
                .then(() => {
                    Swal.fire(
                        "Payment Successful",
                        "Fee paid successfully.",
                        "success"
                    );
                    queryClient.invalidateQueries(["myLoans"]);

                    window.history.replaceState(
                        {},
                        document.title,
                        "/dashboard/my-loans"
                    );
                });
        }
    }, [queryClient]);

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

        await fetch(`http://localhost:3000/loan-applications/${id}/cancel`, {
            method: "PATCH",
        });

        queryClient.invalidateQueries(["myLoans"]);

        Swal.fire("Cancelled", "Loan application cancelled.", "success");
    };

    const handlePay = async (loan) => {
        const res = await fetch(
            "http://localhost:3000/create-payment-session",
            {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    applicationId: loan._id,
                    userEmail: loan.userEmail,
                }),
            }
        );

        const data = await res.json();
        window.location.assign(data.url);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
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
            <h1 className="text-3xl font-bold">My Loans</h1>

            {loans.length === 0 ? (
                <p className="opacity-70">You haven’t applied for any loans yet.</p>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-2xl shadow border">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Loan</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Application Fee</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan._id} className="hover:bg-base-200/60">
                                    <td>
                                        <p className="font-semibold">{loan.loanTitle}</p>
                                        <p className="text-xs opacity-70">
                                            ID: {loan._id.slice(-6)}
                                        </p>
                                    </td>

                                    <td className="font-medium">${loan.amount}</td>

                                    <td>
                                        <span
                                            className={`badge ${loan.status === "approved"
                                                ? "badge-success"
                                                : loan.status === "rejected"
                                                    ? "badge-error"
                                                    : loan.status === "cancelled"
                                                        ? "badge-neutral"
                                                        : "badge-warning"
                                                }`}
                                        >
                                            {loan.status}
                                        </span>
                                    </td>

                                    <td>
                                        {loan.feeStatus === "paid" ? (
                                            <button
                                                onClick={() =>
                                                    Swal.fire({
                                                        title: "Payment Details",
                                                        html: `
                                                            <p><strong>Status:</strong> Paid</p>
                                                            <p><strong>Date:</strong> ${loan.paidAt
                                                                ? new Date(
                                                                    loan.paidAt
                                                                ).toLocaleDateString()
                                                                : "—"
                                                            }</p>
                                                        `,
                                                    })
                                                }
                                                className="btn btn-xs btn-success"
                                            >
                                                Paid
                                            </button>
                                        ) : (
                                            <span className="badge badge-outline">Unpaid</span>
                                        )}
                                    </td>

                                    <td className="space-x-2">
                                        {loan.status === "pending" && (
                                            <button
                                                onClick={() => handleCancel(loan._id)}
                                                className="btn btn-xs btn-error btn-outline"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {loan.status === "approved" &&
                                            loan.feeStatus === "unpaid" && (
                                                <button
                                                    onClick={() => handlePay(loan)}
                                                    className="btn btn-xs btn-primary"
                                                >
                                                    Pay $10
                                                </button>
                                            )}
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

export default MyLoans;
