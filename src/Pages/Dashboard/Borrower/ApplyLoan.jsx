/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const ApplyLoan = () => {
    const { id } = useParams();
    const isFromBanner = !id;
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedLoanId, setSelectedLoanId] = useState("");
    const [activeLoan, setActiveLoan] = useState(null);


    const { data: loanFromParam } = useQuery({
        enabled: !!id,
        queryKey: ["loan", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/loans/${id}`);
            return res.json();
        },
    });

    const { data: loans = [] } = useQuery({
        enabled: isFromBanner,
        queryKey: ["allLoans"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/loans");
            return res.json();
        },
    });


    useEffect(() => {
        if (loanFromParam) {
            setActiveLoan(loanFromParam);
        }
    }, [loanFromParam]);

    useEffect(() => {
        if (isFromBanner && selectedLoanId) {
            const found = loans.find((l) => l._id === selectedLoanId);
            setActiveLoan(found || null);
        }
    }, [selectedLoanId, loans, isFromBanner]);

    const maxLimit = Number(activeLoan?.maxLoanLimit || 0);


    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({ mode: "onChange" });


    const onSubmit = async (data) => {
        if (!activeLoan) {
            Swal.fire("Select a Loan", "Please select a loan type.", "warning");
            return;
        }

        const summaryHtml = `
            <div style="text-align:left">
                <p><strong>Loan:</strong> ${activeLoan.title}</p>
                <p><strong>Interest:</strong> ${activeLoan.interestRate}%</p>
                <p><strong>Max Limit:</strong> $${activeLoan.maxLoanLimit}</p>
                <hr/>
                <p><strong>Applicant:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Requested Amount:</strong> $${data.amount}</p>
            </div>
        `;

        const confirm = await Swal.fire({
            title: "Confirm Loan Application",
            html: summaryHtml,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Submit Application",
        });

        if (!confirm.isConfirmed) return;

        const application = {
            userEmail: user.email,
            userName: `${data.firstName} ${data.lastName}`,
            loanId: activeLoan._id,
            loanTitle: activeLoan.title,
            loanCategory: activeLoan.category,
            amount: data.amount,
            reason: data.reason,
            monthlyIncome: Number(data.monthlyIncome),
        };

        try {
            const res = await fetch("http://localhost:3000/loan-applications", {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify(application),
            });

            if (!res.ok) throw new Error("Request failed");

            Swal.fire("Success!", "Loan application submitted.", "success");
            navigate("/dashboard/my-loans");
        } catch (err) {
            Swal.fire("Error", "Failed to submit application", "error");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-6">Apply for Loan</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    className="input input-bordered w-full"
                    value={user.email}
                    readOnly
                />

                {isFromBanner && (
                    <>
                        <select
                            className="select select-bordered w-full"
                            value={selectedLoanId}
                            onChange={(e) => setSelectedLoanId(e.target.value)}
                        >
                            <option value="">Select Loan Type</option>
                            {loans.map((loan) => (
                                <option key={loan._id} value={loan._id}>
                                    {loan.title}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {activeLoan && (
                    <>
                        <input
                            className="input input-bordered w-full"
                            value={activeLoan.title}
                            readOnly
                        />
                        <input
                            className="input input-bordered w-full"
                            value={`${activeLoan.interestRate}%`}
                            readOnly
                        />
                    </>
                )}

                <input
                    className="input input-bordered w-full"
                    placeholder="First Name"
                    {...register("firstName", { required: true })}
                />

                <input
                    className="input input-bordered w-full"
                    placeholder="Last Name"
                    {...register("lastName", { required: true })}
                />

                <input
                    className="input input-bordered w-full"
                    placeholder="National ID / Passport"
                    {...register("nid", { required: true })}
                />

                <input
                    className="input input-bordered w-full"
                    placeholder="Income Source"
                    {...register("incomeSource", { required: true })}
                />

                <input
                    className="input input-bordered w-full"
                    placeholder="Monthly Income"
                    {...register("monthlyIncome", { required: true })}
                />

                <input
                    className="input input-bordered w-full"
                    placeholder="Contact Number (10 digits)"
                    {...register("contact", {
                        required: "Contact number required",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Must be exactly 10 digits",
                        },
                    })}
                />
                {errors.contact && (
                    <p className="text-error text-sm">{errors.contact.message}</p>
                )}

                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Reason for Loan"
                    {...register("reason", { required: true })}
                />

                <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder={
                        activeLoan
                            ? `Loan Amount (Max $${maxLimit})`
                            : "Select a loan first"
                    }
                    disabled={!activeLoan}
                    {...register("amount", {
                        required: true,
                        valueAsNumber: true,
                        validate: (v) =>
                            v <= maxLimit || `Cannot exceed $${maxLimit}`,
                    })}
                />
                {errors.amount && (
                    <p className="text-error text-sm">{errors.amount.message}</p>
                )}

                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Address"
                    {...register("address", { required: true })}
                />

                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Extra Notes"
                    {...register("notes")}
                />

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={!isValid || !activeLoan}
                >
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default ApplyLoan;
