import StatusBadge from "./StatusBadge";

export default function TransactionDrawer({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="drawer-panel fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[rgba(34,211,238,0.15)] bg-gradient-to-b from-[#0A1628] to-[#050D1A] shadow-[-8px_0_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
              Transaction Detail
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">{transaction.id}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[rgba(34,211,238,0.1)] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <StatusBadge status={transaction.status} />
            <span className="text-2xl font-bold text-[#22D3EE]">{transaction.amount}</span>
          </div>

          <dl className="space-y-4">
            {[
              ["Patient", transaction.patient],
              ["Service", transaction.service],
              ["Payment Method", transaction.method],
              ["Date", transaction.date],
              ["Time", transaction.time],
              ["Reference", transaction.reference],
              ["Recorded By", transaction.recordedBy],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(17,34,64,0.4)] px-4 py-3"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                  {label}
                </dt>
                <dd className="mt-1 font-medium text-white">{val}</dd>
              </div>
            ))}
            <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(17,34,64,0.4)] px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                Notes
              </dt>
              <dd className="mt-1 text-sm text-[#94A3B8]">{transaction.notes}</dd>
            </div>
          </dl>
        </div>

        {transaction.status === "Pending" && (
          <div className="border-t border-[rgba(34,211,238,0.1)] p-6">
            <button
              type="button"
              className="w-full rounded-xl bg-[#10B981] py-3 text-sm font-bold text-white hover:bg-[#34D399]"
            >
              Approve Verification
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
