import { BILL_STATUS } from "../../data/receptionBillStore";

export default function BillStatusBadge({ status }) {
  const normalized = status?.toLowerCase() ?? "";
  let className = "badge-unpaid";
  if (normalized === "paid") className = "badge-verified";
  else if (normalized === "void") className = "badge-void";

  return (
    <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase sm:text-xs ${className}`}>
      {status}
    </span>
  );
}

export function isBillPayable(status) {
  return status === BILL_STATUS.UNPAID;
}
