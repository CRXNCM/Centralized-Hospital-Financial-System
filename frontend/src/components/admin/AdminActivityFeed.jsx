import {
  IconAlert,
  IconPayment,
  IconReport,
  IconUserPlus,
} from "../icons";
import { ADMIN_ACTIVITY_EVENTS } from "../../data/adminMockData";

const EVENT_STYLES = {
  normal: {
    border: "border-[rgba(34,211,238,0.15)]",
    iconBg: "bg-[rgba(34,211,238,0.12)]",
    iconClass: "text-[#22D3EE]",
  },
  warning: {
    border: "border-[rgba(245,158,11,0.25)]",
    iconBg: "bg-[rgba(245,158,11,0.12)]",
    iconClass: "text-[#F59E0B]",
  },
  error: {
    border: "border-[rgba(244,63,94,0.25)]",
    iconBg: "bg-[rgba(244,63,94,0.12)]",
    iconClass: "text-[#F43F5E]",
  },
};

const EVENT_ICONS = {
  payment: IconPayment,
  report: IconReport,
  alert: IconAlert,
  user: IconUserPlus,
};

function ActivityRow({ event }) {
  const style = EVENT_STYLES[event.type] ?? EVENT_STYLES.normal;
  const Icon = EVENT_ICONS[event.icon] ?? IconPayment;

  return (
    <li
      className={`flex items-start gap-3 rounded-xl border bg-[rgba(5,13,26,0.45)] px-4 py-3 ${style.border}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
      >
        <Icon className={`h-4 w-4 ${style.iconClass}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white">{event.message}</p>
        <p className="mt-0.5 text-xs text-[#64748B]">{event.time}</p>
      </div>
    </li>
  );
}

export default function AdminActivityFeed() {
  const items = [...ADMIN_ACTIVITY_EVENTS, ...ADMIN_ACTIVITY_EVENTS];

  return (
    <section className="glass-card flex h-full min-h-[420px] flex-col overflow-hidden">
      <header className="border-b border-[rgba(34,211,238,0.1)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <p className="mt-0.5 text-xs text-[#94A3B8]">Live system events</p>
          </div>
          <span className="flex items-center gap-2 text-xs font-medium text-[#10B981]">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#10B981]" />
            Live
          </span>
        </div>
      </header>

      <div className="admin-activity-scroll relative flex-1 overflow-hidden">
        <ul className="admin-activity-track space-y-3 px-4 py-4">
          {items.map((event, index) => (
            <ActivityRow key={`${event.id}-${index}`} event={event} />
          ))}
        </ul>
      </div>
    </section>
  );
}
