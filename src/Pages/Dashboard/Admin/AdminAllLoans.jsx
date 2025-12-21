import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import useAllLoans from "../../../Hooks/useAllLoans";
import { motion as Motion } from "framer-motion";

const AdminAllLoans = () => {
    const { data: loans = [], isLoading } = useAllLoans();
    const queryClient = useQueryClient();

    const toggleShowOnHome = async (id, currentValue) => {
        await fetch(`http://localhost:3000/loans/${id}`, {
            credentials: "include",
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
            credentials: "include",
            method: "DELETE",
        });

        queryClient.invalidateQueries(["allLoans"]);
        Swal.fire("Deleted!", "Loan has been deleted.", "success");
    };

    const handleUpdate = async (loan) => {
        // const imagesText = Array.isArray(loan.images) ? loan.images.join("\n") : "";
        // const emiText = Array.isArray(loan.emiPlans) ? loan.emiPlans.join("\n") : "";

        const result = await Swal.fire({
            title: "Update Loan",
            html: `
<div class="space-y-4 text-left">

  <div>
    <label class="block text-sm font-semibold mb-1">Loan Title</label>
    <input id="sw-title" value="${loan.title || ""}" class="w-full px-3 py-2 rounded-lg border" />
  </div>

  <div>
    <label class="block text-sm font-semibold mb-1">Description</label>
    <textarea id="sw-desc" rows="3" class="w-full px-3 py-2 rounded-lg border">${loan.description || ""}</textarea>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div>
      <label class="block text-sm font-semibold mb-1">Category</label>
      <input id="sw-cat" value="${loan.category || ""}" class="w-full px-3 py-2 rounded-lg border" />
    </div>

    <div>
      <label class="block text-sm font-semibold mb-1">Interest Rate (%)</label>
      <input id="sw-interest" type="number" value="${loan.interestRate ?? ""}" class="w-full px-3 py-2 rounded-lg border" />
    </div>
  </div>

  <div>
    <label class="block text-sm font-semibold mb-1">Maximum Loan Limit</label>
    <input id="sw-max" type="number" value="${loan.maxLoanLimit ?? ""}" class="w-full px-3 py-2 rounded-lg border" />
  </div>

  <div>
    <label class="block text-sm font-semibold mb-1">Image URLs (one per line)</label>
    <textarea id="sw-images" rows="3" class="w-full px-3 py-2 rounded-lg border">
${Array.isArray(loan.images) ? loan.images.join("\n") : ""}
    </textarea>
  </div>

  <div>
    <label class="block text-sm font-semibold mb-1">EMI Plans (one per line)</label>
    <textarea id="sw-emi" rows="3" class="w-full px-3 py-2 rounded-lg border">
${Array.isArray(loan.emiPlans) ? loan.emiPlans.join("\n") : ""}
    </textarea>
  </div>

</div>
  `,
            showCancelButton: true,
            confirmButtonText: "Save Changes",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary",
                cancelButton: "btn btn-ghost",
            },
            preConfirm: () => {
                const title = document.getElementById("sw-title").value.trim();
                const description = document.getElementById("sw-desc").value.trim();
                const category = document.getElementById("sw-cat").value.trim();
                const interestRate = Number(document.getElementById("sw-interest").value);
                const maxLoanLimit = Number(document.getElementById("sw-max").value);
                const images = document.getElementById("sw-images").value.split("\n").map(s => s.trim()).filter(Boolean);
                const emiPlans = document.getElementById("sw-emi").value.split("\n").map(s => s.trim()).filter(Boolean);

                if (!title || !description || !category) return Swal.showValidationMessage("Missing fields");
                if (!Number.isFinite(interestRate) || interestRate < 0) return Swal.showValidationMessage("Invalid interest");
                if (!Number.isFinite(maxLoanLimit) || maxLoanLimit <= 0) return Swal.showValidationMessage("Invalid max");
                if (!images.length || !emiPlans.length) return Swal.showValidationMessage("Missing data");

                return { title, description, category, interestRate, maxLoanLimit, images, emiPlans };
            },
        });

        if (!result.isConfirmed) return;

        await fetch(`http://localhost:3000/loans/${loan._id}`, {
            credentials: "include",
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(result.value),
        });

        queryClient.invalidateQueries(["allLoans"]);
        Swal.fire("Updated!", "Loan updated successfully.", "success");
    };

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    return (
        <Motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">All Loans</h1>
                <span className="badge badge-primary badge-lg">Total: {loans.length}</span>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow border">
                <table className="table table-zebra min-w-275">
                    <thead>
                        <tr>
                            <th>Loan</th>
                            <th>Category</th>
                            <th>Interest</th>
                            <th>Max</th>
                            <th>Creator</th>
                            <th>Home</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, i) => (
                            <Motion.tr key={loan._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                                <td className="whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={loan.images?.[0]} className="w-14 h-10 rounded-lg object-cover shrink-0" />
                                        <div>
                                            <p className="font-semibold">{loan.title}</p>
                                            <p className="text-xs opacity-60">{loan._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap">
                                    <span className="badge badge-outline">{loan.category}</span>
                                </td>
                                <td className="whitespace-nowrap text-primary font-medium">
                                    {loan.interestRate}%
                                </td>
                                <td className="whitespace-nowrap">
                                    ${loan.maxLoanLimit}
                                </td>
                                <td className="whitespace-nowrap">
                                    {loan.createdBy || "—"}
                                </td>
                                <td className="whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={!!loan.showOnHome}
                                        onChange={() => toggleShowOnHome(loan._id, loan.showOnHome)}
                                    />
                                </td>
                                <td className="text-right whitespace-nowrap space-x-2">
                                    <button onClick={() => handleUpdate(loan)} className="btn btn-xs btn-info btn-outline">
                                        Update
                                    </button>
                                    <button onClick={() => handleDelete(loan._id)} className="btn btn-xs btn-error btn-outline">
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
