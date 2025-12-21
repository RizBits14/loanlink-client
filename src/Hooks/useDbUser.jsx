import React from 'react';
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useDbUser = () => {
    const { user, loading } = useAuth();

    return useQuery({
        queryKey: ["dbUser", user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/users/${user.email}`, {
                credentials: "include",
            });
            return res.json();
        },
    });
};

export default useDbUser;
