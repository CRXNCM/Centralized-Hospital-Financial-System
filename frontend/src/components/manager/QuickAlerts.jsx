export default function QuickAlerts({ alerts, onDismiss }) {
  if (alerts.length === 0) {
    return (
      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Quick Alerts</h2>
        <p className="mt-4 text-sm text-[#94A3B8]">No flagged transactions. All clear.</p>
      </section>
    );
  }

  return (
    <section className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Quick Alerts</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Transactions requiring attention</p>
        </div>
        <span className="rounded-full bg-[#F43F5E] px-2.5 py-0.5 text-xs font-bold text-white">
          {alerts.length}
        </span>
      </div>

      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`flex gap-3 rounded-xl border px-4 py-3 ${
              alert.severity === "error"
                ? "border-[rgba(244,63,94,0.35)] bg-[rgba(244,63,94,0.08)]"
                : "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.08)]"
            }`}
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                alert.severity === "error" ? "bg-[#F43F5E]" : "pulse-dot bg-[#F59E0B]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{alert.title}</p>
              <p className="mt-0.5 text-sm text-[#94A3B8]">{alert.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(alert.id)}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-[#94A3B8] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
              aria-label="Dismiss alert"
            >
              Dismiss
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
