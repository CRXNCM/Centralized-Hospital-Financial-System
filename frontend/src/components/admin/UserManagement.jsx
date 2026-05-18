import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CURRENT_ADMIN_ID,
  ROLE_COLORS,
  ROLE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  createInitialUsers,
} from "../../data/adminUsers";
import { IconEdit, IconKey, IconSearch, IconUserOff } from "../icons";
import AdminToast from "./AdminToast";
import StatusToggle from "./StatusToggle";
import UserFormModal from "./UserFormModal";

const TABLE_COLUMNS = [
  "Name",
  "Role",
  "Email",
  "Phone",
  "Status",
  "Last Login",
  "Actions",
];

function matchesRoleFilter(user, roleFilter) {
  if (roleFilter === "all") return true;
  if (roleFilter === "System Admin") return user.role === "System Admin";
  return user.role === roleFilter;
}

function matchesStatusFilter(user, statusFilter) {
  if (statusFilter === "all") return true;
  return user.status === statusFilter;
}

export default function UserManagement() {
  const [users, setUsers] = useState(createInitialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      return (
        matchesSearch &&
        matchesRoleFilter(user, roleFilter) &&
        matchesStatusFilter(user, statusFilter)
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  function handleStatusToggle(userId, active) {
    if (userId === CURRENT_ADMIN_ID && !active) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: active ? "Active" : "Inactive" } : u,
      ),
    );
  }

  function handleDeactivate(user) {
    if (user.id === CURRENT_ADMIN_ID) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u,
      ),
    );
    showToast(
      user.status === "Active"
        ? `${user.name} has been deactivated`
        : `${user.name} has been reactivated`,
    );
  }

  function handleResetPassword(user) {
    showToast(`Password reset link sent to ${user.email}`);
  }

  function handleSave(formData) {
    if (modal?.mode === "add") {
      const newUser = {
        id: `user-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        status: "Active",
        lastLogin: "Never",
      };
      setUsers((prev) => [...prev, newUser]);
      setModal(null);
      showToast("User created successfully");
      return;
    }

    if (modal?.mode === "edit" && modal.user) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === modal.user.id
            ? {
                ...u,
                name: formData.name,
                role: u.id === CURRENT_ADMIN_ID ? u.role : formData.role,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
              }
            : u,
        ),
      );
      setModal(null);
      showToast("User updated successfully");
    }
  }

  return (
    <div className="space-y-6 p-8">
      <section className="glass-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">User Management</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Manage hospital staff accounts and portal access
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: "add" })}
            className="btn-landing-cyan shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
          >
            Add New User
          </button>
        </div>

        <div className="flex flex-col gap-4 border-b border-[rgba(34,211,238,0.08)] px-6 py-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#22D3EE]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
              aria-label="Filter by role"
            >
              {ROLE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
              aria-label="Filter by status"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length} className="px-6 py-12 text-center text-[#64748B]">
                    No users match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdminSelf = user.id === CURRENT_ADMIN_ID;
                  const isActive = user.status === "Active";
                  return (
                    <tr
                      key={user.id}
                      className="table-row-hover border-b border-[rgba(34,211,238,0.06)]"
                    >
                      <td className="px-5 py-4 font-medium text-white">{user.name}</td>
                      <td
                        className={`px-5 py-4 font-semibold ${ROLE_COLORS[user.role] ?? "text-white"}`}
                      >
                        {user.role}
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8]">{user.email}</td>
                      <td className="px-5 py-4 text-[#94A3B8]">{user.phone}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <StatusToggle
                            active={isActive}
                            onChange={(on) => handleStatusToggle(user.id, on)}
                            disabled={isAdminSelf && isActive}
                          />
                          <span
                            className={`text-xs font-semibold ${isActive ? "text-[#10B981]" : "text-[#94A3B8]"}`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8]">{user.lastLogin}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setModal({ mode: "edit", user })}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[rgba(34,211,238,0.1)] hover:text-[#22D3EE]"
                            aria-label={`Edit ${user.name}`}
                          >
                            <IconEdit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeactivate(user)}
                            disabled={isAdminSelf}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[rgba(244,63,94,0.12)] hover:text-[#F43F5E] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Deactivate ${user.name}`}
                          >
                            <IconUserOff className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(user)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[rgba(34,211,238,0.1)] hover:text-[#22D3EE]"
                            aria-label={`Reset password for ${user.name}`}
                          >
                            <IconKey className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <UserFormModal
        open={Boolean(modal)}
        mode={modal?.mode ?? "add"}
        user={modal?.user}
        onClose={() => setModal(null)}
        onSave={handleSave}
      />

      <AdminToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

