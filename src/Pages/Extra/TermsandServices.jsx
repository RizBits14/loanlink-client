/* eslint-disable no-unused-vars */
import { motion as Motion } from "framer-motion";
import { ShieldCheck, FileText, Gavel, AlertTriangle } from "lucide-react";

const Item = ({ icon: Icon, title, children, delay = 0 }) => (
    <Motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="group relative rounded-2xl border border-base-300/60 bg-base-100/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all"
    >
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-xl p-3 bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold opacity-100 mb-1">{title}</h3>
                    <p className="text-lg opacity-80 leading-relaxed">{children}</p>
                </div>
            </div>
        </div>
    </Motion.div>
);

const TermsAndServices = () => {
    return (
        <section className="relative overflow-hidden bg-base-100 py-20">
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-6">
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
                        Terms & Services
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg opacity-80">
                        By using LoanLink, you agree to comply with and be bound by the following
                        terms and conditions.
                    </p>
                </Motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Item icon={ShieldCheck} title="User Responsibilities" delay={0.1}>
                        Users must provide accurate information and comply with all applicable
                        laws while using the platform.
                    </Item>

                    <Item icon={Gavel} title="Loan Processing" delay={0.2}>
                        LoanLink acts as a facilitator and does not guarantee loan approval.
                    </Item>

                    <Item icon={AlertTriangle} title="Account Termination" delay={0.3}>
                        We reserve the right to suspend or terminate accounts that violate our
                        policies.
                    </Item>
                </div>

                <Motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12"
                >
                    <div className="relative rounded-2xl border border-base-300/60 bg-base-100/70 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/10 via-transparent to-secondary/10" />
                        <p className="relative text-center text-lg opacity-80">
                            These terms may be updated periodically. Continued use of LoanLink
                            constitutes acceptance of any changes.
                        </p>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
};

export default TermsAndServices;
