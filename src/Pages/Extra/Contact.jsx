/* eslint-disable no-unused-vars */
import { motion as Motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";

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

const ContactCard = ({ icon: Icon, title, value, sub }) => (
    <Motion.div
        variants={fadeUp}
        className="group rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-base-300 bg-primary/10 p-3 text-primary shadow-sm">
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold opacity-80">{title}</p>
                <p className="mt-1 wrap-break-words text-base font-semibold">{value}</p>
                {sub ? <p className="mt-1 text-sm opacity-70">{sub}</p> : null}
            </div>
        </div>
        <div className="pointer-events-none mt-4 h-px w-full bg-linear-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Motion.div>
);

const Contact = () => {
    return (
        <section className="relative bg-base-100 py-20">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-130 w-130 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-130 w-130 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                <Motion.div initial="hidden" animate="show" variants={stagger} className="text-center">
                    <Motion.div
                        variants={fadeUp}
                        custom={0}
                        className="mx-auto inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-sm font-semibold shadow-sm"
                    >
                        <Sparkles className="h-4 w-4 text-primary" />
                        We’re here to help
                    </Motion.div>

                    <Motion.h1
                        variants={fadeUp}
                        custom={0.05}
                        className="mt-6 text-4xl font-extrabold tracking-tight text-primary md:text-5xl"
                    >
                        Contact Us
                    </Motion.h1>

                    <Motion.p
                        variants={fadeUp}
                        custom={0.1}
                        className="mx-auto mt-5 max-w-3xl text-lg opacity-80"
                    >
                        Have questions, feedback, or need support? We’d love to hear from you.
                    </Motion.p>
                </Motion.div>

                <div className="mt-14 grid gap-10 md:grid-cols-2">
                    <Motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="space-y-6"
                    >
                        <Motion.div variants={fadeUp} custom={0} className="space-y-2">
                            <h3 className="text-2xl font-bold">Get in Touch</h3>
                            <p className="text-base opacity-80">
                                Reach out for inquiries, feedback, or support. We’re here to help.
                            </p>
                        </Motion.div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <ContactCard
                                icon={Mail}
                                title="Email"
                                value="help@loanlink.com"
                                sub="We reply within 24 hours"
                            />
                            <ContactCard
                                icon={Phone}
                                title="Phone"
                                value="+880 1234 567890"
                                sub="Sun–Thu, 10am–6pm"
                            />
                            <div className="sm:col-span-2">
                                <ContactCard icon={MapPin} title="Address" value="Dhaka, Bangladesh" />
                            </div>
                        </div>

                        <Motion.div
                            variants={fadeUp}
                            custom={0.12}
                            className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm"
                        >
                            <p className="text-sm font-semibold opacity-70">Note</p>
                            <p className="mt-2 leading-relaxed opacity-80">
                                For account-related issues, include your registered email so we can assist faster.
                            </p>
                        </Motion.div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl"
                    >
                        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
                        <div className="pointer-events-none absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

                        <div className="border-b border-base-300 bg-linear-to-r from-primary/10 to-secondary/10 px-8 py-6">
                            <h3 className="text-xl font-bold">Send a Message</h3>
                            <p className="mt-1 text-sm opacity-70">We’ll get back to you as soon as possible.</p>
                        </div>

                        <form className="space-y-5 p-8">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label className="mb-2 block text-sm font-semibold opacity-80">Name</label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full rounded-2xl border-base-300 bg-base-100 focus:outline-none"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="mb-2 block text-sm font-semibold opacity-80">Email</label>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full rounded-2xl border-base-300 bg-base-100 focus:outline-none"
                                        placeholder="Your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold opacity-80">Message</label>
                                <textarea
                                    className="textarea textarea-bordered h-36 w-full resize-none rounded-2xl border-base-300 bg-base-100 focus:outline-none"
                                    placeholder="Write your message..."
                                />
                            </div>

                            <button className="btn btn-accent w-full rounded-2xl text-base font-semibold">
                                <span className="inline-flex items-center justify-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Send Message
                                </span>
                            </button>

                            <p className="text-center text-xs opacity-60">
                                By sending, you agree to share your contact details for support purposes.
                            </p>
                        </form>
                    </Motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
