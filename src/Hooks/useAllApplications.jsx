import { useQuery } from "@tanstack/react-query";

const useAllApplications = (status) => {
    return useQuery({
        queryKey: ["loanApplications", status],
        queryFn: async () => {
            const url = status
                ? `http://localhost:3000/loan-applications?status=${status}`
                : `http://localhost:3000/loan-applications`;

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
