import React from 'react';
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Manage Users</h1>
                <span className="badge badge-primary badge-sm w-fit md:hidden">
                    {users.length} Users
                </span>
                <span className="hidden md:inline-flex badge badge-primary badge-lg">
                    {users.length} Users
                </span>
            </div>

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
                                <td>
                                    <div className="flex flex-col gap-3 md:flex-col md:justify-end md:gap-2">
                                        <button
                                            onClick={() =>
                                                handleRoleChange(
                                                    user._id,
                                                    user.role === "manager" ? "borrower" : "manager"
                                                )
                                            }
                                            className="btn md:btn-sm btn-outline w-full md:w-auto p-2 text-black bg-amber-400"
                                        >
                                            Make {user.role === "manager" ? "Borrower" : "Manager"}
                                        </button>
                                        <button
                                            onClick={() => handleSuspend(user._id, user.status)}
                                            className="btn md:btn-sm btn-error w-full md:w-auto p-2 text-black "
                                        >
                                            {user.status === "active" ? "Suspend" : "Activate"}
                                        </button>
                                    </div>
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
