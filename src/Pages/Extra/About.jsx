/* eslint-disable no-unused-vars */
import { motion as Motion } from "framer-motion";
import { Target, Eye, HeartHandshake, HelpCircle, Sparkles } from "lucide-react";
import about1 from "../../assets/extra/about1.jpg";
import about2 from "../../assets/extra/about2.jpg";

const faqs = [
    {
        q: "What is LoanLink?",
        a: "LoanLink is a digital microloan request and approval platform that connects borrowers with loan providers in a transparent and efficient way.",
    },
    {
        q: "Who can use LoanLink?",
        a: "Any verified user can request loans, while registered institutions and admins manage approvals and tracking.",
    },
    {
        q: "Is LoanLink secure?",
        a: "Yes. We prioritize user data privacy and use industry-standard security practices.",
    },
    {
        q: "Does LoanLink charge any fees?",
        a: "LoanLink does not charge borrowers directly. Any applicable fees are clearly mentioned before approval.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: (d = 0) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.55, ease: "easeOut", delay: d },
    }),
};

const stagger = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12 },
    },
};

const InfoCard = ({ icon: Icon, title, children, delay = 0 }) => {
    return (
        <Motion.div
            variants={fadeUp}
            custom={delay}
            className="group rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-base-300 bg-primary/10 p-3 text-primary shadow-sm">
                    <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="mt-2 leading-relaxed opacity-80">{children}</p>
                </div>
            </div>

            <div className="pointer-events-none mt-5 h-px w-full bg-linear-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Motion.div>
    );
};

const ImageCard = ({ src, alt }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200 shadow-lg">
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/30 via-transparent to-black/15" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
        </div>
    );
};

const About = () => {
    return (
        <section className="relative bg-base-100 py-20">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-130 w-130 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-130 w-130 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                <Motion.div
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="text-center"
                >
                    <Motion.div
                        variants={fadeUp}
                        custom={0}
                        className="mx-auto inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-sm font-semibold shadow-sm"
                    >
                        <Sparkles className="h-4 w-4 text-primary" />
                        Built for clarity, speed, and trust
                    </Motion.div>

                    <Motion.h1
                        variants={fadeUp}
                        custom={0.05}
                        className="mt-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl"
                    >
                        About LoanLink
                    </Motion.h1>

                    <Motion.p
                        variants={fadeUp}
                        custom={0.1}
                        className="mx-auto mt-5 max-w-3xl text-lg opacity-80"
                    >
                        LoanLink simplifies microloan management by combining transparency,
                        efficiency, and trust—helping individuals and small businesses access
                        financial support with confidence.
                    </Motion.p>
                </Motion.div>

                <div className="mt-16 grid items-center gap-10 md:grid-cols-2">
                    <Motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="space-y-5"
                    >
                        <Motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold">
                            Why <span className="text-primary">LoanLink</span> Exists
                        </Motion.h2>

                        <Motion.p variants={fadeUp} custom={0.05} className="text-lg opacity-80">
                            Traditional loan processes are often slow, complex, and unclear.
                            LoanLink was built to remove these barriers by offering a digital-first
                            platform where every step is visible, fast, and user-focused.
                        </Motion.p>

                        <Motion.div variants={fadeUp} custom={0.1} className="flex flex-wrap gap-3">
                            <span className="badge badge-outline border-base-300 px-4 py-3 text-sm">
                                Transparent workflow
                            </span>
                            <span className="badge badge-outline border-base-300 px-4 py-3 text-sm">
                                Role-based approvals
                            </span>
                            <span className="badge badge-outline border-base-300 px-4 py-3 text-sm">
                                Modern UX
                            </span>
                        </Motion.div>

                        <Motion.div variants={fadeUp} custom={0.15} className="pt-2">
                            <button className="btn btn-accent rounded-2xl px-6">
                                Learn More
                            </button>
                        </Motion.div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="h-75 md:h-85"
                    >
                        <ImageCard src={about1} alt="About LoanLink" />
                    </Motion.div>
                </div>

                <Motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="mt-20 grid gap-8 md:grid-cols-3"
                >
                    <InfoCard icon={Target} title="Our Mission" delay={0.05}>
                        To empower individuals and small businesses through accessible,
                        transparent, and reliable financial solutions.
                    </InfoCard>

                    <InfoCard icon={Eye} title="Our Vision" delay={0.1}>
                        A future where microloans are easy to request, quick to approve, and
                        fair for everyone involved.
                    </InfoCard>

                    <InfoCard icon={HeartHandshake} title="Our Values" delay={0.15}>
                        Transparency, security, and innovation guide every decision and
                        feature we build.
                    </InfoCard>
                </Motion.div>

                <div className="mt-20 grid items-center gap-10 md:grid-cols-2">
                    <Motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="order-2 h-75 md:order-1 md:h-85"
                    >
                        <ImageCard src={about2} alt="Trust and simplicity" />
                    </Motion.div>

                    <Motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="order-1 space-y-5 md:order-2"
                    >
                        <Motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold">
                            Built for <span className="text-primary">Trust &amp; Simplicity</span>
                        </Motion.h2>

                        <Motion.p variants={fadeUp} custom={0.05} className="text-lg opacity-80">
                            From secure data handling to clear loan terms, LoanLink prioritizes
                            trust at every level—ensuring users always stay informed and in
                            control.
                        </Motion.p>

                        <Motion.div variants={fadeUp} custom={0.1} className="pt-2">
                            <button className="btn btn-outline btn-accent rounded-2xl px-6">
                                Our Commitment
                            </button>
                        </Motion.div>
                    </Motion.div>
                </div>

                <div className="mx-auto mt-20 max-w-4xl">
                    <Motion.h2
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="mb-10 flex items-center justify-center gap-2 text-center text-3xl font-bold"
                    >
                        <HelpCircle className="h-7 w-7 text-primary" /> FAQs
                    </Motion.h2>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <Motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.04 }}
                                className="collapse collapse-arrow rounded-2xl border border-base-300 bg-base-100 shadow-sm"
                            >
                                <input type="checkbox" />
                                <div className="collapse-title text-lg font-semibold">
                                    {faq.q}
                                </div>
                                <div className="collapse-content">
                                    <p className="leading-relaxed opacity-80">{faq.a}</p>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
