import { FaHome, FaCar, FaUser, FaCreditCard } from "react-icons/fa";
import { motion as Motion } from "framer-motion";

const stats = [
    { title: "Home Loan", rate: "3.65%", icon: FaHome, gradient: "from-blue-500 to-blue-700" },
    { title: "Car Loan", rate: "8.94%", icon: FaCar, gradient: "from-green-500 to-green-700" },
    { title: "Personal Loan", rate: "6.76%", icon: FaUser, gradient: "from-purple-500 to-purple-700" },
    { title: "Credit Card Loan", rate: "12.15%", icon: FaCreditCard, gradient: "from-red-500 to-red-700" },
];

const cardVariant = {
    hidden: { opacity: 0, y: 22 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" },
    }),
};

const Stats = () => {
    return (
        <section className="w-full py-12 md:py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {stats.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <Motion.div
                            key={index}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            custom={index}
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.99 }}
                            className={`group relative overflow-hidden rounded-3xl p-6 md:p-7 bg-linear-to-br ${item.gradient} text-white shadow-lg ring-1 ring-white/10 transition-all duration-500`}
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute -inset-24 bg-white/20 blur-3xl" />
                                <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-white/10" />
                            </div>

                            <div className="pointer-events-none absolute inset-0 opacity-70">
                                <div className="absolute right-5.5 top-5.5 h-28 w-28 rounded-full bg-white/12 blur-xl" />
                                <div className="absolute left-4.5 bottom-4.5 h-24 w-24 rounded-full bg-black/10 blur-xl" />
                            </div>

                            <div className="relative z-10 flex items-start justify-between gap-4">
                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/18 ring-1 ring-white/20 shadow-sm">
                                    <Icon className="text-[26px]" />
                                </div>

                                <span className="inline-flex items-center rounded-full bg-black/15 px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-white/15">
                                    Fixed rate
                                </span>
                            </div>

                            <div className="relative z-10 mt-6">
                                <div className="flex items-end gap-2">
                                    <p className="text-4xl font-extrabold tracking-tight">{item.rate}</p>
                                    <p className="pb-1 text-sm font-medium opacity-90">APR</p>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold uppercase tracking-widest opacity-95">
                                        {item.title}
                                    </p>

                                    <span className="text-xs opacity-85">Updated</span>
                                </div>

                                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
                                    <div className="h-full w-2/3 rounded-full bg-white/35" />
                                </div>
                            </div>

                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/20 to-transparent opacity-60" />
                        </Motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default Stats;
