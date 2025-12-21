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

        const res = await fetch(`http://localhost:3000/loan-applications/${id}/cancel`, {
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
        const res = await fetch("http://localhost:3000/create-payment-session", {
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
            const res = await fetch(`http://localhost:3000/loan-applications/${loan._id}`, {
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

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
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
                                        <p className="text-xs opacity-70">ID: {loan._id.slice(-6)}</p>
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
                                                onClick={() => handlePaymentDetails(loan)}
                                                className="btn btn-xs btn-success"
                                            >
                                                Paid
                                            </button>
                                        ) : (
                                            <span className="badge badge-outline">Unpaid</span>
                                        )}
                                    </td>

                                    <td className="space-x-2">
                                        <button onClick={() => handleView(loan)} className="btn btn-xs btn-outline">
                                            View
                                        </button>

                                        {loan.status === "pending" && (
                                            <button
                                                onClick={() => handleCancel(loan._id)}
                                                className="btn btn-xs btn-error btn-outline"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {loan.status === "approved" && loan.feeStatus === "unpaid" && (
                                            <button onClick={() => handlePay(loan)} className="btn btn-xs btn-primary">
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
