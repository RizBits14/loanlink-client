import React from 'react';
import { useQuery } from "@tanstack/react-query";

const useApprovedLoans = () => {
    return useQuery({
        queryKey: ["approvedLoans"],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/loan-applications/approved`, {
                credentials: "include",
            }
            );
            if (!res.ok) throw new Error("Failed to fetch approved loans");
            return res.json();
        },
    });
};

export default useApprovedLoans;
