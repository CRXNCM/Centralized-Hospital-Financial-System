import { IconAlert, IconCheck, IconPayment, IconUsers } from "../icons";
import { ADMIN_HEALTH_STATS } from "../../data/adminMockData";

const cards = [
  {
    id: "users",
    label: "Total Users Active",
    value: String(ADMIN_HEALTH_STATS.activeUsers),
    glow: "admin-glow-emerald",
    valueClass: "text-white",
    icon: IconUsers,
    iconClass: "text-[#10B981]",
    extra: (
      <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
    ),
  },
  {
    id: "uptime",
    label: "System Uptime",
    value: ADMIN_HEALTH_STATS.uptime,
    glow: "admin-glow-emerald",
    valueClass: "text-[#10B981]",
    icon: IconCheck,
    iconClass: "text-[#10B981]",
  },
  {
    id: "transactions",
    label: "Today's Transactions",
    value: String(ADMIN_HEALTH_STATS.todayTransactions),
    glow: "admin-glow-cyan",
    valueClass: "text-[#22D3EE]",
    icon: IconPayment,
    iconClass: "text-[#22D3EE]",
  },
  {
    id: "failed",
    label: "Failed Transactions",
    value: String(ADMIN_HEALTH_STATS.failedTransactions),
    glow: "admin-glow-rose",
    valueClass: "text-[#F43F5E]",
    icon: IconAlert,
    iconClass: "text-[#F43F5E]",
    showAlert: true,
  },
];

export default function AdminHealthCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.id}
            className={`glass-card admin-health-card p-5 ${card.glow}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#94A3B8]">{card.label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className={`text-2xl font-bold tabular-nums ${card.valueClass}`}>
                    {card.value}
                  </p>
                  {card.extra}
                  {card.showAlert && (
                    <IconAlert className="h-5 w-5 shrink-0 text-[#F43F5E]" aria-hidden />
                  )}
                </div>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(5,13,26,0.5)] ${card.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}


