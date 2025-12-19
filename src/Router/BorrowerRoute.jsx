import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";

const BorrowerRoute = ({ children }) => {
    const { user } = useAuth();
    const { role, status } = useUserRole();
    const location = useLocation();


    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (status === "suspended") return <Navigate to="/" replace />;

    if (role !== "borrower") return <Navigate to="/" replace />;

    return children;
};

export default BorrowerRoute;
