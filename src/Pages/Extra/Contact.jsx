import { motion as Motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
    return (
        <section className="bg-base-100 py-20">
            <div className="max-w-6xl mx-auto px-6">
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        Contact Us
                    </h1>
                    <p className="opacity-80 text-lg max-w-3xl mx-auto">
                        Have questions, feedback, or need support? We’d love to hear from you.
                    </p>
                </Motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    <Motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
                            <p className="opacity-80">
                                Reach out for inquiries, feedback, or support. We’re here to help.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="flex items-center gap-2 opacity-90">
                                <Mail className="w-5 h-5 text-btn-accent" />
                                <strong>Email:</strong> support@loanlink.com
                            </p>
                            <p className="flex items-center gap-2 opacity-90">
                                <Phone className="w-5 h-5 text-btn-accent" />
                                <strong>Phone:</strong> +880 1234 567890
                            </p>
                            <p className="flex items-center gap-2 opacity-90">
                                <MapPin className="w-5 h-5 text-btn-accent" />
                                <strong>Address:</strong> Dhaka, Bangladesh
                            </p>
                        </div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-base-200 p-8 rounded-2xl shadow-md"
                    >
                        <form className="space-y-5">
                            <div>
                                <label className="block mb-1 font-medium">Name</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Email</label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    placeholder="Your email"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Message</label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32"
                                    placeholder="Your message"
                                ></textarea>
                            </div>

                            <button className="btn btn-accent w-full flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" /> Send Message
                            </button>
                        </form>
                    </Motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
