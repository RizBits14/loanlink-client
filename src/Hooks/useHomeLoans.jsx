import { useQuery } from "@tanstack/react-query";

const fetchHomeLoans = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans?home=true&limit=6`, {
        credentials: "include",
    })
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
