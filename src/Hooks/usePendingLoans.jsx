import { useQuery } from "@tanstack/react-query";

const usePendingLoans = () => {
    return useQuery({
        queryKey: ["pendingLoans"],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/loan-applications/pending`,
                {
                    credentials: "include",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch pending loans");
            }

            return res.json();
        },
    });
};

export default usePendingLoans;
