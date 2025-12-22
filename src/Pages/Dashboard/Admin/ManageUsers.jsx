import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useAllUsers from "../../../Hooks/useAllUsers";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";

const ManageUsers = () => {
    const { user: authUser } = useAuth();
    const { data: users = [], isLoading } = useAllUsers();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const openModal = (u) => {
        setSelectedUser(u);
        setRole(u.role);
        setStatus(u.status);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedUser(null);
    };

    const patchUser = async (id, payload) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
            credentials: "include",
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.message || "Failed to update user");
        }
        return res.json();
    };

    const collectSuspendDetails = async () => {
        const result = await Swal.fire({
            title: "Suspend User",
            html: `
        <div style="text-align:left;">
          <label style="display:block;font-weight:600;margin-bottom:6px;">Suspend Reason</label>
          <select id="swal-reason" class="swal2-input" style="width:100%;margin:0 0 12px 0;">
            <option value="" selected disabled>Select a reason</option>
            <option value="Policy violation">Policy violation</option>
            <option value="Fraud suspicion">Fraud suspicion</option>
            <option value="Spam / abuse">Spam / abuse</option>
            <option value="Other">Other</option>
          </select>

          <label style="display:block;font-weight:600;margin-bottom:6px;">Why suspend (feedback)</label>
          <textarea id="swal-feedback" class="swal2-textarea" placeholder="Write details..." style="margin:0;width:100%;"></textarea>
        </div>
      `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Suspend",
            confirmButtonColor: "#ef4444",
            preConfirm: () => {
                const reason = document.getElementById("swal-reason")?.value?.trim();
                const feedback = document.getElementById("swal-feedback")?.value?.trim();

                if (!reason) {
                    Swal.showValidationMessage("Please select a suspend reason.");
                    return;
                }
                if (!feedback) {
                    Swal.showValidationMessage("Please write why you are suspending this user.");
                    return;
                }
                return { suspendReason: reason, suspendFeedback: feedback };
            },
        });

        if (!result.isConfirmed) return null;
        return result.value;
    };

    const handleSuspend = async (u) => {
        if (u?.email?.toLowerCase() === authUser?.email?.toLowerCase()) {
            return Swal.fire("Not allowed", "You cannot suspend your own account.", "info");
        }

        if ((u.role || "").toLowerCase() === "admin") {
            return Swal.fire("Not allowed", "You cannot suspend an admin account.", "info");
        }

        const details = await collectSuspendDetails();
        if (!details) return;

        try {
            await patchUser(u._id, {
                status: "suspended",
                ...details,
            });

            queryClient.invalidateQueries(["allUsers"]);
            Swal.fire("Suspended!", "User has been suspended successfully.", "success");
        } catch (e) {
            Swal.fire("Error", e.message, "error");
        }
    };

    const handleActivate = async (u) => {
        const result = await Swal.fire({
            title: "Activate User?",
            text: "This will restore account access.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Activate",
            confirmButtonColor: "#22c55e",
        });

        if (!result.isConfirmed) return;

        try {
            await patchUser(u._id, { status: "active" });
            queryClient.invalidateQueries(["allUsers"]);
            Swal.fire("Activated!", "User is active again.", "success");
        } catch (e) {
            Swal.fire("Error", e.message, "error");
        }
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: "Update User?",
            text: "Apply these changes to this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update",
        });

        if (!result.isConfirmed) return;

        let suspendPayload = {};
        if (status === "suspended" && selectedUser.status !== "suspended") {
            const details = await collectSuspendDetails();
            if (!details) return;
            suspendPayload = details;
        }

        try {
            await patchUser(selectedUser._id, {
                role,
                status,
                ...suspendPayload,
            });

            setIsOpen(false);
            setSelectedUser(null);
            queryClient.invalidateQueries(["allUsers"]);
            Swal.fire("Updated!", "User updated successfully.", "success");
        } catch (e) {
            Swal.fire("Error", e.message, "error");
        }
    };

    const isChanged =
        !!selectedUser &&
        (role !== selectedUser.role || status !== selectedUser.status);

    const filteredUsers = useMemo(() => {
        return users
            .filter((u) =>
                (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
                (u.email || "").toLowerCase().includes(search.toLowerCase())
            )
            .filter((u) => (filterRole ? u.role === filterRole : true))
            .filter((u) => (filterStatus ? u.status === filterStatus : true));
    }, [users, search, filterRole, filterStatus]);

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Manage Users</h1>
                <span className="badge badge-primary badge-lg">{users.length} Users</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full md:w-1/3"
                />

                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="select select-bordered w-full md:w-1/6"
                >
                    <option value="">All Roles</option>
                    <option value="borrower">Borrower</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="select select-bordered w-full md:w-1/6"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 opacity-70">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => {
                                const isSelf = u?.email?.toLowerCase() === authUser?.email?.toLowerCase();
                                const isAdmin = (u.role || "").toLowerCase() === "admin";

                                return (
                                    <tr key={u._id}>
                                        <td>{u.name || "N/A"}</td>
                                        <td>{u.email}</td>
                                        <td className="capitalize">{u.role}</td>
                                        <td>
                                            <span className={`badge ${u.status === "active" ? "badge-success" : "badge-error"}`}>
                                                {u.status}
                                            </span>
                                        </td>

                                        <td className="text-right space-x-2">
                                            <button
                                                onClick={() => openModal(u)}
                                                className="btn btn-sm btn-outline bg-accent text-black mb-2"
                                            >
                                                Update
                                            </button>

                                            {u.status === "active" ? (
                                                <button
                                                    onClick={() => handleSuspend(u)}
                                                    disabled={isSelf || isAdmin}
                                                    className="btn btn-sm btn-error btn-outline"
                                                    title={
                                                        isSelf
                                                            ? "You cannot suspend yourself"
                                                            : isAdmin
                                                                ? "You cannot suspend an admin"
                                                                : "Suspend user"
                                                    }
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(u)}
                                                    className="btn btn-sm btn-success btn-outline"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isOpen && selectedUser && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b bg-linear-to-r from-primary/10 to-secondary/10">
                                <h3 className="text-xl font-semibold">Update User</h3>
                                <p className="text-sm opacity-70">Manage role and access</p>
                            </div>

                            <div className="px-6 py-5 flex items-center gap-4 border-b">
                                <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
                                    {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">
                                        {selectedUser.name || "Unnamed User"}
                                    </h4>
                                    <p className="text-sm opacity-70">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="badge badge-outline capitalize">{selectedUser.role}</span>
                                        <span className={`badge ${selectedUser.status === "active" ? "badge-success" : "badge-error"}`}>
                                            {selectedUser.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label font-medium">User Role</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="borrower">Borrower</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label font-medium">Account Status</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>

                                    <p className="text-xs opacity-70 mt-2">
                                        If you select <b>suspended</b>, you will be asked for reason & feedback.
                                    </p>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t flex justify-end gap-3">
                                <button onClick={closeModal} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={!isChanged}
                                    className="btn btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsers;
