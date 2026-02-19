import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
    Search,
    Filter,
    Users,
    Shield,
    UserCog,
    User,
    Mail,
    BadgeCheck,
    BadgeX,
    Ban,
    Pencil,
    Power,
    AlertTriangle,
    X,
} from "lucide-react";
import useAllUsers from "../../../Hooks/useAllUsers";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";

const shellStyle = {
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
    boxShadow: "var(--card-shadow)",
};

const chipStyle = (tone = "neutral") => {
    if (tone === "primary") return { backgroundColor: "color-mix(in oklab, var(--primary) 12%, transparent)", borderColor: "color-mix(in oklab, var(--primary) 22%, var(--border))" };
    if (tone === "success") return { backgroundColor: "color-mix(in oklab, var(--success) 12%, transparent)", borderColor: "color-mix(in oklab, var(--success) 22%, var(--border))" };
    if (tone === "danger") return { backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)", borderColor: "color-mix(in oklab, var(--danger) 22%, var(--border))" };
    if (tone === "warning") return { backgroundColor: "color-mix(in oklab, var(--warning) 12%, transparent)", borderColor: "color-mix(in oklab, var(--warning) 22%, var(--border))" };
    return { backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)", borderColor: "var(--border)" };
};

const roleMeta = (role) => {
    const r = String(role || "").toLowerCase();
    if (r === "admin") return { label: "Admin", icon: Shield, tone: "primary" };
    if (r === "manager") return { label: "Manager", icon: UserCog, tone: "primary" };
    return { label: "Borrower", icon: User, tone: "neutral" };
};

const statusMeta = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "active") return { label: "Active", icon: BadgeCheck, tone: "success" };
    return { label: "Suspended", icon: Ban, tone: "danger" };
};

const initials = (nameOrEmail) => {
    const s = String(nameOrEmail || "").trim();
    if (!s) return "U";
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

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

    const wrapRef = useRef(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".mu-reveal",
                { opacity: 0, y: 14, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.06 }
            );
        }, wrapRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

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
        <div class="text-left space-y-3">
          <div class="p-4 rounded-xl bg-base-200">
            <p class="text-xs uppercase opacity-60">Reason</p>
            <select id="swal-reason" class="swal2-input" style="width:100%;margin:8px 0 0 0;">
              <option value="" selected disabled>Select a reason</option>
              <option value="Policy violation">Policy violation</option>
              <option value="Fraud suspicion">Fraud suspicion</option>
              <option value="Spam / abuse">Spam / abuse</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="p-4 rounded-xl bg-base-200">
            <p class="text-xs uppercase opacity-60">Feedback</p>
            <textarea id="swal-feedback" class="swal2-textarea" placeholder="Write details..." style="margin:8px 0 0 0;width:100%;"></textarea>
          </div>
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
            didOpen: () => {
                const popup = Swal.getPopup();
                if (!popup) return;
                popup.style.border = "1px solid var(--border)";
                popup.style.background = "color-mix(in oklab, var(--surface) 96%, transparent)";
                popup.style.boxShadow = "var(--card-shadow)";
                popup.style.borderRadius = "18px";
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
            didOpen: () => {
                const popup = Swal.getPopup();
                if (!popup) return;
                popup.style.border = "1px solid var(--border)";
                popup.style.background = "color-mix(in oklab, var(--surface) 96%, transparent)";
                popup.style.boxShadow = "var(--card-shadow)";
                popup.style.borderRadius = "18px";
            },
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
            didOpen: () => {
                const popup = Swal.getPopup();
                if (!popup) return;
                popup.style.border = "1px solid var(--border)";
                popup.style.background = "color-mix(in oklab, var(--surface) 96%, transparent)";
                popup.style.boxShadow = "var(--card-shadow)";
                popup.style.borderRadius = "18px";
            },
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

    const isChanged = !!selectedUser && (role !== selectedUser.role || status !== selectedUser.status);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users
            .filter((u) => {
                if (!q) return true;
                const n = (u.name || "").toLowerCase();
                const e = (u.email || "").toLowerCase();
                return n.includes(q) || e.includes(q);
            })
            .filter((u) => (filterRole ? u.role === filterRole : true))
            .filter((u) => (filterStatus ? u.status === filterStatus : true));
    }, [users, search, filterRole, filterStatus]);

    const totals = useMemo(() => {
        const t = { all: users.length, active: 0, suspended: 0 };
        for (const u of users) {
            const s = String(u.status || "").toLowerCase();
            if (s === "active") t.active += 1;
            if (s === "suspended") t.suspended += 1;
        }
        return t;
    }, [users]);

    if (isLoading) {
        return (
            <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
                Loading...
            </div>
        );
    }

    return (
        <div
            ref={wrapRef}
            className="space-y-6"
            style={{
                background:
                    "radial-gradient(900px 420px at 12% 8%, color-mix(in oklab, var(--secondary) 14%, transparent), transparent 60%), radial-gradient(900px 520px at 92% 18%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 58%), transparent",
            }}
        >
            <div className="mu-reveal flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                        Manage Users
                    </h1>
                    <p className="mt-1" style={{ color: "var(--muted)" }}>
                        Search, filter, and manage roles and account access.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold" style={{ ...chipStyle("primary"), color: "var(--text)" }}>
                        <Users size={16} style={{ color: "var(--primary)" }} />
                        Total: {totals.all}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold" style={{ ...chipStyle("success"), color: "var(--text)" }}>
                        <BadgeCheck size={16} style={{ color: "var(--success)" }} />
                        Active: {totals.active}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold" style={{ ...chipStyle("danger"), color: "var(--text)" }}>
                        <Ban size={16} style={{ color: "var(--danger)" }} />
                        Suspended: {totals.suspended}
                    </span>
                </div>
            </div>

            <div className="mu-reveal grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-6">
                    <div className="flex items-center gap-2 rounded-2xl border px-3 h-12" style={shellStyle}>
                        <Search size={18} style={{ color: "var(--muted)" }} />
                        <input
                            className="w-full bg-transparent outline-none text-sm"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ color: "var(--text)" }}
                        />
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 rounded-2xl border px-3 h-12" style={shellStyle}>
                        <Filter size={18} style={{ color: "var(--muted)" }} />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full text-sm rounded-xl px-3 py-2 border"
                            style={{
                                color: "var(--text)",
                                backgroundColor: "var(--surface)",
                                borderColor: "var(--border)",
                            }}
                        >
                            <option value="" style={{ background: "var(--surface)", color: "var(--text)" }}>
                                All Roles
                            </option>
                            <option value="borrower" style={{ background: "var(--surface)", color: "var(--text)" }}>
                                Borrower
                            </option>
                            <option value="manager" style={{ background: "var(--surface)", color: "var(--text)" }}>
                                Manager
                            </option>
                            <option value="admin" style={{ background: "var(--surface)", color: "var(--text)" }}>
                                Admin
                            </option>
                        </select>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 rounded-2xl border px-3 h-12" style={shellStyle}>
                        <Filter size={18} style={{ color: "var(--muted)" }} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full text-sm rounded-xl px-3 py-2 border outline-none appearance-none cursor-pointer"
                            style={{
                                color: "var(--text)",
                                backgroundColor: "var(--surface)",
                                borderColor: "var(--border)",
                            }}
                        >
                            <option
                                value=""
                                style={{ background: "var(--surface)", color: "var(--text)" }}
                            >
                                All Status
                            </option>

                            <option
                                value="active"
                                style={{ background: "var(--surface)", color: "var(--text)" }}
                            >
                                Active
                            </option>

                            <option
                                value="suspended"
                                style={{ background: "var(--surface)", color: "var(--text)" }}
                            >
                                Suspended
                            </option>
                        </select>

                    </div>
                </div>
            </div>

            <div className="mu-reveal rounded-3xl border overflow-hidden" style={shellStyle}>
                <div className="overflow-x-auto">
                    <table className="table w-full min-w-262.5">
                        <thead
                            style={{
                                backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                                color: "var(--text)",
                            }}
                        >
                            <tr>
                                <th className="font-semibold">User</th>
                                <th className="font-semibold">Role</th>
                                <th className="font-semibold">Status</th>
                                <th className="font-semibold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-10" style={{ color: "var(--muted)" }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u, idx) => {
                                    const isSelf = u?.email?.toLowerCase() === authUser?.email?.toLowerCase();
                                    const isAdmin = (u.role || "").toLowerCase() === "admin";

                                    const r = roleMeta(u.role);
                                    const s = statusMeta(u.status);
                                    const RoleIcon = r.icon;
                                    const StatusIcon = s.icon;

                                    return (
                                        <Motion.tr
                                            key={u._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(idx * 0.015, 0.2) }}
                                            className="group"
                                        >
                                            <td className="whitespace-nowrap">
                                                <div className="min-w-130">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="grid h-11 w-11 place-items-center rounded-2xl border font-bold"
                                                            style={{
                                                                borderColor: "var(--border)",
                                                                backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
                                                                color: "var(--text)",
                                                            }}
                                                        >
                                                            {initials(u.name || u.email)}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                                                                {u.name || "Unnamed User"}
                                                                {isSelf ? (
                                                                    <span
                                                                        className="ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold align-middle"
                                                                        style={{ ...chipStyle("warning"), color: "var(--text)" }}
                                                                    >
                                                                        <AlertTriangle size={12} style={{ color: "var(--warning)" }} />
                                                                        You
                                                                    </span>
                                                                ) : null}
                                                            </p>
                                                            <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                                                                <span className="inline-flex items-center gap-2">
                                                                    <Mail size={14} style={{ color: "var(--muted)" }} />
                                                                    {u.email || "—"}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold capitalize"
                                                    style={{ ...chipStyle(r.tone), color: "var(--text)" }}
                                                >
                                                    <RoleIcon size={16} style={{ color: "var(--primary)" }} />
                                                    {r.label}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold capitalize"
                                                    style={{ ...chipStyle(s.tone), color: "var(--text)" }}
                                                >
                                                    <StatusIcon size={16} style={{ color: s.tone === "success" ? "var(--success)" : "var(--danger)" }} />
                                                    {s.label}
                                                </span>
                                            </td>

                                            <td className="text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-2">
                                                    <Motion.button
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => openModal(u)}
                                                        className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                        style={{
                                                            borderColor: "var(--border)",
                                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                                            color: "var(--text)",
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <Pencil size={16} style={{ color: "var(--muted)" }} />
                                                            Update
                                                        </span>
                                                    </Motion.button>

                                                    {String(u.status || "").toLowerCase() === "active" ? (
                                                        <Motion.button
                                                            whileHover={{ y: -2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleSuspend(u)}
                                                            disabled={isSelf || isAdmin}
                                                            className="h-10 px-3 rounded-2xl text-sm font-semibold border disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                            title={
                                                                isSelf
                                                                    ? "You cannot suspend yourself"
                                                                    : isAdmin
                                                                        ? "You cannot suspend an admin"
                                                                        : "Suspend user"
                                                            }
                                                            style={{
                                                                borderColor: "color-mix(in oklab, var(--danger) 24%, var(--border))",
                                                                backgroundColor: "color-mix(in oklab, var(--danger) 10%, transparent)",
                                                                color: "var(--text)",
                                                            }}
                                                        >
                                                            <span className="inline-flex items-center gap-2">
                                                                <Ban size={16} style={{ color: "var(--danger)" }} />
                                                                Suspend
                                                            </span>
                                                        </Motion.button>
                                                    ) : (
                                                        <Motion.button
                                                            whileHover={{ y: -2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleActivate(u)}
                                                            className="h-10 px-3 rounded-2xl text-sm font-semibold border cursor-pointer"
                                                            style={{
                                                                borderColor: "color-mix(in oklab, var(--success) 24%, var(--border))",
                                                                backgroundColor: "color-mix(in oklab, var(--success) 10%, transparent)",
                                                                color: "var(--text)",
                                                            }}
                                                        >
                                                            <span className="inline-flex items-center gap-2">
                                                                <Power size={16} style={{ color: "var(--success)" }} />
                                                                Activate
                                                            </span>
                                                        </Motion.button>
                                                    )}
                                                </div>
                                            </td>
                                        </Motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t"
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: "color-mix(in oklab, var(--surface) 88%, transparent)",
                    }}
                >
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                        Tip: Filter by role + status for faster admin actions.
                    </p>
                    <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--muted)" }}>
                        Showing: {filteredUsers.length} / {users.length}
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && selectedUser ? (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center p-4"
                        style={{
                            backgroundColor: "color-mix(in oklab, #000 55%, transparent)",
                            backdropFilter: "blur(10px)",
                        }}
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) closeModal();
                        }}
                    >
                        <Motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.985 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="w-full max-w-2xl overflow-hidden rounded-3xl border"
                            style={shellStyle}
                        >
                            <div
                                className="px-6 py-5 border-b flex items-center justify-between gap-4"
                                style={{
                                    borderColor: "var(--border)",
                                    background:
                                        "linear-gradient(135deg, color-mix(in oklab, var(--primary) 14%, transparent), color-mix(in oklab, var(--secondary) 12%, transparent))",
                                }}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
                                        Update User
                                    </h3>
                                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                                        Manage role and account access.
                                    </p>
                                </div>

                                <Motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={closeModal}
                                    className="grid h-10 w-10 place-items-center rounded-2xl border"
                                    style={{
                                        borderColor: "var(--border)",
                                        backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                        color: "var(--text)",
                                    }}
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </Motion.button>
                            </div>

                            <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="grid h-14 w-14 place-items-center rounded-3xl border text-lg font-extrabold"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--primary) 12%, transparent)",
                                            color: "var(--text)",
                                        }}
                                    >
                                        {initials(selectedUser.name || selectedUser.email)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-lg truncate" style={{ color: "var(--text)" }}>
                                            {selectedUser.name || "Unnamed User"}
                                        </h4>
                                        <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                                            {selectedUser.email}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            {(() => {
                                                const r = roleMeta(selectedUser.role);
                                                const s = statusMeta(selectedUser.status);
                                                const RI = r.icon;
                                                const SI = s.icon;
                                                return (
                                                    <>
                                                        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold" style={{ ...chipStyle(r.tone), color: "var(--text)" }}>
                                                            <RI size={16} style={{ color: "var(--primary)" }} />
                                                            {r.label}
                                                        </span>
                                                        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold" style={{ ...chipStyle(s.tone), color: "var(--text)" }}>
                                                            <SI size={16} style={{ color: s.tone === "success" ? "var(--success)" : "var(--danger)" }} />
                                                            {s.label}
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        User Role
                                    </label>
                                    <div className="mt-2 rounded-2xl border px-3 h-12 flex items-center" style={shellStyle}>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full text-sm capitalize rounded-xl px-3 py-2 border outline-none appearance-none cursor-pointer"
                                            style={{
                                                color: "var(--text)",
                                                backgroundColor: "var(--surface)",
                                                borderColor: "var(--border)",
                                            }}
                                        >
                                            <option
                                                value="borrower"
                                                style={{ background: "var(--surface)", color: "var(--text)" }}
                                            >
                                                Borrower
                                            </option>

                                            <option
                                                value="manager"
                                                style={{ background: "var(--surface)", color: "var(--text)" }}
                                            >
                                                Manager
                                            </option>

                                            <option
                                                value="admin"
                                                style={{ background: "var(--surface)", color: "var(--text)" }}
                                            >
                                                Admin
                                            </option>
                                        </select>

                                    </div>
                                    <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                                        Choose a role aligned with platform permissions.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                                        Account Status
                                    </label>
                                    <div className="mt-2 rounded-2xl border px-3 h-12 flex items-center" style={shellStyle}>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full text-sm capitalize rounded-xl px-3 py-2 border outline-none appearance-none cursor-pointer"
                                            style={{
                                                color: "var(--text)",
                                                backgroundColor: "var(--surface)",
                                                borderColor: "var(--border)",
                                            }}
                                        >
                                            <option
                                                value="active"
                                                style={{ background: "var(--surface)", color: "var(--text)" }}
                                            >
                                                Active
                                            </option>

                                            <option
                                                value="suspended"
                                                style={{ background: "var(--surface)", color: "var(--text)" }}
                                            >
                                                Suspend
                                            </option>
                                        </select>
                                    </div>
                                    <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                                        If selecting <b>suspended</b>, you’ll be asked for a reason & feedback.
                                    </p>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--border)" }}>
                                <div className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                                    Changes:{" "}
                                    <span className="font-semibold" style={{ color: "var(--text)" }}>
                                        {isChanged ? "Pending" : "None"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={closeModal}
                                        className="h-11 px-4 rounded-2xl text-sm font-semibold border"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
                                            color: "var(--text)",
                                        }}
                                    >
                                        Cancel
                                    </Motion.button>

                                    <Motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleUpdate}
                                        disabled={!isChanged}
                                        className="h-11 px-4 rounded-2xl text-sm font-semibold border disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            borderColor: "color-mix(in oklab, var(--primary) 22%, var(--border))",
                                            background:
                                                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, transparent), color-mix(in oklab, var(--secondary) 18%, transparent))",
                                            color: "var(--text)",
                                        }}
                                    >
                                        Save Changes
                                    </Motion.button>
                                </div>
                            </div>
                        </Motion.div>
                    </Motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsers;
