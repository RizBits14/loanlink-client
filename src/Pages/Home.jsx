import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import useHomeLoans from "../Hooks/useHomeLoans";

import banner1 from "../assets/banner/banner1.jpg";
import banner2 from "../assets/banner/banner2.jpg";
import banner3 from "../assets/banner/banner3.jpg";

import how1 from "../assets/howitworks/loanform.webp";
import how2 from "../assets/howitworks/loanreview.jpg";
import how3 from "../assets/howitworks/loanapproves.jpg";

import choose1 from "../assets/chooseus/img1.jpg";
import choose2 from "../assets/chooseus/img2.jpg";
import choose3 from "../assets/chooseus/img3.jpg";

import apply1 from "../assets/apply/img1.png";
import Reviews from "./Reviews/Reviews";
import Stats from "./Stats/Stats";

const banners = [banner1, banner2, banner3];

const howItWorks = [
    {
        img: how1,
        title: "Apply for a Loan",
        desc: "Submit your application through a guided and transparent process.",
    },
    {
        img: how2,
        title: "Manager Review",
        desc: "Loan managers verify applicant information and assess eligibility.",
    },
    {
        img: how3,
        title: "Approval & Tracking",
        desc: "Approved loans are tracked securely with full visibility.",
    },
];

const whyChoose = [
    {
        img: choose1,
        title: "Secure & Transparent",
        desc: "Role-based access with auditable workflows.",
    },
    {
        img: choose2,
        title: "Efficient Workflow",
        desc: "Optimized approvals reduce delays and friction.",
    },
    {
        img: choose3,
        title: "User-Friendly Design",
        desc: "Clean interface accessible to all roles.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const hoverLift = {
    hover: {
        y: -8,
        transition: { duration: 0.3 },
    },
};

const stagger = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.15 },
    },
};


const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => setCurrentIndex((prev) => (prev + 1) % banners.length),
            6000
        );
        return () => clearInterval(interval);
    }, []);

    const { data: loans = [], isLoading } = useHomeLoans();

    return (
        <div className="space-y-28">
            <section className="relative h-[85vh] overflow-hidden">
                <AnimatePresence mode="wait">
                    <Motion.div
                        key={currentIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <img
                            src={banners[currentIndex]}
                            alt="LoanLink Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </Motion.div>
                </AnimatePresence>

                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                    <Motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="max-w-xl text-primary-content"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Smart Microloan <br /> Management Made Simple
                        </h1>
                        <p className="mt-4 text-lg opacity-90">
                            Request, track, and manage microloans transparently with a role-based approval system built for trust.
                        </p>

                        <div className="mt-6 flex gap-4">
                            <NavLink to="/loans" className="btn btn-accent">
                                Explore Loans
                            </NavLink>
                            <NavLink to="/register" className="btn btn-outline text-white">
                                Get Started
                            </NavLink>
                        </div>
                    </Motion.div>
                </div>
            </section>
            <div>
                <h1 className="text-3xl font-bold text-center">Our <span className="text-primary">Statistics</span></h1>
                <Stats></Stats>
            </div>

            <section className="max-w-7xl mx-auto px-6">
                <Motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-16"
                >
                    Available <span className="text-primary">Loan Programs</span>
                </Motion.h2>

                <Motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {isLoading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-80 bg-base-200 rounded-2xl animate-pulse"
                            />
                        ))}

                    {!isLoading &&
                        loans.map((loan) => (
                            <Motion.div
                                key={loan._id}
                                variants={{ ...fadeUp, ...hoverLift }}
                                whileHover="hover"
                                className="bg-base-100 rounded-2xl p-8 relative flex flex-col min-h-105
                    shadow-md hover:shadow-xl
                    transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:scale-[1.02]
                    border border-transparent hover:border-primary/30"
                            >
                                <img
                                    src={loan.image}
                                    alt={loan.title}
                                    className="h-48 w-full object-cover rounded-xl mb-5"
                                />

                                <h3 className="font-semibold text-xl mb-3">
                                    {loan.title}
                                </h3>

                                <p className="text-sm opacity-80 mb-4 grow">
                                    {loan.description}
                                </p>

                                <p className="text-sm font-medium mb-5">
                                    Max Loan:{" "}
                                    <span className="text-primary font-semibold">
                                        ${loan.maxAmount}
                                    </span>
                                </p>

                                <NavLink
                                    to={`/loans/${loan._id}`}
                                    className="btn btn-primary btn-sm w-full"
                                >
                                    View Details
                                </NavLink>
                            </Motion.div>
                        ))}
                </Motion.div>
            </section>


            <section className="max-w-7xl mx-auto px-6">
                <Motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-16"
                >
                    How <span className="text-primary">LoanLink Works</span>
                </Motion.h2>

                <Motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-3 gap-12"
                >
                    {howItWorks.map((item, i) => (
                        <Motion.div
                            key={i}
                            variants={{ ...fadeUp, ...hoverLift }}
                            whileHover="hover"
                            className="bg-base-100 rounded-2xl shadow-sm overflow-hidden"
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full aspect-square object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-sm opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </Motion.div>
                    ))}
                </Motion.div>
            </section>

            <Reviews />

            <section className="max-w-7xl mx-auto px-6">
                <Motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-16"
                >
                    Why <span className="text-primary">Choose</span> LoanLink
                </Motion.h2>

                <Motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-12"
                >
                    {whyChoose.map((item, i) => (
                        <Motion.div
                            key={i}
                            variants={{ ...fadeUp, ...hoverLift }}
                            whileHover="hover"
                            className="bg-base-100 rounded-2xl shadow-sm overflow-hidden text-center"
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full aspect-square object-cover"
                            />
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </Motion.div>
                    ))}
                </Motion.div>
            </section>

            <section className="bg-primary text-primary-content">
                <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
                    <Motion.img
                        src={apply1}
                        alt="Apply"
                        className="rounded-2xl shadow-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    />

                    <Motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Apply for a Loan?
                        </h2>
                        <p className="mb-6 opacity-90">
                            Join LoanLink today and experience secure, modern microloan management.
                        </p>
                        <NavLink to="/register" className="btn btn-accent">
                            Apply Now
                        </NavLink>
                    </Motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
