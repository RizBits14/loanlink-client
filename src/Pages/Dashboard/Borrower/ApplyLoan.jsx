import React from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const ApplyLoan = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: loan = {} } = useQuery({
        queryKey: ["loan", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/loans/${id}`);
            return res.json();
        },
    });

    const maxLimit = Number(loan.maxLoanLimit || 0);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const application = {
            userEmail: user.email,
            userName: `${data.firstName} ${data.lastName}`,
            loanId: loan._id,
            loanTitle: loan.title,
            loanCategory: loan.category,
            amount: data.amount,
            reason: data.reason,
            monthlyIncome: Number(data.monthyincome),
        };

        const res = await fetch("http://localhost:3000/loan-applications", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(application),
        });

        if (res.ok) {
            Swal.fire("Success!", "Loan application submitted.", "success");
            navigate("/dashboard/my-loans");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-6">Apply for {loan.title}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    className="input input-bordered w-full"
                    value={user.email}
                    readOnly
                />

                <input
                    className="input input-bordered w-full"
                    value={loan.title}
                    readOnly
                />

                <input
                    className="input input-bordered w-full"
                    value={`${loan.interestRate}%`}
                    readOnly
                />

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
                    {...register("monthyincome", { required: true })}
                />

                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Contact Number (10 digits)"
                    {...register("contact", {
                        required: "Contact number is required",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Contact number must be exactly 10 digits",
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
                    className={`input input-bordered w-full ${errors.amount ? "input-error" : ""
                        }`}
                    placeholder={`Loan Amount (Max $${maxLimit})`}
                    {...register("amount", {
                        required: "Loan amount is required",
                        valueAsNumber: true,
                        validate: (value) =>
                            value <= maxLimit || `Amount cannot exceed $${maxLimit}`,
                    })}
                />

                {errors.amount && (
                    <p className="text-error text-sm mt-1">
                        {errors.amount.message}
                    </p>
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

                <button className="btn btn-primary w-full">
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default ApplyLoan;
