import { Outlet } from "react-router";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import ScrollToTop from "../Shared/ScrollToTop";

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <ScrollToTop></ScrollToTop>
            <div className="mt-1">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default RootLayout;
