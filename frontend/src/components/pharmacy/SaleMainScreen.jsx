import { useState } from "react";
import {
  PAYMENT_METHOD_BY_ID,
  getMethodsByCategory,
} from "../../data/paymentMethods";
import { formatEtb } from "../../data/pharmacySaleStore";
import { IconCash, IconMobilePay, IconWallet } from "../icons";

const PRIMARY_METHODS = [
  { id: "cash", label: "Cash", icon: IconCash },
  { id: "telebirr", label: "Telebirr", icon: IconMobilePay },
  { id: "ebirr", label: "eBirr", icon: IconWallet },
];

const BANK_METHODS = getMethodsByCategory("bank");
const BANK_IDS = new Set(BANK_METHODS.map((m) => m.id));

function isBankMethod(id) {
  return id && BANK_IDS.has(id);
}

function parsePositiveNumber(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function isValidPaymentMethod(id) {
  return Boolean(id && PAYMENT_METHOD_BY_ID[id]);
}

export default function SaleMainScreen({ onConfirm, restore }) {
  const [medicineName, setMedicineName] = useState(restore?.medicineName ?? "");
  const [quantity, setQuantity] = useState(
    restore?.quantity != null ? String(restore.quantity) : "",
  );
  const [method, setMethod] = useState(restore?.methodId ?? restore?.paymentTypeId ?? null);
  const [amount, setAmount] = useState(restore?.amount != null ? String(restore.amount) : "");
  const [banksOpen, setBanksOpen] = useState(
    restore?.methodId || restore?.paymentTypeId
      ? isBankMethod(restore.methodId ?? restore.paymentTypeId)
      : false,
  );

  const quantityNum = parsePositiveNumber(quantity);
  const amountNum = parsePositiveNumber(amount);

  const selectedBank = isBankMethod(method) ? PAYMENT_METHOD_BY_ID[method] : null;

  const canSubmit = Boolean(
    medicineName.trim() &&
      quantityNum &&
      isValidPaymentMethod(method) &&
      amountNum,
  );

  const missingFields = [];
  if (!medicineName.trim()) missingFields.push("medicine name");
  if (!quantityNum) missingFields.push("quantity");
  if (!isValidPaymentMethod(method)) {
    missingFields.push(banksOpen && !selectedBank ? "a bank from the list" : "payment method");
  }
  if (!amountNum) missingFields.push("amount");

  const showHint =
    !canSubmit &&
    (medicineName.trim() ||
      quantity !== "" ||
      amount !== "" ||
      method ||
      banksOpen);

  const hasMethod = Boolean(method);
  const primaryDimmed = (id) => hasMethod && method !== id;

  function selectPrimaryMethod(id) {
    setMethod(id);
    setBanksOpen(false);
  }

  function selectBankMethod(id) {
    setMethod(id);
    setBanksOpen(true);
  }

  function handleConfirmClick() {
    if (!canSubmit || !quantityNum || !amountNum) return;
    const methodLabel = PAYMENT_METHOD_BY_ID[method]?.label ?? method;
    onConfirm({
      medicineName: medicineName.trim(),
      quantity: quantityNum,
      method: methodLabel,
      methodId: method,
      paymentTypeId: method,
      paymentType: methodLabel,
      amount: amountNum,
    });
  }

  return (
    <div className="w-full max-w-[88rem] space-y-6">
      <div className="grid gap-6 xl:grid-cols-12">
        <article className="bill-card-glow rounded-2xl bg-[linear-gradient(145deg,rgba(17,34,64,0.9)_0%,rgba(26,47,85,0.85)_100%)] p-6 xl:col-span-4">
          <div>
            <label htmlFor="medicine-name" className="text-xs uppercase tracking-wide text-[#94A3B8]">
              Medicine
            </label>
            <input
              id="medicine-name"
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Enter medicine name"
              autoComplete="off"
              className="mt-1 w-full border-0 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-[#64748B] focus:ring-0"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-8 border-t border-[rgba(34,211,238,0.12)] pt-5">
            <div>
              <label htmlFor="quantity" className="text-xs uppercase tracking-wide text-[#94A3B8]">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
                className="mt-1 w-24 rounded-lg border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.4)] px-3 py-2 text-lg font-medium text-white outline-none focus:border-[#22D3EE]"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Total</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {amountNum ? formatEtb(amountNum) : "—"}
              </p>
            </div>
          </div>
        </article>

        <div className="space-y-5 xl:col-span-8">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-white">Payment Method</h3>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
              <div className="grid flex-1 grid-cols-3 gap-3">
                {PRIMARY_METHODS.map(({ id, label, icon: Icon }) => {
                  const selected = method === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectPrimaryMethod(id)}
                      className={`flex flex-col items-center gap-3 rounded-xl border px-3 py-5 transition-all duration-200 ${
                        selected
                          ? "border-[#22D3EE] bg-[rgba(34,211,238,0.12)] shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                          : "border-[rgba(34,211,238,0.12)] bg-[rgba(17,34,64,0.5)] hover:border-[rgba(34,211,238,0.25)]"
                      } ${primaryDimmed(id) ? "opacity-45" : "opacity-100"}`}
                    >
                      <Icon
                        className={`h-8 w-8 ${selected ? "text-[#22D3EE]" : "text-[#94A3B8]"}`}
                      />
                      <span
                        className={`text-sm font-semibold ${selected ? "text-[#22D3EE]" : "text-white"}`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="lg:w-52 lg:shrink-0">
                <button
                  type="button"
                  onClick={() => setBanksOpen((o) => !o)}
                  className={`flex h-full min-h-[88px] w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 transition-all sm:px-4 sm:py-4 lg:flex-col lg:justify-center ${
                    selectedBank
                      ? "border-[#22D3EE] bg-[rgba(34,211,238,0.12)] shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                      : banksOpen
                        ? "border-[rgba(34,211,238,0.35)] bg-[rgba(17,34,64,0.55)]"
                        : "border-[rgba(34,211,238,0.12)] bg-[rgba(17,34,64,0.5)] hover:border-[rgba(34,211,238,0.25)]"
                  } ${hasMethod && !selectedBank ? "opacity-45" : "opacity-100"}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <IconMobilePay
                      className={`h-7 w-7 shrink-0 ${selectedBank ? "text-[#22D3EE]" : "text-[#94A3B8]"}`}
                    />
                    <div>
                      <span
                        className={`block text-sm font-semibold ${selectedBank ? "text-[#22D3EE]" : "text-white"}`}
                      >
                        Other banks
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {selectedBank
                          ? selectedBank.label
                          : banksOpen
                            ? "Choose a bank below"
                            : "CBE Birr, Amole, Apollo & more"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[#94A3B8] transition-transform ${banksOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
              </div>
            </div>

            {banksOpen && (
              <div className="mt-3 grid max-h-40 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] p-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {BANK_METHODS.map((bank) => {
                  const selected = method === bank.id;
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      title={bank.bank}
                      onClick={() => selectBankMethod(bank.id)}
                      className={`rounded-lg border px-2 py-2.5 text-center transition-all ${
                        selected
                          ? "border-[#22D3EE] bg-[rgba(34,211,238,0.12)] text-[#22D3EE]"
                          : "border-transparent text-white hover:border-[rgba(34,211,238,0.2)] hover:bg-[rgba(34,211,238,0.06)]"
                      }`}
                    >
                      <span className="block text-xs font-semibold leading-tight">
                        {bank.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <section className="min-w-0 flex-1">
              <label htmlFor="payment-amount" className="mb-2 block text-sm font-semibold text-white">
                Amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94A3B8]">
                  ETB
                </span>
                <input
                  id="payment-amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] py-3.5 pl-14 pr-4 text-lg text-white outline-none transition-colors focus:border-[#22D3EE] focus:shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                />
              </div>
            </section>

            <div className="w-full sm:w-56">
              <button
                type="button"
                onClick={handleConfirmClick}
                disabled={!canSubmit}
                className={`w-full rounded-xl py-4 text-sm font-bold transition-all ${
                  canSubmit
                    ? "btn-confirm-active"
                    : "cursor-not-allowed bg-[#334155] text-[#64748B]"
                }`}
              >
                Confirm Payment
              </button>
              {showHint && (
                <p className="mt-2 text-center text-xs text-[#F59E0B] sm:text-left">
                  Complete: {missingFields.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
