import { useQuery } from "@tanstack/react-query";

const fetchAllLoans = async () => {
    const res = await fetch("http://localhost:3000/loans");
    if (!res.ok) {
        throw new Error("Failed to fetch loans");
    }
    return res.json();
};

const useAllLoans = () => {
    return useQuery({
        queryKey: ["allLoans"],
        queryFn: fetchAllLoans,
    });
};

export default useAllLoans;
