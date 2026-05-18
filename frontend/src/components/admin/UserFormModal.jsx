import { useEffect, useState } from "react";
import { CURRENT_ADMIN_ID, USER_ROLES } from "../../data/adminUsers";
import { IconEye, IconEyeOff } from "../icons";
import StatusToggle from "./StatusToggle";

const EMPTY_FORM = {
  name: "",
  role: "Receptionist",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  status: "Active",
};

function validateForm(form, isEdit) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!name) errors.name = "Full name is required";
  if (!form.role) errors.role = "Role is required";
  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  if (!phone) errors.phone = "Phone number is required";
  else if (phone.replace(/\D/g, "").length < 9) errors.phone = "Enter a valid phone number";

  const needsPassword = !isEdit;
  const hasPassword = form.password.length > 0;

  if (needsPassword || hasPassword) {
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}

export default function UserFormModal({
  open,
  mode,
  user,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isEdit = mode === "edit";
  const isSelf = isEdit && user?.id === CURRENT_ADMIN_ID;
  const title = isEdit ? "Edit User" : "Add New User";

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
    if (isEdit && user) {
      setForm({
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        password: "",
        confirmPassword: "",
        status: user.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, isEdit, user]);

  if (!open) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateForm(form, isEdit);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave({
      name: form.name.trim(),
      role: form.role,
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
      password: form.password || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="login-modal-panel relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[rgba(34,211,238,0.25)] bg-[#112240]/95 p-6 shadow-[0_0_48px_rgba(34,211,238,0.2)] backdrop-blur-xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[rgba(34,211,238,0.1)] hover:text-white"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 id="user-form-title" className="pr-10 text-xl font-bold text-white">
          {title}
        </h2>
        {isSelf && (
          <p className="mt-2 text-xs text-[#F59E0B]">
            You cannot change your own admin role.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="user-name" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              Full Name
            </label>
            <input
              id="user-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-4 py-3 text-white outline-none focus:border-[#22D3EE]"
              autoComplete="name"
            />
            {errors.name && <p className="mt-1 text-xs text-[#F43F5E]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="user-role" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              Role
            </label>
            <select
              id="user-role"
              value={form.role}
              disabled={isSelf}
              onChange={(e) => updateField("role", e.target.value)}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-4 py-3 text-white outline-none focus:border-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {USER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-[#F43F5E]">{errors.role}</p>}
          </div>

          <div>
            <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-4 py-3 text-white outline-none focus:border-[#22D3EE]"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-[#F43F5E]">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="user-phone" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              Phone Number
            </label>
            <input
              id="user-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-4 py-3 text-white outline-none focus:border-[#22D3EE]"
              autoComplete="tel"
            />
            {errors.phone && <p className="mt-1 text-xs text-[#F43F5E]">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              Password{isEdit ? " (leave blank to keep current)" : ""}
            </label>
            <div className="relative">
              <input
                id="user-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] py-3 pl-4 pr-12 text-white outline-none focus:border-[#22D3EE]"
                autoComplete={isEdit ? "new-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-[#F43F5E]">{errors.password}</p>}
          </div>

          <div>
            <label
              htmlFor="user-confirm-password"
              className="mb-1.5 block text-sm font-medium text-[#94A3B8]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="user-confirm-password"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] py-3 pl-4 pr-12 text-white outline-none focus:border-[#22D3EE]"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-[#F43F5E]">{errors.confirmPassword}</p>
            )}
          </div>

          {isEdit && (
            <div className="flex items-center justify-between rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.4)] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Status</p>
                <p className="text-xs text-[#94A3B8]">
                  {form.status === "Active" ? "Active" : "Inactive"}
                </p>
              </div>
              <StatusToggle
                active={form.status === "Active"}
                onChange={(on) => updateField("status", on ? "Active" : "Inactive")}
                disabled={isSelf}
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-[rgba(34,211,238,0.35)] px-6 py-3 text-sm font-semibold text-[#22D3EE] hover:bg-[rgba(34,211,238,0.08)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-landing-cyan rounded-xl px-6 py-3 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


