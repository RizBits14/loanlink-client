import { useQuery } from "@tanstack/react-query";

const useAllApplications = (status) => {
    return useQuery({
        queryKey: ["loanApplications", status],
        queryFn: async () => {
            const url = status
                ? `${import.meta.env.VITE_BACKEND_URL}/loan-applications?status=${status}`
                : `${import.meta.env.VITE_BACKEND_URL}/loan-applications`;

            const res = await fetch(url, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch applications");
            }

            return res.json();
        },
        enabled: status !== undefined, // optional safety
    });
};

export default useAllApplications;
