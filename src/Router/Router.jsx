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
                path: "manage-users",
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
            },
            {
                path: "add-loan",
                element: <ManagerRoute><AddLoan></AddLoan></ManagerRoute>
            }
        ]
    }
]);

export default router;
