import { IconCash, IconMobilePay } from "./icons";
import {
  PAYMENT_CATEGORIES,
  PAYMENT_METHODS,
  getMethodsByCategory,
} from "../data/paymentMethods";

function MethodIcon({ category, selected }) {
  const Icon = category === "cash" ? IconCash : IconMobilePay;
  return (
    <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-[#22D3EE]" : "text-[#94A3B8]"}`} />
  );
}

function MethodButton({ method, selected, onSelect, compact }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(method.id)}
      title={method.bank ? `${method.bank} — ${method.product ?? method.label}` : method.label}
      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition-all duration-200 ${
        compact ? "min-h-[72px]" : "min-h-[80px]"
      } ${
        selected
          ? "border-[#22D3EE] bg-[rgba(34,211,238,0.12)] shadow-[0_0_16px_rgba(34,211,238,0.2)]"
          : "border-[rgba(34,211,238,0.12)] bg-[rgba(17,34,64,0.5)] hover:border-[rgba(34,211,238,0.25)]"
      }`}
    >
      <MethodIcon category={method.category} selected={selected} />
      <span
        className={`text-center text-[10px] font-semibold leading-tight sm:text-xs ${
          selected ? "text-[#22D3EE]" : "text-white"
        }`}
      >
        {method.label}
      </span>
      {method.bank && !compact && (
        <span className="line-clamp-1 max-w-full px-1 text-center text-[9px] text-[#64748B]">
          {method.bank}
        </span>
      )}
    </button>
  );
}

export default function PaymentMethodPicker({ value, onChange, compact = false }) {
  const cashMobile = [
    ...getMethodsByCategory("cash"),
    ...getMethodsByCategory("mobile"),
  ];
  const banks = getMethodsByCategory("bank");

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          {PAYMENT_CATEGORIES.cash.label} & {PAYMENT_CATEGORIES.mobile.label}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {cashMobile.map((method) => (
            <MethodButton
              key={method.id}
              method={method}
              selected={value === method.id}
              onSelect={onChange}
              compact={compact}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          {PAYMENT_CATEGORIES.bank.label}
        </p>
        <div className="grid max-h-[280px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 sm:gap-3">
          {banks.map((method) => (
            <MethodButton
              key={method.id}
              method={method}
              selected={value === method.id}
              onSelect={onChange}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function getPaymentMethodLabel(methodId) {
  return PAYMENT_METHODS.find((m) => m.id === methodId)?.label ?? methodId;
}
