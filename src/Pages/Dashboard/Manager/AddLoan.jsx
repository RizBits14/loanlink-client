import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";

const AddLoan = () => {
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const loanData = {
            title: data.title,
            description: data.description,
            category: data.category,
            interestRate: data.interestRate,
            maxLoanLimit: data.maxLoanLimit,
            requiredDocuments: data.requiredDocuments.split(","),
            emiPlans: data.emiPlans.split(","),
            images: [data.image],
            showOnHome: data.showOnHome || false,
            createdBy: user.email,
        };

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loans`, {
            credentials: "include",
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(loanData),
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Loan Added",
                text: "The loan has been successfully created.",
                confirmButtonColor: "#16a34a",
            });
            reset();
        }
    };

    return (
        <section className="max-w-5xl mx-auto">

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    Add New Loan
                </h1>
                <p className="mt-2 text-sm opacity-70">
                    Create a new loan product with interest rates, limits, and EMI plans.
                </p>
            </div>

            <div className="
        bg-base-100 
        rounded-2xl 
        shadow-xl 
        p-6 md:p-10
        transition-all
        duration-300
        hover:shadow-2xl
      ">

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    <div className="md:col-span-2">
                        <label className="label font-semibold">Loan Title</label>
                        <input
                            className="input input-bordered w-full focus:scale-[1.01] transition"
                            placeholder="e.g. Small Business Loan"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && (
                            <p className="text-error text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="label font-semibold">Description</label>
                        <textarea
                            className="textarea textarea-bordered w-full h-32 resize-none focus:scale-[1.01] transition"
                            placeholder="Describe the loan features and benefits"
                            {...register("description", { required: "Description is required" })}
                        />
                    </div>

                    <div>
                        <label className="label font-semibold">Category</label>
                        <input
                            className="input input-bordered w-full"
                            placeholder="Business / Education / Agriculture"
                            {...register("category", { required: true })}
                        />
                    </div>

                    <div>
                        <label className="label font-semibold">Interest Rate (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input input-bordered w-full"
                            placeholder="e.g. 7.5"
                            {...register("interestRate", { required: true })}
                        />
                    </div>

                    <div>
                        <label className="label font-semibold">Maximum Loan Limit</label>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            placeholder="e.g. 500000"
                            {...register("maxLoanLimit", { required: true })}
                        />
                    </div>

                    <div>
                        <label className="label font-semibold">EMI Plans</label>
                        <input
                            className="input input-bordered w-full"
                            placeholder="6 months, 12 months, 24 months"
                            {...register("emiPlans", { required: true })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="label font-semibold">Required Documents</label>
                        <input
                            className="input input-bordered w-full"
                            placeholder="NID, Bank Statement, Salary Slip"
                            {...register("requiredDocuments", { required: true })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="label font-semibold">Loan Image URL</label>
                        <input
                            className="input input-bordered w-full"
                            placeholder="https://example.com/loan.jpg"
                            {...register("image", { required: true })}
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-4 mt-2">
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            {...register("showOnHome")}
                        />
                        <span className="font-medium">
                            Display this loan on the home page
                        </span>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            className="
                btn 
                btn-primary 
                w-full 
                text-lg
                tracking-wide
                transition-all
                duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
              "
                        >
                            Add Loan
                        </button>
                    </div>

                </form>
            </div>
        </section>
    );
};

export default AddLoan;
