import {
  IconBarChart,
  IconPayment,
  IconShield,
} from "../icons";

const ROLES = [
  {
    id: "manager",
    title: "Manager",
    description: "Financial overview and analytics",
    icon: IconBarChart,
    iconClass: "text-[#22D3EE]",
    iconBg: "bg-[rgba(34,211,238,0.12)]",
    buttonClass: "btn-landing-cyan",
    hoverGlow: "hover:shadow-[0_0_32px_rgba(34,211,238,0.35)]",
  },
  {
    id: "reception",
    title: "Receptionist",
    description: "Record and confirm patient payments",
    icon: IconPayment,
    iconClass: "text-[#10B981]",
    iconBg: "bg-[rgba(16,185,129,0.12)]",
    buttonClass: "btn-landing-emerald",
    hoverGlow: "hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]",
  },
  {
    id: "admin",
    title: "System Admin",
    description: "Advanced system settings and control",
    icon: IconShield,
    iconClass: "text-[#F59E0B]",
    iconBg: "bg-[rgba(245,158,11,0.12)]",
    buttonClass: "btn-landing-amber",
    hoverGlow: "hover:shadow-[0_0_32px_rgba(245,158,11,0.35)]",
  },
];

export default function LoginModal({ open, onClose, onSelectRole }) {
  if (!open) return null;

  function handleSelect(roleId) {
    onSelectRole(roleId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="login-modal-panel relative z-10 w-full max-w-4xl rounded-2xl border border-[rgba(34,211,238,0.25)] bg-[#112240]/95 p-6 shadow-[0_0_48px_rgba(34,211,238,0.2)] backdrop-blur-xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[rgba(34,211,238,0.1)] hover:text-white"
          aria-label="Close modal"
        >
          ✕
        </button>

        <header className="mb-8 pr-10 text-center sm:text-left">
          <h2 id="login-modal-title" className="text-2xl font-bold text-white">
            Select Your Role
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Choose your access level to continue
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <article
                key={role.id}
                className={`landing-role-card rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] p-5 transition-all duration-300 ${role.hoverGlow}`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${role.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${role.iconClass}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                  {role.description}
                </p>
                <button
                  type="button"
                  onClick={() => handleSelect(role.id)}
                  className={`mt-5 w-full rounded-xl py-3 text-sm font-bold text-white transition-all ${role.buttonClass}`}
                >
                  Login as {role.title}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
