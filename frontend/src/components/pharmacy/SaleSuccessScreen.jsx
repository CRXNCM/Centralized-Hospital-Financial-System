import { IconCheckCircle } from "../icons";
import { formatEtb } from "../../data/pharmacySaleStore";
import { getPaymentMethodIcon } from "../reception/paymentMethodIcon";

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

export default function SaleSuccessScreen({ sale, record, onNewSale, onViewSales }) {
  const PaymentIcon = getPaymentMethodIcon(sale.methodId ?? sale.paymentTypeId);
  const saleId = record?.saleId ?? "—";
  const timestamp = record?.timestamp ?? record?.time ?? "—";

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="payment-success rounded-2xl px-6 py-10 text-center sm:px-10">
        <div className="success-check-glow mx-auto flex h-24 w-24 items-center justify-center rounded-full">
          <IconCheckCircle className="success-check-pop h-16 w-16 text-[#10B981]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Sale Recorded Successfully</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">Pharmacy sale has been saved</p>
      </div>

      <article className="glass-card p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
          Sale details
        </p>
        <div>
          <DetailRow label="Sale ID">
            <span className="font-mono text-[#22D3EE]">{saleId}</span>
          </DetailRow>
          <DetailRow label="Medicine">{sale.medicineName}</DetailRow>
          <DetailRow label="Quantity">{sale.quantity}</DetailRow>
          <DetailRow label="Amount paid" highlight>
            {formatEtb(sale.amount)}
          </DetailRow>
          <DetailRow label="Payment method">
            <span className="inline-flex items-center justify-end gap-2">
              <PaymentIcon className="h-4 w-4 text-[#22D3EE]" />
              {sale.method ?? sale.paymentType}
            </span>
          </DetailRow>
          <DetailRow label="Timestamp">{timestamp}</DetailRow>
        </div>
      </article>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onNewSale}
          className="btn-confirm-active w-full rounded-xl py-4 text-sm font-bold"
        >
          Record Another Sale
        </button>
        <button
          type="button"
          onClick={onViewSales}
          className="w-full rounded-xl border-2 border-[rgba(34,211,238,0.35)] bg-transparent py-3.5 text-sm font-semibold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.08)]"
        >
          View My Sales
        </button>
      </div>
    </div>
  );
}
