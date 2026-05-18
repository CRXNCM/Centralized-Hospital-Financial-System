import StatusBadge from "./StatusBadge";

function timelineBorderClass(status) {
  const s = status.toLowerCase();
  if (s === "pending") return "timeline-border-pending";
  if (s === "failed") return "timeline-border-failed";
  return "timeline-border-paid";
}

export default function PaymentTimeline({ payments }) {
  if (!payments?.length) {
    return (
      <section className="glass-card p-6">
        <h3 className="font-semibold text-white">Payment Timeline</h3>
        <p className="mt-4 text-sm text-[#94A3B8]">No payment records found.</p>
      </section>
    );
  }

  return (
    <section className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white">Payment Timeline</h3>
      <p className="mt-1 text-sm text-[#94A3B8]">
        {payments.length} payment{payments.length !== 1 ? "s" : ""} · newest first
      </p>

      <ol className="mt-6 space-y-3">
        {payments.map((entry) => (
          <li
            key={entry.id}
            className={`rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.35)] px-4 py-4 pl-5 ${timelineBorderClass(entry.status)}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{entry.date}</p>
                <p className="mt-0.5 text-[#94A3B8]">{entry.time}</p>
              </div>
              <StatusBadge status={entry.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-white">{entry.service}</p>
                <p className="text-sm text-[#94A3B8]">{entry.method}</p>
              </div>
              <p className="text-lg font-bold text-[#22D3EE]">{entry.amount}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
