import { Link } from "react-router";
import { motion as Motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import errorImg from "../assets/errorImg/errorImg.jpg";

const Error404Page = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-base-100">
            {/* <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-xl" /> */}
            {/* <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-xl" /> */}

            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
                    <Motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="order-2 md:order-1"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/70 px-4 py-2 text-xs font-semibold text-base-content/70 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            404 • Page not found
                        </div>

                        <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
                            Oops! You broke the Internet 😄
                        </h1>

                        <p className="mt-10 font-bold max-w-xl text-white leading-relaxed">
                            The page you’re looking for doesn’t exist, moved, or is temporarily unavailable. Try going back or head to
                            the homepage.
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                to="/"
                                className="btn btn-primary rounded-xl gap-2"
                            >
                                <Home className="h-5 w-5" />
                                Back to Home
                            </Link>

                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="btn btn-ghost rounded-xl gap-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Go Back
                            </button>
                        </div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="order-1 md:order-2"
                    >
                        <Motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative mx-auto max-w-md"
                        >
                            <div className="absolute -inset-2 rounded-3xl bg-linear-to-br from-primary/20 via-transparent to-secondary/20 blur-xl" />
                            <img
                                src={errorImg}
                                alt="404 Error"
                                className="relative w-full rounded-3xl border border-base-300/60 bg-base-100 object-contain shadow-xl"
                            />
                        </Motion.div>
                    </Motion.div>
                </div>
            </div>
        </div>
    );
};

export default Error404Page;
