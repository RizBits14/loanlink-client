/* eslint-disable no-unused-vars */
import { motion as Motion } from "framer-motion";
import { Shield, Database, Lock, Eye, FileText, Sparkles } from "lucide-react";

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
  show: { transition: { staggerChildren: 0.12 } },
};

const PolicyItem = ({ icon: Icon, title, children, delay = 0 }) => (
  <Motion.div
    variants={fadeUp}
    custom={delay}
    className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
    </div>

    <div className="relative p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl border border-base-300 bg-primary/10 p-3 text-primary shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="mt-2 text-base leading-relaxed opacity-80">{children}</p>
        </div>
      </div>

      <div className="pointer-events-none mt-6 h-px w-full bg-linear-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  </Motion.div>
);

const PrivacyPolicy = () => {
  return (
    <section className="relative overflow-hidden bg-base-100 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -right-28 h-130 w-130 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-130 w-130 rounded-full bg-secondary/12 blur-3xl" />
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
            Privacy & trust
          </Motion.div>

          <Motion.h1
            variants={fadeUp}
            custom={0.06}
            className="mt-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl"
          >
            Privacy Policy
          </Motion.h1>

          <Motion.p
            variants={fadeUp}
            custom={0.12}
            className="mx-auto mt-5 max-w-3xl text-lg opacity-80"
          >
            Your privacy matters to us. This policy outlines how LoanLink collects, uses, stores,
            and safeguards your information to ensure transparency and trust.
          </Motion.p>
        </Motion.div>

        <Motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <PolicyItem icon={Database} title="Information We Collect" delay={0.02}>
            We collect information such as your name, contact details, identification data, and
            loan-related financial information needed for account creation, verification, and
            processing applications.
          </PolicyItem>

          <PolicyItem icon={Eye} title="How We Use Your Data" delay={0.06}>
            Your data is used to provide services, process applications, improve platform performance,
            and share important updates. We do not sell your personal information.
          </PolicyItem>

          <PolicyItem icon={Lock} title="Data Protection & Security" delay={0.1}>
            We apply security best practices, including encryption and access controls, to reduce the
            risk of unauthorized access, alteration, or disclosure.
          </PolicyItem>

          <PolicyItem icon={Shield} title="Your Rights & Control" delay={0.14}>
            You can request access, correction, or deletion of your information, subject to legal and
            regulatory obligations and platform requirements.
          </PolicyItem>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-12 overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl"
        >
          <div className="border-b border-base-300 bg-linear-to-r from-primary/10 to-secondary/10 px-6 py-5 md:px-8">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Updates</h2>
            </div>
          </div>

          <div className="relative px-6 py-6 md:px-8">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -left-24 -top-24 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-24 -bottom-24 h-52 w-52 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <p className="relative text-center text-base leading-relaxed opacity-80 md:text-left">
              This Privacy Policy may be updated periodically. Continued use of LoanLink means you
              accept any changes made to this policy.
            </p>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
