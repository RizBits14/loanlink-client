/* eslint-disable no-unused-vars */
import { motion as Motion } from "framer-motion";
import { Shield, Database, Lock, Eye, FileText } from "lucide-react";

const PolicyItem = ({ icon: Icon, title, children, delay = 0 }) => (
    <Motion.div
        initial={{ opacity: 0, y: 28 }}
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
                    <h3 className="text-xl font-semibold opacity-100 mb-2">{title}</h3>
                    <p className="text-lg opacity-80 leading-relaxed">{children}</p>
                </div>
            </div>
        </div>
    </Motion.div>
);

const PrivacyPolicy = () => {
    return (
        <section className="relative overflow-hidden bg-base-100 py-20">
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-6">
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
                        Privacy Policy
                    </h1>
                    <p className="mt-5 max-w-3xl mx-auto text-lg opacity-80">
                        Your privacy matters to us. This policy outlines how LoanLink collects,
                        uses, stores, and safeguards your personal information while ensuring
                        transparency and trust.
                    </p>
                </Motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PolicyItem icon={Database} title="Information We Collect" delay={0.1}>
                        We collect personal information such as your name, contact details,
                        identification data, and financial information required for account
                        creation, verification, and loan processing.
                    </PolicyItem>

                    <PolicyItem icon={Eye} title="How We Use Your Data" delay={0.2}>
                        Your data is used to deliver our services, process loan applications,
                        improve platform performance, and communicate important updates. We do
                        not sell or misuse your personal information.
                    </PolicyItem>

                    <PolicyItem icon={Lock} title="Data Protection & Security" delay={0.3}>
                        We implement industry‑standard security practices, including encryption
                        and access controls, to protect your data from unauthorized access,
                        alteration, or disclosure.
                    </PolicyItem>

                    <PolicyItem icon={Shield} title="Your Rights & Control" delay={0.4}>
                        You have the right to access, update, or request deletion of your
                        personal information, subject to legal and regulatory requirements.
                    </PolicyItem>
                </div>

                <Motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-14"
                >
                    <div className="relative rounded-2xl border border-base-300/60 bg-base-100/70 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/10 via-transparent to-secondary/10" />
                        <p className="relative text-center text-lg opacity-80">
                            This Privacy Policy may be updated from time to time. Continued use of
                            LoanLink indicates your acceptance of any changes made.
                        </p>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
