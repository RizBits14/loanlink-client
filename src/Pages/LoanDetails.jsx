/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams, NavLink } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";

const LoanDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { role } = useUserRole();

    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ["loan", id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${id}`);
            return res.json();
        },
    });

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-6">
            <img
                src={loan.images?.[0]}
                alt={loan.title}
                className="w-full h-80 object-cover rounded-2xl"
            />

            <h1 className="text-4xl font-bold">{loan.title}</h1>
            <p className="opacity-80">{loan.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
                <p><strong>Category:</strong> {loan.category}</p>
                <p><strong>Interest:</strong> {loan.interestRate}%</p>
                <p><strong>Max Limit:</strong> ${loan.maxLoanLimit}</p>
                <p><strong>EMI Plans:</strong> {loan.emiPlans?.join(", ")}</p>
            </div>

            {role === "borrower" ? (
                <NavLink
                    to={`/dashboard/apply-loan/${loan._id}`}
                    className="btn btn-primary"
                >
                    Apply Now
                </NavLink>
            ) : (
                <button className="btn btn-disabled">
                    Only borrowers can apply
                </button>
            )}
        </div>
    );
};

export default LoanDetails;
