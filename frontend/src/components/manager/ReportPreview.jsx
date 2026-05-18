export default function ReportPreview({ report }) {
  if (!report) return null;

  return (
    <section className="glass-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(34,211,238,0.1)] pb-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Report Preview</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {report.periodLabel} · {report.dateFrom} to {report.dateTo}
          </p>
        </div>
        <p className="text-xs text-[#94A3B8]">Generated {report.generatedAt}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(34,211,238,0.08)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Total Revenue
          </p>
          <p className="mt-2 text-3xl font-bold text-[#22D3EE]">{report.totalRevenueLabel}</p>
        </div>
        <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.4)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Transactions
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{report.transactionCount}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">By Payment Method</h3>
          <ul className="space-y-2">
            {report.byMethod.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between rounded-lg border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.35)] px-4 py-2.5"
              >
                <span className="text-white">{row.name}</span>
                <span className="font-semibold text-[#22D3EE]">{row.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">By Service Type</h3>
          <ul className="space-y-2">
            {report.byService.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between rounded-lg border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.35)] px-4 py-2.5"
              >
                <span className="text-white">{row.name}</span>
                <span className="font-semibold text-[#22D3EE]">{row.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Flagged & Pending ({report.flagged.length})
        </h3>
        {report.flagged.length === 0 ? (
          <p className="rounded-lg border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.08)] px-4 py-3 text-sm text-[#10B981]">
            No flagged or pending transactions in this period.
          </p>
        ) : (
          <ul className="space-y-2">
            {report.flagged.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.06)] px-4 py-2.5"
              >
                <div>
                  <p className="font-medium text-white">{item.patient}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {item.service} · {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#22D3EE]">{item.amount}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.status === "Failed" ? "badge-failed" : "badge-pending"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
