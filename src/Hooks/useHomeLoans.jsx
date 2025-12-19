import { useQuery } from "@tanstack/react-query";

const fetchHomeLoans = async () => {
    const res = await fetch("http://localhost:3000/loans?home=true&limit=6")
    if (!res.ok) {
        throw new Error("Failed to fetch loans");
    }
    return res.json();
};

const useHomeLoans = () => {
    return useQuery({
        queryKey: ["homeLoans"],
        queryFn: fetchHomeLoans,
    });
};

export default useHomeLoans;
