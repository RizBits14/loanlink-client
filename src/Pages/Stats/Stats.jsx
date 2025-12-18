import { FaHome, FaCar, FaUser, FaCreditCard } from "react-icons/fa";
import { motion as Motion } from "framer-motion";

const stats = [
    {
        title: "Home Loan",
        rate: "3.65%",
        icon: FaHome,
        gradient: "from-blue-500 to-blue-700",
    },
    {
        title: "Car Loan",
        rate: "8.94%",
        icon: FaCar,
        gradient: "from-green-500 to-green-700",
    },
    {
        title: "Personal Loan",
        rate: "6.76%",
        icon: FaUser,
        gradient: "from-purple-500 to-purple-700",
    },
    {
        title: "Credit Card Loan",
        rate: "12.15%",
        icon: FaCreditCard,
        gradient: "from-red-500 to-red-700",
    },
];

const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
};

const Stats = () => {
    return (
        <section className="w-full py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <Motion.div
                            key={index}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            custom={index}
                            whileHover={{ scale: 1.05 }}
                            className={`
                                relative overflow-hidden rounded-2xl p-6
                                bg-linear-to-br ${item.gradient}
                                text-white shadow-lg
                                transition-all duration-500
                            `}
                        >
                            <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />

                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                    <Icon className="text-3xl" />
                                </div>

                                <h2 className="text-4xl font-bold tracking-tight">
                                    {item.rate}
                                </h2>

                                <p className="mt-2 text-sm uppercase tracking-widest opacity-90">
                                    {item.title}
                                </p>
                            </div>
                        </Motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default Stats;
