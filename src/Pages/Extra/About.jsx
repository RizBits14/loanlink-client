/* eslint-disable no-unused-vars */
import { motion as Motion } from "framer-motion";
import { Target, Eye, HeartHandshake, HelpCircle } from "lucide-react";
import about1 from "../../assets/extra/about1.jpg"
import about2 from "../../assets/extra/about2.jpg"

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

const InfoCard = ({ icon: Icon, title, children, delay = 0 }) => (
    <Motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="rounded-2xl bg-base-200 p-6 shadow-md hover:shadow-xl transition-shadow"
    >
        <div className="flex items-start gap-4">
            <div className="rounded-xl p-3 bg-btn-accent/10 text-btn-accent">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="opacity-80 leading-relaxed">{children}</p>
            </div>
        </div>
    </Motion.div>
);

const About = () => {
    return (
        <section className="bg-base-100 py-20">
            <div className="max-w-6xl mx-auto px-6">
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-5">
                        About LoanLink
                    </h1>
                    <p className="text-lg opacity-80 max-w-3xl mx-auto">
                        LoanLink simplifies microloan management by combining transparency,
                        efficiency, and trust—helping individuals and small businesses access
                        financial support with confidence.
                    </p>
                </Motion.div>

                <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
                    <div className="space-y-5">
                        <h2 className="text-3xl font-bold">Why <span className="text-primary">LoanLink</span> Exists</h2>
                        <p className="opacity-80 text-lg">
                            Traditional loan processes are often slow, complex, and unclear.
                            LoanLink was built to remove these barriers by offering a digital-first
                            platform where every step is visible, fast, and user-focused.
                        </p>
                        <button className="btn btn-accent">Learn More</button>
                    </div>

                    <div className="w-full h-72 rounded-2xl bg-base-200 flex items-center justify-center opacity-60">
                        <img src={about1} alt="" />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <InfoCard icon={Target} title="Our Mission" delay={0.1}>
                        To empower individuals and small businesses through accessible,
                        transparent, and reliable financial solutions.
                    </InfoCard>

                    <InfoCard icon={Eye} title="Our Vision" delay={0.2}>
                        A future where microloans are easy to request, quick to approve, and
                        fair for everyone involved.
                    </InfoCard>

                    <InfoCard icon={HeartHandshake} title="Our Values" delay={0.3}>
                        Transparency, security, and innovation guide every decision and
                        feature we build.
                    </InfoCard>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
                    <div className="w-full h-72 rounded-2xl bg-base-200 flex items-center justify-center opacity-60">
                        <img src={about2} alt="" />
                    </div>

                    <div className="space-y-5">
                        <h2 className="text-3xl font-bold">Built for <span className="text-primary">Trust & Simplicity</span></h2>
                        <p className="opacity-80 text-lg">
                            From secure data handling to clear loan terms, LoanLink prioritizes
                            trust at every level—ensuring users always stay informed and in
                            control.
                        </p>
                        <button className="btn btn-outline btn-accent">Our Commitment</button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-2">
                        <HelpCircle className="w-7 h-7 text-btn-accent" /> FAQs
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="collapse collapse-arrow bg-base-200 rounded-xl"
                            >
                                <input type="checkbox" />
                                <div className="collapse-title text-lg font-medium">
                                    {faq.q}
                                </div>
                                <div className="collapse-content opacity-80">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;