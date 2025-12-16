import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout
    }
])

export default router