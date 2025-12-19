import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import useAllLoans from "../../../Hooks/useAllLoans";
import { motion as Motion } from "framer-motion";

const AdminAllLoans = () => {
    const { data: loans = [], isLoading } = useAllLoans();
    const queryClient = useQueryClient();

    const toggleShowOnHome = async (id, currentValue) => {
        await fetch(`http://localhost:3000/loans/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ showOnHome: !currentValue }),
        });

        queryClient.invalidateQueries(["allLoans"]);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Loan?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        await fetch(`http://localhost:3000/loans/${id}`, {
            method: "DELETE",
        });

        queryClient.invalidateQueries(["allLoans"]);
        Swal.fire("Deleted!", "Loan has been deleted.", "success");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    All Loans
                </h1>
                <span className="badge badge-primary badge-lg">
                    Total: {loans.length}
                </span>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-lg border border-base-200">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base font-semibold">
                        <tr>
                            <th>Loan</th>
                            <th>Category</th>
                            <th>Interest</th>
                            <th>Max Limit</th>
                            <th>Show on Home</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loans.map((loan, index) => (
                            <Motion.tr
                                key={loan._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-base-200/60 transition"
                            >
                                <td className="flex items-center gap-4">
                                    <img
                                        src={loan.images?.[0]}
                                        alt={loan.title}
                                        className="w-16 h-12 object-cover rounded-xl shadow"
                                    />
                                    <div>
                                        <p className="font-semibold leading-tight">
                                            {loan.title}
                                        </p>
                                        <p className="text-xs opacity-70">
                                            ID: {loan._id.slice(-6)}
                                        </p>
                                    </div>
                                </td>

                                <td>
                                    <span className="badge badge-outline">
                                        {loan.category}
                                    </span>
                                </td>

                                <td className="font-medium text-primary">
                                    {loan.interestRate}%
                                </td>

                                <td className="font-semibold">
                                    ${loan.maxLoanLimit}
                                </td>

                                <td>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={loan.showOnHome}
                                        onChange={() =>
                                            toggleShowOnHome(
                                                loan._id,
                                                loan.showOnHome
                                            )
                                        }
                                    />
                                </td>

                                <td className="text-right">
                                    <button
                                        onClick={() => handleDelete(loan._id)}
                                        className="btn btn-xs btn-error btn-outline hover:scale-105 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </Motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Motion.div>
    );
};

export default AdminAllLoans;
