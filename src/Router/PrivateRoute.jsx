import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import GlobalLoader from "../Shared/GlobalLoader"

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <GlobalLoader />;

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    return children;
};

export default PrivateRoute;
