import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home";
import AllLoans from "../Pages/AllLoans";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import About from "../Pages/Extra/About";
import Contact from "../Pages/Extra/Contact";
import PrivacyPolicy from "../Pages/Extra/PrivacyPolicy";
import TermsAndServices from "../Pages/Extra/TermsandServices";
import PrivateLoanDetails from "./PrivateLoanDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import ManagerRoute from "./ManagerRoute";
import AddLoan from "../Pages/Dashboard/Manager/AddLoan";
import AdminAllLoans from "../Pages/Dashboard/Admin/AdminAllLoans";
import BorrowerRoute from "./BorrowerRoute";
import ApplyLoan from "../Pages/Dashboard/Borrower/ApplyLoan";
import MyLoans from "../Pages/Dashboard/Borrower/MyLoans";
import PendingLoans from "../Pages/Dashboard/Manager/PendingLoans";
import ApprovedLoans from "../Pages/Dashboard/Manager/ApprovedLoans";
import LoanApplications from "../Pages/Dashboard/Admin/LoanApplication";
import ManageLoans from "../Pages/Dashboard/Manager/ManagerLoans";
import Profile from "../Pages/Dashboard/Profile";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: 'loans', Component: AllLoans },
            { path: 'loans/:id', Component: PrivateLoanDetails },
            { path: 'login', Component: Login },
            { path: 'register', Component: Register },
            { path: 'about', Component: About },
            { path: 'contact', Component: Contact },
            { path: 'privacypolicy', Component: PrivacyPolicy },
            { path: 'termsandservices', Component: TermsAndServices },
            { path: 'apply-loan', element: (<PrivateRoute><ApplyLoan></ApplyLoan></PrivateRoute>) }
        ]
    },
    {
        path: "dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout></DashboardLayout>
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                Component: DashboardHome
            },
            {
                path: "profile",
                Component: Profile
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
            },
            {
                path: "add-loan",
                element: <ManagerRoute><AddLoan></AddLoan></ManagerRoute>
            },
            {
                path: "all-loan",
                element: (
                    <AdminRoute><AdminAllLoans></AdminAllLoans></AdminRoute>
                )
            },
            {
                path: "apply-loan/:id",
                element: (
                    <BorrowerRoute><ApplyLoan></ApplyLoan></BorrowerRoute>
                )
            },
            {
                path: "my-loans",
                element: (
                    <BorrowerRoute><MyLoans></MyLoans></BorrowerRoute>
                )
            },
            {
                path: "pending-loans",
                element: (
                    <ManagerRoute><PendingLoans></PendingLoans></ManagerRoute>
                )
            },
            {
                path: "approved-loans",
                element: (
                    <ManagerRoute><ApprovedLoans></ApprovedLoans></ManagerRoute>
                )
            },
            {
                path: "loan-applications",
                element: (
                    <AdminRoute><LoanApplications></LoanApplications></AdminRoute>
                )
            },
            {
                path: "manage-loans",
                element: (
                    <ManagerRoute><ManageLoans></ManageLoans></ManagerRoute>
                )
            }
        ]
    }
]);

export default router;
