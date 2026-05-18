import {
  PAYMENT_DISPLAY_STATUS,
  RECEPTIONIST_NAME,
} from "../../data/receptionBillStore";

export default function PaymentStatusBadge({ status }) {
  const normalized = status?.toLowerCase() ?? "";
  let className = "badge-pending";
  if (normalized === "paid") className = "badge-verified";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase sm:text-xs ${className}`}
    >
      {status}
    </span>
  );
}

export function getPaymentDisplayStatus(payment) {
  if (payment?.type === "payment" && payment.recordedBy === RECEPTIONIST_NAME) {
    return PAYMENT_DISPLAY_STATUS.PAID;
  }
  return payment?.verificationStatus ?? PAYMENT_DISPLAY_STATUS.PAID;
}
