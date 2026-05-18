import { useState } from "react";
import { IconDatabase, IconMobilePay, IconRefresh, IconWallet } from "../icons";
import { ADMIN_SERVICES } from "../../data/adminMockData";

const SERVICE_ICONS = {
  telebirr: IconMobilePay,
  "cbe-birr": IconWallet,
  amole: IconWallet,
  database: IconDatabase,
  backup: IconDatabase,
};

const STATUS_CONFIG = {
  online: {
    label: "Online",
    dotClass: "bg-[#10B981] shadow-[0_0_8px_#10B981]",
    textClass: "text-[#10B981]",
  },
  warning: {
    label: "Warning",
    dotClass: "bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]",
    textClass: "text-[#F59E0B]",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]",
    textClass: "text-[#F43F5E]",
  },
};

export default function AdminSystemStatus() {
  const [refreshingId, setRefreshingId] = useState(null);

  function handleRefresh(serviceId) {
    setRefreshingId(serviceId);
    setTimeout(() => setRefreshingId(null), 900);
  }

  return (
    <section className="glass-card p-6">
      <header className="mb-5">
        <h2 className="font-semibold text-white">System Status</h2>
        <p className="mt-0.5 text-sm text-[#94A3B8]">Connected services &amp; infrastructure</p>
      </header>

      <ul className="space-y-3">
        {ADMIN_SERVICES.map((service) => {
          const Icon = SERVICE_ICONS[service.id] ?? IconDatabase;
          const status = STATUS_CONFIG[service.status] ?? STATUS_CONFIG.online;
          const isRefreshing = refreshingId === service.id;

          return (
            <li
              key={service.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)] px-4 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(34,211,238,0.08)] text-[#22D3EE]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white">{service.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
                    <span className={`text-xs font-semibold ${status.textClass}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRefresh(service.id)}
                disabled={isRefreshing}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(34,211,238,0.2)] text-[#94A3B8] transition-colors hover:border-[#22D3EE] hover:text-[#22D3EE] disabled:opacity-50"
                aria-label={`Refresh ${service.name}`}
              >
                <IconRefresh
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#22D3EE]" : ""}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

