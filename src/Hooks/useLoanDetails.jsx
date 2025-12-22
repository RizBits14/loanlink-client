import { useQuery } from "@tanstack/react-query";

const fetchLoanDetails = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch loan details", {
            credentials: "include",
        });
    }
    return res.json();
};

const useLoanDetails = (id) => {
    return useQuery({
        queryKey: ["loanDetails", id],
        queryFn: () => fetchLoanDetails(id),
        enabled: !!id,
    });
};

export default useLoanDetails;
