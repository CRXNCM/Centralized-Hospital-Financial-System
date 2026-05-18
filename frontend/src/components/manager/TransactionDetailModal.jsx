import StatusBadge from "./StatusBadge";

export default function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="modal-panel relative z-10 w-full max-w-lg rounded-2xl border border-[rgba(34,211,238,0.2)] bg-gradient-to-b from-[#112240] to-[#0A1628] shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
              Transaction Breakdown
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">{transaction.billId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[rgba(34,211,238,0.1)] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-center justify-between">
            <StatusBadge status={transaction.status} />
            <span className="text-xl font-bold text-[#22D3EE]">{transaction.amount}</span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Patient Name", transaction.patient],
              ["Patient ID", transaction.patientId],
              ["Service Received", transaction.service],
              ["Bill Amount", transaction.billAmountLabel],
              ["Amount Paid", transaction.amountPaidLabel],
              ["Payment Method", transaction.method],
              ["Date", transaction.date],
              ["Exact Time", transaction.time],
              ["Verified By", transaction.verifiedBy],
              ["Transaction Reference", transaction.reference],
              ["Recorded By", transaction.recordedBy],
            ].map(([label, val]) => (
              <div
                key={label}
                className={`rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.5)] px-4 py-3 ${
                  label === "Transaction Reference" ? "sm:col-span-2" : ""
                }`}
              >
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">{val}</dd>
              </div>
            ))}
          </dl>

          {transaction.notes && (
            <p className="mt-4 rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.4)] px-4 py-3 text-sm text-[#94A3B8]">
              {transaction.notes}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-[rgba(34,211,238,0.1)] px-6 py-5">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-xl border-2 border-[#22D3EE] bg-transparent py-3 text-sm font-bold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.1)]"
          >
            Print Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[rgba(34,211,238,0.2)] px-6 py-3 text-sm font-medium text-[#94A3B8] hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
