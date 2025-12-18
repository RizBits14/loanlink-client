import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home";
import AllLoans from "../Pages/AllLoans";
import LoanDetails from "../Pages/LoanDetails";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'loans',
                Component: AllLoans
            },
            {
                path: 'loans/:id',
                Component: LoanDetails
            }
        ]
    }
])

export default router