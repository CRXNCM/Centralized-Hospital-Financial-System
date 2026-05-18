import { ROLE_LIST } from "../config/roles";
import { IconHospital, IconManager, IconReception, IconShield } from "./icons";

const roleIcons = {
  manager: IconManager,
  reception: IconReception,
  admin: IconShield,
};

const roleDescriptions = {
  manager:
    "View revenue analytics, financial reports, and hospital-wide transaction summaries.",
  reception:
    "Record patient payments, manage today's desk queue, and view payment history.",
  admin:
    "Configure hospital settings, manage users, and control system-wide options.",
};

export default function RolePortal({ onSelectRole }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#050D1A] to-[#0A1628] px-6 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(34,211,238,0.12)] text-[#22D3EE] shadow-[0_0_24px_rgba(34,211,238,0.25)]">
          <IconHospital className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Central City Hospital</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">
          Select your portal to access your dedicated system
        </p>
        <p className="mt-1 text-xs font-medium text-[#22D3EE]">Powered by AbaderTech System</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
        {ROLE_LIST.map((role) => {
          const Icon = roleIcons[role.id];
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className="glass-card group flex flex-col p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(34,211,238,0.12)] text-[#22D3EE] transition-colors group-hover:bg-[rgba(34,211,238,0.2)]">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">{role.portalTitle}</h2>
              <p className="mt-1 text-xs font-medium text-[#22D3EE]">{role.badge}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#94A3B8]">
                {roleDescriptions[role.id]}
              </p>
              <span className="mt-5 text-sm font-semibold text-[#22D3EE] group-hover:underline">
                Enter portal →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
