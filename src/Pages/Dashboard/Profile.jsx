import React, { } from "react";
import { motion as Motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import useDbUser from "../../Hooks/useDBUser";

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-base-200">
        <p className="opacity-70 text-sm">{label}</p>
        <p className="font-medium text-right break-all">{value || "—"}</p>
    </div>
);

const Profile = () => {
    const { user } = useAuth();
    const { data: dbUser, isLoading } = useDbUser();

    const joined = dbUser?.createdAt
        ? new Date(dbUser.createdAt).toLocaleDateString()
        : "—";

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    const role = (dbUser?.role || "borrower").toLowerCase();
    const status = (dbUser?.status || "active").toLowerCase();

    return (
        <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
        >
            <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img
                                src={user?.photoURL || "https://i.ibb.co/2kR9K5Q/user.png"}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user?.displayName || "Unnamed User"}
                        </h1>
                        <p className="opacity-70">{user?.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="badge badge-primary capitalize">{role}</span>
                            <span
                                className={`badge ${status === "active" ? "badge-success" : "badge-error"
                                    } capitalize`}
                            >
                                {status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="md:ml-auto grid grid-cols-2 gap-3 w-full md:w-auto">
                    <div className="bg-base-200/60 rounded-xl p-4">
                        <p className="text-xs opacity-70">Joined</p>
                        <p className="font-semibold">{joined}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                    <h2 className="text-lg font-semibold mb-2">Account Details</h2>
                    <InfoRow label="Full Name" value={user?.displayName} />
                    <InfoRow label="Email" value={user?.email} />
                    <InfoRow label="Role" value={role} />
                    <InfoRow label="Status" value={status} />
                    <InfoRow label="Joined Date" value={joined} />
                </div>

                <div className="bg-base-100 rounded-2xl p-6 shadow border border-base-200">
                    <h2 className="text-lg font-semibold mb-2">Quick Notes</h2>
                    <div className="space-y-3 opacity-80">
                        {role === "admin" && (
                            <p>
                                As an <b>Admin</b>, you can manage users, manage all loans,
                                and review all applications.
                            </p>
                        )}
                        {role === "manager" && (
                            <p>
                                As a <b>Manager</b>, you can add/manage loans and handle
                                pending/approved applications.
                            </p>
                        )}
                        {role === "borrower" && (
                            <p>
                                As a <b>Borrower</b>, you can apply for loans, track status,
                                and pay the application fee after approval.
                            </p>
                        )}
                        <p className="text-sm opacity-70">
                            (Optional later) You can add an “Edit Profile” form if your
                            assignment needs it.
                        </p>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
};

export default Profile;
