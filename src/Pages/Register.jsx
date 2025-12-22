import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import registerImage from "../assets/auth/registerImage.jpg";
import { FcGoogle } from "react-icons/fc";

export const Register = () => {
    const { createUser, googleLogin, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const validatePassword = (value) => {
        if (value.length < 6) return "Minimum 6 characters";
        if (!/[A-Z]/.test(value)) return "One uppercase letter required";
        if (!/[a-z]/.test(value)) return "One lowercase letter required";
        return true;
    };

    const saveUserToDB = async (userInfo) => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
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
        <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-base-100 to-base-200 dark:from-gray-900 dark:to-gray-800">

            <div className="w-full lg:w-1/2">
                <img
                    src={registerImage}
                    alt="Register"
                    className="w-full h-48 lg:h-full object-cover lg:rounded-l-3xl"
                />
            </div>

            <div className="flex items-center justify-center w-full lg:w-1/2 p-6">
                <div className="w-full max-w-md bg-base-100 dark:bg-gray-900 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-base-content">Create Account</h2>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Join us today</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input className="input input-bordered w-full rounded-xl" placeholder="Full Name" {...register("name", { required: "Name required" })} />
                        {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}

                        <input type="email" className="input input-bordered w-full rounded-xl" placeholder="Email" {...register("email", { required: "Email required" })} />
                        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}

                        <input className="input input-bordered w-full rounded-xl" placeholder="Photo URL" {...register("photoURL", { required: "Photo URL required" })} />
                        {errors.photoURL && <p className="text-error text-sm">{errors.photoURL.message}</p>}

                        <select className="select select-bordered w-full rounded-xl" defaultValue="" {...register("role", { required: "Role required" })}>
                            <option value="" disabled>Select Role</option>
                            <option value="borrower">Borrower</option>
                            <option value="manager">Manager</option>
                        </select>
                        {errors.role && <p className="text-error text-sm">{errors.role.message}</p>}

                        <input type="password" className="input input-bordered w-full rounded-xl" placeholder="Password" {...register("password", { required: true, validate: validatePassword })} />
                        {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}

                        <button className="btn btn-accent w-full rounded-xl text-lg">Register</button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="grow border-t" />
                        <span className="px-3 text-sm text-gray-500">OR</span>
                        <div className="grow border-t" />
                    </div>

                    <button onClick={handleGoogle} className="btn w-full rounded-xl flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                        <FcGoogle size={22} /> Continue with Google
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Already have an account? <NavLink to="/login" className="link link-accent">Login</NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register