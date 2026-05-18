import { formatEtb } from "../../data/receptionBills";
import { getPaymentMethodIcon } from "./paymentMethodIcon";
import PaymentStatusBadge, { getPaymentDisplayStatus } from "./PaymentStatusBadge";

export default function PaymentDetailModal({ payment, onClose }) {
  if (!payment) return null;

  const MethodIcon = getPaymentMethodIcon(payment.methodId);
  const displayStatus = getPaymentDisplayStatus(payment);

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
            <h3 className="text-xl font-bold text-white">{payment.patientName}</h3>
            <p className="mt-1 font-mono text-sm text-[#22D3EE]">{payment.billId}</p>
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
            <PaymentStatusBadge status={displayStatus} />
            <span className="text-xl font-bold text-[#10B981]">{formatEtb(payment.amount)}</span>
          </div>

          <dl className="space-y-3">
            {[
              ["Service received", payment.service],
              ["Amount paid", formatEtb(payment.amount)],
              [
                "Payment method",
                <span key="method" className="inline-flex items-center gap-2">
                  <MethodIcon className="h-4 w-4 text-[#22D3EE]" />
                  {payment.method}
                </span>,
              ],
              ["Time recorded", payment.timestamp ?? payment.time],
              ["Transaction ID", payment.transactionId],
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
