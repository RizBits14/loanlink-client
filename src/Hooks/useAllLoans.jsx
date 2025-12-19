import React from 'react';
import { useQuery } from "@tanstack/react-query";

const useAllLoans = () => {
    return useQuery({
        queryKey: ["allLoans"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/loans");
            if (!res.ok) throw new Error("Failed to fetch loans");
            return res.json();
        },
    });
};

export default useAllLoans;
