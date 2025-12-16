import { Outlet } from "react-router";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-200px)]">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default RootLayout;
