import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";

const BorrowerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading, status } = useUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (status === "suspended") return <Navigate to="/" replace />;

    if (role !== "borrower") return <Navigate to="/" replace />;

    return children;
};

export default BorrowerRoute;
