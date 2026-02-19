import { NavLink } from "react-router";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { gsap } from "gsap";
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
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % banners.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-section", {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reveal-section",
          start: "top 85%",
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const { data: loans = [], isLoading } = useHomeLoans();

  return (
    <div ref={heroRef} className="space-y-32">
      <section className="relative h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <Motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={banners[currentIndex]}
              alt="LoanLink Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40" />
          </Motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <Motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-2xl text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Smart Microloan <br /> Management Platform
            </h1>
            <p className="mt-6 text-lg text-slate-200">
              Securely apply, track, and manage loans through a structured,
              role-based approval system built for transparency.
            </p>
            <div className="mt-8 flex gap-4">
              <NavLink
                to="/apply-loan"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-(--primary) to-(--secondary) text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Apply For Loan
              </NavLink>
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="reveal-section max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our <span className="text-(--primary)">Statistics</span>
        </h2>
        <Stats />
      </section>

      <section className="reveal-section max-w-7xl mx-auto px-6">
        <Motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          Available <span className="text-(--primary)">Loan Programs</span>
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
                className="h-80 bg-surface border border-base rounded-2xl animate-pulse"
              />
            ))}

          {!isLoading &&
            loans.map((loan) => (
              <Motion.div
                key={loan._id}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                className="card-modern p-8 flex flex-col min-h-105"
              >
                <img
                  src={loan.images?.[0]}
                  alt={loan.title}
                  className="h-48 w-full object-cover rounded-xl mb-6"
                />
                <h3 className="font-semibold text-xl mb-3">
                  {loan.title}
                </h3>
                <p className="text-muted text-sm mb-4 grow">
                  {loan.description}
                </p>
                <p className="text-sm font-medium mb-6">
                  Max Loan:{" "}
                  <span className="text-(--primary) font-semibold">
                    ${loan.maxLoanLimit}
                  </span>
                </p>
                <NavLink
                  to={`/loans/${loan._id}`}
                  className="btn-primary-modern py-2 rounded-xl text-center font-medium"
                >
                  View Details
                </NavLink>
              </Motion.div>
            ))}
        </Motion.div>
      </section>

      <section className="reveal-section max-w-7xl mx-auto px-6">
        <Motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          How <span className="text-(--primary)">LoanLink Works</span>
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
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="card-modern overflow-hidden"
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
                <p className="text-muted text-sm">
                  {item.desc}
                </p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </section>

      <Reviews />

      <section className="reveal-section max-w-7xl mx-auto px-6">
        <Motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          Why <span className="text-(--primary)">Choose</span> LoanLink
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
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="card-modern overflow-hidden text-center"
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
                <p className="text-muted text-sm">
                  {item.desc}
                </p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </section>

      <section className="bg-linear-to-r from-(--primary) to-(--secondary) text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <Motion.img
            src={apply1}
            alt="Apply"
            className="rounded-2xl shadow-2xl"
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
            <h2 className="text-4xl font-bold mb-6">
              Ready to Apply for a Loan?
            </h2>
            <p className="mb-8 text-slate-100">
              Experience secure, structured and transparent microloan
              management built for borrowers, managers and administrators.
            </p>
            <NavLink
              to="/apply-loan"
              className="px-8 py-3 rounded-xl bg-white text-(--primary) font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Apply Now
            </NavLink>
          </Motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
