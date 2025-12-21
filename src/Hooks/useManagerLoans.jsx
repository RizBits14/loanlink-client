import React from 'react';
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useManagerLoans = () => {
    const { user, loading } = useAuth();

    return useQuery({
        queryKey: ["managerLoans", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/manager/loans", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to load manager loans");
            return res.json();
        },
    });
};

export default useManagerLoans;
