import React from 'react';
import { useQuery } from "@tanstack/react-query";

const usePendingLoans = () => {
    return useQuery({
        queryKey: ["pendingLoans"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/loan-applications/pending");
            if (!res.ok) throw new Error("Failed to fetch pending loans");
            return res.json();
        },
    });
};

export default usePendingLoans;
