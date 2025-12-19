import Swal from "sweetalert2";
import useAllUsers from "../../../Hooks/useAllUsers";
import { useQueryClient } from "@tanstack/react-query";

const ManageUsers = () => {
    const { data: users = [] } = useAllUsers();
    const queryClient = useQueryClient();

    const handleRoleChange = async (id, role) => {
        const result = await Swal.fire({
            title: "Change User Role?",
            text: `Set role to "${role}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update",
        });

        if (!result.isConfirmed) return;

        await fetch(`http://localhost:3000/users/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ role }),
        });

        queryClient.invalidateQueries(["allUsers"]);

        Swal.fire("Updated!", "User role updated.", "success");
    };

    const handleSuspend = async (id, status) => {
        const result = await Swal.fire({
            title: status === "active" ? "Suspend User?" : "Activate User?",
            text: "This will change user access status.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
        });

        if (!result.isConfirmed) return;

        await fetch(`http://localhost:3000/users/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                status: status === "active" ? "suspended" : "active",
            }),
        });

        queryClient.invalidateQueries(["allUsers"]);

        Swal.fire("Success!", "User status updated.", "success");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name || "N/A"}</td>
                                <td>{user.email}</td>
                                <td className="capitalize">{user.role}</td>
                                <td>
                                    <span
                                        className={`badge ${user.status === "active"
                                            ? "badge-success"
                                            : "badge-error"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() =>
                                            handleRoleChange(
                                                user._id,
                                                user.role === "manager" ? "borrower" : "manager"
                                            )
                                        }
                                        className="btn btn-xs btn-outline"
                                    >
                                        Make {user.role === "manager" ? "Borrower" : "Manager"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleSuspend(user._id, user.status)
                                        }
                                        className="btn btn-xs btn-error"
                                    >
                                        {user.status === "active" ? "Suspend" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
