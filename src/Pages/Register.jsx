import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { User, Mail, Image as ImageIcon, Shield, Lock, ArrowRight } from "lucide-react";
import useAuth from "../Hooks/useAuth";
import registerImage from "../assets/auth/registerImage.jpg";

export const Register = () => {
    const { createUser, googleLogin, updateUserProfile } = useAuth();
    const navigate = useNavigate();

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

    const validatePassword = (value) => {
        if (value.length < 6) return "Minimum 6 characters";
        if (!/[A-Z]/.test(value)) return "One uppercase letter required";
        if (!/[a-z]/.test(value)) return "One lowercase letter required";
        return true;
    };

    const saveUserToDB = async (userInfo) => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userInfo),
        });
    };

    const onSubmit = async (data) => {
        try {
            await createUser(data.email, data.password);
            await updateUserProfile(data.name, data.photoURL);

            await saveUserToDB({
                name: data.name,
                email: data.email,
                photoURL: data.photoURL,
                role: data.role,
            });

            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Your account has been created successfully!",
                timer: 2000,
                showConfirmButton: false,
            });

            navigate("/");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: error.message,
            });
        }
    };

    const handleGoogle = async () => {
        try {
            const result = await googleLogin();

            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                role: "borrower",
            };

            await saveUserToDB(userInfo);

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Logged in with Google",
                timer: 2000,
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
                    "radial-gradient(900px 420px at 15% 15%, color-mix(in oklab, var(--secondary) 18%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 22%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 58%), var(--bg)",
            }}
        >
            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                    <Motion.div
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
                        className="order-1"
                    >
                        <div
                            className="relative h-56 sm:h-72 lg:h-full overflow-hidden rounded-3xl border"
                            style={{ borderColor: "var(--border)", boxShadow: "var(--card-shadow)" }}
                        >
                            <img ref={imgRef} src={registerImage} alt="Register" className="h-full w-full object-cover" />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.45))",
                                }}
                            />
                        </div>
                    </Motion.div>

                    <Motion.div
                        ref={cardRef}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="order-2"
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
                                        Create account
                                    </h2>
                                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                                        Join LoanLink and get role-based access to the platform.
                                    </p>
                                </div>
                                <div
                                    className="hidden sm:flex items-center gap-2 rounded-2xl border px-3 py-2"
                                    style={{
                                        borderColor: "var(--border)",
                                        backgroundColor: "color-mix(in oklab, var(--surface) 86%, transparent)",
                                    }}
                                >
                                    <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                                        Verified
                                    </span>
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Full name
                                    </label>
                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                                        style={{
                                            borderColor: errors.name ? "color-mix(in oklab, var(--danger) 60%, var(--border))" : "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <User size={18} style={{ color: "var(--muted)" }} />
                                        <input
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            placeholder="Your full name"
                                            {...register("name", { required: "Name required" })}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

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
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            placeholder="you@example.com"
                                            {...register("email", { required: "Email required" })}
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
                                        Photo URL
                                    </label>
                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                                        style={{
                                            borderColor: errors.photoURL ? "color-mix(in oklab, var(--danger) 60%, var(--border))" : "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <ImageIcon size={18} style={{ color: "var(--muted)" }} />
                                        <input
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            placeholder="https://..."
                                            {...register("photoURL", { required: "Photo URL required" })}
                                        />
                                    </div>
                                    {errors.photoURL && (
                                        <p className="text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.photoURL.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Role
                                    </label>
                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                                        style={{
                                            borderColor: errors.role ? "color-mix(in oklab, var(--danger) 60%, var(--border))" : "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <Shield size={18} style={{ color: "var(--muted)" }} />
                                        <select
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            defaultValue=""
                                            {...register("role", { required: "Role required" })}
                                        >
                                            <option value="" disabled>
                                                Select role
                                            </option>
                                            <option value="borrower">Borrower</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>
                                    {errors.role && (
                                        <p className="text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.role.message}
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
                                            borderColor: errors.password
                                                ? "color-mix(in oklab, var(--danger) 60%, var(--border))"
                                                : "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        }}
                                    >
                                        <Lock size={18} style={{ color: "var(--muted)" }} />
                                        <input
                                            type="password"
                                            className="w-full bg-transparent outline-none text-sm"
                                            style={{ color: "var(--text)" }}
                                            placeholder="••••••••"
                                            {...register("password", { required: true, validate: validatePassword })}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm" style={{ color: "var(--danger)" }}>
                                            {errors.password.message}
                                        </p>
                                    )}
                                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                                        Use 6+ characters with at least one uppercase and one lowercase letter.
                                    </p>
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
                                    Register
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
                                Already have an account?{" "}
                                <NavLink to="/login" className="font-semibold" style={{ color: "var(--secondary)" }}>
                                    Login
                                </NavLink>
                            </p>
                        </div>
                    </Motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
