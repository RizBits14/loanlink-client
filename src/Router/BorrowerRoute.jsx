import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const BorrowerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, status, roleLoading } = useUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return null;
    }


    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (status === "suspended") return <Navigate to="/" replace />;

    if (role !== "borrower") return <Navigate to="/" replace />;

    return children;
};

export default BorrowerRoute;
