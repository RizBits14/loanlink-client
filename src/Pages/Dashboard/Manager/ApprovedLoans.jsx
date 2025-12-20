import React from 'react';
import { motion as Motion } from "framer-motion";
import useApprovedLoans from "../../../Hooks/useApprovedLoans";

const ApprovedLoans = () => {
    const { data: loans = [], isLoading } = useApprovedLoans();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Approved Loan Applications
                </h1>
                <span className="badge badge-success badge-lg">
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
                                <th>User</th>
                                <th>Loan</th>
                                <th>Amount</th>
                                <th>Approved Date</th>
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
                                    <td>
                                        <p className="font-semibold text-base">
                                            {loan.userName}
                                        </p>
                                        <p className="text-xs text-base-content/60">
                                            {loan.userEmail}
                                        </p>
                                    </td>

                                    <td className="font-medium">
                                        {loan.loanTitle}
                                    </td>

                                    <td className="font-semibold text-primary">
                                        ${loan.amount}
                                    </td>

                                    <td className="text-sm text-base-content/70">
                                        {loan.approvedAt
                                            ? new Date(
                                                loan.approvedAt
                                            ).toLocaleDateString()
                                            : "—"}
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
