import React from 'react';
import { useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import useAllApplications from "../../../Hooks/useAllApplications";

const LoanApplications = () => {
    const [status, setStatus] = useState("");
    const { data: applications = [], isLoading } =
        useAllApplications(status);

    const handleView = (app) => {
        Swal.fire({
            title: "Loan Application Details",
            html: `
        <div style="text-align:left">
          <p><strong>User:</strong> ${app.userName}</p>
          <p><strong>Email:</strong> ${app.userEmail}</p>
          <p><strong>Loan:</strong> ${app.loanTitle}</p>
          <p><strong>Amount:</strong> $${app.amount}</p>
          <p><strong>Status:</strong> ${app.status}</p>
          <p><strong>Reason:</strong> ${app.reason}</p>
          <p><strong>Income:</strong> ${app.monthlyIncome || "—"}</p>
          <p><strong>Applied:</strong> ${app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "—"
                }</p>
        </div>
      `,
            confirmButtonText: "Close",
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-bold">Loan Applications</h1>

                <select
                    className="select select-bordered max-w-xs"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {applications.length === 0 ? (
                <p className="opacity-70">No loan applications found.</p>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-2xl shadow border">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Loan ID</th>
                                <th>User</th>
                                <th>Loan Title</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-base-200/60">
                                    <td className='font-semibold'>{app._id}</td>
                                    <td>
                                        <p className="font-semibold">{app.userName}</p>
                                        <p className="text-xs opacity-70">{app.userEmail}</p>
                                    </td>

                                    <td>{app.loanTitle}</td>

                                    <td className="font-medium">${app.amount}</td>

                                    <td>
                                        <span
                                            className={`badge ${app.status === "approved"
                                                ? "badge-success"
                                                : app.status === "rejected"
                                                    ? "badge-error"
                                                    : app.status === "cancelled"
                                                        ? "badge-neutral"
                                                        : "badge-warning"
                                                }`}
                                        >
                                            {app.status}
                                        </span>
                                    </td>

                                    <td className="text-sm opacity-70">
                                        {app.createdAt
                                            ? new Date(app.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td className="text-right">
                                        <button
                                            onClick={() => handleView(app)}
                                            className="btn btn-xs btn-outline"
                                        >
                                            View
                                        </button>
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

export default LoanApplications;
