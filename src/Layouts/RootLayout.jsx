import { Outlet } from "react-router";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <div className="mt-1">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default RootLayout;
