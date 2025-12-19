import PrivateRoute from "./PrivateRoute";
import LoanDetails from "../Pages/LoanDetails";

const PrivateLoanDetails = () => {
    return (
        <PrivateRoute>
            <LoanDetails />
        </PrivateRoute>
    );
};

export default PrivateLoanDetails;
