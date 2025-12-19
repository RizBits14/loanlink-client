/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import loginImage from "../assets/auth/loginImage.jpg";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const { loginUser, googleLogin } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-base-100 to-base-200 dark:from-gray-900 dark:to-gray-800">

            <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <img
                    src={loginImage}
                    alt="Login"
                    className="w-full h-48 lg:h-full object-cover lg:rounded-r-3xl"
                />
            </div>

            <div className="flex items-center justify-center w-full lg:w-1/2 p-6 order-2 lg:order-1">
                <div className="w-full max-w-md bg-base-100 dark:bg-gray-900 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-base-content">
                        Welcome Back
                    </h2>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Login to continue
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="email"
                            className="input input-bordered w-full rounded-xl"
                            placeholder="Email"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && (
                            <p className="text-error text-sm">{errors.email.message}</p>
                        )}

                        <input
                            type="password"
                            className="input input-bordered w-full rounded-xl"
                            placeholder="Password"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && (
                            <p className="text-error text-sm">{errors.password.message}</p>
                        )}

                        <button className="btn btn-accent w-full rounded-xl text-lg">
                            Login
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="grow border-t" />
                        <span className="px-3 text-sm text-gray-500">OR</span>
                        <div className="grow border-t" />
                    </div>

                    <button
                        onClick={handleGoogle}
                        className="btn w-full rounded-xl flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        <FcGoogle size={22} /> Continue with Google
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        New here?{" "}
                        <NavLink to="/register" className="link link-accent font-medium">
                            Create an account
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
