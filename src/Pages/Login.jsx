/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, ArrowRight } from "lucide-react";
import useAuth from "../Hooks/useAuth";
import loginImage from "../assets/auth/loginImage.jpg";

const Login = () => {
    const { loginUser, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const wrapRef = useRef(null);
    const cardRef = useRef(null);
    const imgRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { y: 18, opacity: 0, filter: "blur(6px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
            );
            gsap.fromTo(
                imgRef.current,
                { scale: 1.06, opacity: 0.85 },
                { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" }
            );
        }, wrapRef);
        return () => ctx.revert();
    }, []);

    const onSubmit = async (data) => {
        try {
            await loginUser(data.email, data.password);
            Swal.fire({
                icon: "success",
                title: "Login Successful",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Email or password does not match",
            });
        }
    };

    const handleGoogle = async () => {
        try {
            await googleLogin();
            Swal.fire({
                icon: "success",
                title: "Logged in with Google",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Google Login Failed",
                text: error.message,
            });
        }
    };

    return (
        <div
            ref={wrapRef}
            className="min-h-screen w-full overflow-hidden"
            style={{
                background:
                    "radial-gradient(900px 420px at 20% 10%, color-mix(in oklab, var(--secondary) 18%, transparent), transparent 60%), radial-gradient(900px 520px at 90% 20%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 58%), var(--bg)",
            }}
        >
            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                    <Motion.div
                        ref={cardRef}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="order-2 lg:order-1"
                    >
                        <div
                            className="rounded-3xl border p-8 sm:p-10"
                            style={{
                                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                borderColor: "var(--border)",
                                boxShadow: "var(--card-shadow)",
                                backdropFilter: "blur(18px)",
                            }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                                        Welcome back
                                    </h2>
                                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                                        Sign in to manage applications, approvals, and payments.
                                    </p>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 rounded-2xl border px-3 py-2"
                                    style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in oklab, var(--surface) 86%, transparent)" }}
                                >
                                    <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Secure</span>
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Email
                                    </label>
                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                                        style={{
                                            borderColor: errors.email ? "color-mix(in oklab, var(--danger) 60%, var(--border))" : "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <Mail size={18} style={{ color: "var(--muted)" }} />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            {...register("email", { required: "Email is required" })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Password
                                    </label>
                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                                        style={{
                                            borderColor: errors.password ? "color-mix(in oklab, var(--danger) 60%, var(--border))" : "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <Lock size={18} style={{ color: "var(--muted)" }} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            {...register("password", { required: "Password is required" })}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <Motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2"
                                    style={{
                                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                        color: "white",
                                        boxShadow: "0 16px 40px color-mix(in oklab, var(--primary) 22%, transparent)",
                                    }}
                                >
                                    Login
                                    <ArrowRight size={18} />
                                </Motion.button>
                            </form>

                            <div className="my-7 flex items-center gap-4">
                                <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
                                <span className="text-xs font-semibold tracking-wider" style={{ color: "var(--muted)" }}>
                                    OR
                                </span>
                                <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
                            </div>

                            <Motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogle}
                                className="w-full rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-3 border"
                                style={{
                                    borderColor: "var(--border)",
                                    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                    color: "var(--text)",
                                }}
                            >
                                <FcGoogle size={22} />
                                Continue with Google
                            </Motion.button>

                            <p className="mt-7 text-center text-sm" style={{ color: "var(--muted)" }}>
                                New here?{" "}
                                <NavLink
                                    to="/register"
                                    className="font-semibold"
                                    style={{ color: "var(--secondary)" }}
                                >
                                    Create an account
                                </NavLink>
                            </p>
                        </div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
                        className="order-1 lg:order-2"
                    >
                        <div className="relative h-56 sm:h-72 lg:h-full overflow-hidden rounded-3xl border"
                            style={{ borderColor: "var(--border)", boxShadow: "var(--card-shadow)" }}
                        >
                            <img
                                ref={imgRef}
                                src={loginImage}
                                alt="Login"
                                className="h-full w-full object-cover"
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.45))",
                                }}
                            />
                        </div>
                    </Motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
