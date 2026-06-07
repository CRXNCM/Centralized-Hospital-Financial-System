import { useState } from "react";
import { formatEtb } from "../../data/pharmacySaleStore";
import { getPaymentMethodIcon } from "../reception/paymentMethodIcon";

function ConfirmSpinner() {
  return (
    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function SummaryRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[rgba(34,211,238,0.08)] py-3.5 last:border-0">
      <span className="text-sm text-[#94A3B8]">{label}</span>
      <div className="text-right font-medium text-white">{children}</div>
    </div>
  );
}

export default function SaleConfirmScreen({ sale, onBack, onComplete }) {
  const [loading, setLoading] = useState(false);
  const PaymentIcon = getPaymentMethodIcon(sale.methodId ?? sale.paymentTypeId);

  async function handleConfirm() {
    if (loading) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onComplete();
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <header className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white">Confirm Sale Details</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Please review before saving</p>
      </header>

      <article className="glass-card p-6 sm:p-8">
        <div className="divide-y divide-[rgba(34,211,238,0.08)]">
          <SummaryRow label="Medicine">{sale.medicineName}</SummaryRow>
          <SummaryRow label="Quantity">
            <span className="font-semibold">{sale.quantity}</span>
          </SummaryRow>
          <SummaryRow label="Payment Method">
            <span className="inline-flex items-center justify-end gap-2">
              <PaymentIcon className="h-5 w-5 text-[#22D3EE]" />
              <span className="font-semibold text-[#22D3EE]">{sale.method ?? sale.paymentType}</span>
            </span>
          </SummaryRow>
        </div>

        <div className="mt-6 rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.4)] px-5 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
            Amount paid
          </p>
          <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">{formatEtb(sale.amount)}</p>
        </div>
      </article>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="btn-confirm-active flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold disabled:cursor-wait disabled:opacity-90"
        >
          {loading ? <ConfirmSpinner /> : null}
          {loading ? "Saving…" : "Confirm & Save Sale"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-full rounded-xl border-2 border-[rgba(34,211,238,0.35)] bg-transparent py-3.5 text-sm font-semibold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
