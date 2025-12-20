import React from 'react';
import { useQuery } from "@tanstack/react-query";

const useAllUsers = () => {
    return useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/users", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        },
    });
};

export default useAllUsers;
