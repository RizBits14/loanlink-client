import { Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import ScrollToTop from "../Shared/ScrollToTop";

const RootLayout = () => {
    const location = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                mainRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        });
        return () => ctx.revert();
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-base text-base transition-colors duration-500">
            <Navbar />
            <ScrollToTop />
            <main ref={mainRef} className="flex-1 w-full">
                <AnimatePresence mode="wait">
                    <Motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full"
                    >
                        <Outlet />
                    </Motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default RootLayout;
