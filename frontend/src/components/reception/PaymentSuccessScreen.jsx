import { IconCheckCircle } from "../icons";
import { formatEtb } from "../../data/receptionBills";
import { getPaymentMethodIcon } from "./paymentMethodIcon";

function DetailRow({ label, children, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[rgba(34,211,238,0.08)] py-3 last:border-0">
      <span className="text-sm text-[#94A3B8]">{label}</span>
      <span
        className={`text-right text-sm font-medium ${highlight ? "font-semibold text-[#10B981]" : "text-white"}`}
      >
        {children}
      </span>
    </div>
  );
}

export default function PaymentSuccessScreen({
  payment,
  record,
  onNewPayment,
  onViewToday,
}) {
  const MethodIcon = getPaymentMethodIcon(payment.methodId);
  const transactionId = record?.transactionId ?? "—";
  const timestamp = record?.timestamp ?? record?.time ?? "—";

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="payment-success rounded-2xl px-6 py-10 text-center sm:px-10">
        <div className="success-check-glow mx-auto flex h-24 w-24 items-center justify-center rounded-full">
          <IconCheckCircle className="success-check-pop h-16 w-16 text-[#10B981]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Payment Recorded Successfully</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">Transaction has been saved and verified</p>
      </div>

      <article className="glass-card p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
          Transaction details
        </p>
        <div>
          <DetailRow label="Transaction ID">
            <span className="font-mono text-[#22D3EE]">{transactionId}</span>
          </DetailRow>
          <DetailRow label="Patient name">{payment.bill.patientName}</DetailRow>
          <DetailRow label="Amount recorded" highlight>
            {formatEtb(payment.amount)}
          </DetailRow>
          <DetailRow label="Payment method">
            <span className="inline-flex items-center justify-end gap-2">
              <MethodIcon className="h-4 w-4 text-[#22D3EE]" />
              {payment.method}
            </span>
          </DetailRow>
          <DetailRow label="Timestamp">{timestamp}</DetailRow>
        </div>
      </article>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onNewPayment}
          className="btn-confirm-active w-full rounded-xl py-4 text-sm font-bold"
        >
          Record Another Payment
        </button>
        <button
          type="button"
          onClick={onViewToday}
          className="w-full rounded-xl border-2 border-[rgba(34,211,238,0.35)] bg-transparent py-3.5 text-sm font-semibold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.08)]"
        >
          View Today&apos;s Payments
        </button>
      </div>
    </div>
  );
}
