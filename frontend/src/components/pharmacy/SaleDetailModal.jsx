import { formatEtb } from "../../data/pharmacySaleStore";
import { getPaymentMethodIcon } from "../reception/paymentMethodIcon";

export default function SaleDetailModal({ sale, onClose }) {
  if (!sale) return null;

  const PaymentIcon = getPaymentMethodIcon(sale.methodId ?? sale.paymentTypeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="modal-panel relative z-10 w-full max-w-md rounded-2xl border border-[rgba(34,211,238,0.2)] bg-gradient-to-b from-[#112240] to-[#0A1628] shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-white">Pharmacy Sale</h3>
            <p className="mt-1 font-mono text-sm text-[#22D3EE]">{sale.saleId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[rgba(34,211,238,0.1)] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[rgba(16,185,129,0.15)] px-2.5 py-0.5 text-xs font-semibold text-[#10B981]">
              Completed
            </span>
            <span className="text-xl font-bold text-[#10B981]">{formatEtb(sale.amount)}</span>
          </div>

          <dl className="space-y-3">
            {[
              ["Amount paid", formatEtb(sale.amount)],
              [
                "Payment method",
                <span key="type" className="inline-flex items-center gap-2">
                  <PaymentIcon className="h-4 w-4 text-[#22D3EE]" />
                  {sale.method ?? sale.paymentType}
                </span>,
              ],
              ["Time recorded", sale.timestamp ?? sale.time],
              ["Recorded by", sale.recordedBy],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-[rgba(34,211,238,0.08)] py-3 last:border-0"
              >
                <dt className="text-sm text-[#94A3B8]">{label}</dt>
                <dd className="text-right text-sm font-medium text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-[rgba(34,211,238,0.1)] px-6 py-5">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full rounded-xl border-2 border-[#22D3EE] bg-transparent py-3 text-sm font-bold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.1)]"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
