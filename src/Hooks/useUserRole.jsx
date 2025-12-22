import { useQuery } from "@tanstack/react-query";
import useAuth from "../Hooks/useAuth";

const useUserRole = () => {
    const { user, loading } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["userRole", user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to load user role");
            return res.json();
        },
    });

    return {
        role: data?.role || null,
        status: data?.status || null,
        roleLoading: loading || isLoading,
    };
};

export default useUserRole;
