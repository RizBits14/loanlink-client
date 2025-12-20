import React from 'react';
import { useQuery } from "@tanstack/react-query";

const useApprovedLoans = () => {
    return useQuery({
        queryKey: ["approvedLoans"],
        queryFn: async () => {
            const res = await fetch(
                "http://localhost:3000/loan-applications/approved"
            );
            if (!res.ok) throw new Error("Failed to fetch approved loans");
            return res.json();
        },
    });
};

export default useApprovedLoans;
