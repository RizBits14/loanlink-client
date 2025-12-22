import React from 'react';
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useMyLoans = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["myLoans", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/loan-applications/me`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("Failed to fetch loans");
            return res.json();
        },
    });
};

export default useMyLoans;
