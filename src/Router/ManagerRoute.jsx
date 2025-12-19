import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";

const ManagerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, status, roleLoading } = useUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return null;
    }

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (status === "suspended") return <Navigate to="/" replace />;

    if (role !== "manager") return <Navigate to="/" replace />;

    return children;
};

export default ManagerRoute;
