import { useEffect, useState } from "react";
import centralLogo from "../../assets/central_logo.png";
import {
  IconBarChart,
  IconCheck,
  IconPayment,
  IconPharmacy,
  IconShield,
} from "../icons";

const PORTAL_ROLES = [
  {
    id: "manager",
    title: "Manager",
    portal: "Manager Portal",
    description: "Financial overview, analytics, and hospital-wide reporting",
    highlights: ["Revenue dashboard", "Reports & analytics", "Transaction history"],
    icon: IconBarChart,
    accent: "#22D3EE",
    accentRgb: "34, 211, 238",
    badge: "Finance",
  },
  {
    id: "reception",
    title: "Receptionist",
    portal: "Reception Portal",
    description: "Record patient payments and manage front desk billing",
    highlights: ["Record payments", "Today's payments", "Patient history"],
    icon: IconPayment,
    accent: "#10B981",
    accentRgb: "16, 185, 129",
    badge: "Front Desk",
  },
  {
    id: "pharmacy",
    title: "Pharmacy Reception",
    portal: "Pharmacy Portal",
    description: "Create medicine sales and track pharmacy transactions",
    highlights: ["Create sales", "Payment collection", "Sales records"],
    icon: IconPharmacy,
    accent: "#8B5CF6",
    accentRgb: "139, 92, 246",
    badge: "Pharmacy Desk",
  },
  {
    id: "admin",
    title: "System Admin",
    portal: "Admin Portal",
    description: "System settings, users, logs, backups, and alerts",
    highlights: ["User management", "Payment settings", "System logs"],
    icon: IconShield,
    accent: "#F59E0B",
    accentRgb: "245, 158, 11",
    badge: "Control Center",
  },
];

export default function LoginModal({ open, onClose, onSelectRole }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSelect(roleId) {
    onSelectRole(roleId);
    onClose();
  }

  const activeId = hoveredId ?? focusedId;

  return (
    <div className="role-select-overlay fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(2,8,20,0.82)] backdrop-blur-md"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        className="role-select-panel relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[rgba(34,211,238,0.2)] bg-[#0A1628] shadow-[0_0_60px_rgba(34,211,238,0.15)] lg:max-h-[min(720px,92vh)] lg:flex-row"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-select-title"
      >
        <aside className="relative shrink-0 border-b border-[rgba(34,211,238,0.1)] bg-[linear-gradient(160deg,rgba(17,34,64,0.95)_0%,rgba(5,13,26,0.98)_100%)] px-6 py-8 sm:px-8 lg:w-[340px] lg:border-b-0 lg:border-r">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(34,211,238,0.18) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[rgba(34,211,238,0.1)] hover:text-white lg:hidden"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.08)] shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <img src={centralLogo} alt="" className="h-11 w-11 object-contain" />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
              Secure access
            </p>
            <h2 id="role-select-title" className="mt-2 text-2xl font-bold leading-tight text-white">
              Select your role
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
              Choose the portal that matches your job. Each role sees only the tools and data
              they need.
            </p>

            <ul className="mt-6 space-y-2.5">
              {["Role-based dashboards", "Encrypted sessions", "Full audit trail"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#CBD5E1]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(16,185,129,0.15)]">
                    <IconCheck className="h-3 w-3 text-[#10B981]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 hidden text-xs leading-relaxed text-[#64748B] lg:block">
              Demo mode — select any role to explore the system without credentials.
            </p>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[rgba(34,211,238,0.08)] px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-white">Available portals</p>
              <p className="text-xs text-[#64748B]">4 roles · Central City Hospital</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[rgba(34,211,238,0.1)] hover:text-white lg:flex"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="role-select-list flex-1 overflow-y-auto p-4 sm:p-5">
            <ul className="space-y-3">
              {PORTAL_ROLES.map((role) => {
                const Icon = role.icon;
                const isActive = activeId === role.id;

                return (
                  <li key={role.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(role.id)}
                      onMouseEnter={() => setHoveredId(role.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setFocusedId(role.id)}
                      onBlur={() => setFocusedId(null)}
                      className="role-select-card group relative flex w-full gap-4 rounded-xl border p-4 text-left transition-all duration-200 sm:gap-5 sm:p-5"
                      style={{
                        borderColor: isActive
                          ? `rgba(${role.accentRgb}, 0.45)`
                          : "rgba(34, 211, 238, 0.12)",
                        background: isActive
                          ? `rgba(${role.accentRgb}, 0.08)`
                          : "rgba(5, 13, 26, 0.55)",
                        boxShadow: isActive
                          ? `0 0 28px rgba(${role.accentRgb}, 0.18)`
                          : "none",
                      }}
                    >
                      <span
                        className="absolute left-0 top-1/2 h-10 w-[3px] -translate-y-1/2 rounded-r-full transition-opacity duration-200"
                        style={{
                          backgroundColor: role.accent,
                          opacity: isActive ? 1 : 0,
                        }}
                        aria-hidden
                      />

                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
                        style={{ background: `rgba(${role.accentRgb}, 0.14)` }}
                      >
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: role.accent }} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white sm:text-lg">{role.title}</h3>
                          <span
                            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                            style={{
                              color: role.accent,
                              background: `rgba(${role.accentRgb}, 0.15)`,
                            }}
                          >
                            {role.badge}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-[#64748B] sm:text-sm">
                          {role.portal}
                        </p>
                        <p className="mt-2 hidden text-sm leading-relaxed text-[#94A3B8] sm:block">
                          {role.description}
                        </p>
                        <ul className="mt-3 hidden flex-wrap gap-2 sm:flex">
                          {role.highlights.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-lg border border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.5)] px-2.5 py-1 text-[11px] font-medium text-[#CBD5E1]"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex shrink-0 flex-col items-end justify-center gap-1">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 sm:h-10 sm:w-10"
                          style={{
                            borderColor: isActive
                              ? `rgba(${role.accentRgb}, 0.5)`
                              : "rgba(34, 211, 238, 0.15)",
                            color: isActive ? role.accent : "#64748B",
                            background: isActive ? `rgba(${role.accentRgb}, 0.12)` : "transparent",
                          }}
                        >
                          →
                        </span>
                        <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-[#64748B] sm:block">
                          Enter
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <footer className="border-t border-[rgba(34,211,238,0.08)] px-5 py-3 text-center text-xs text-[#64748B] sm:px-6 lg:hidden">
            Demo mode — no password required
          </footer>
        </div>
      </div>
    </div>
  );
}
