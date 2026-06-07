import { useEffect, useMemo, useRef, useState } from "react";
import { formatEtb } from "../../data/receptionBills";
import { getFixedServicePrice } from "../../data/receptionBillStore";
import { useReceptionBills } from "../../context/ReceptionBillsContext";
import BillStatusBadge from "./BillStatusBadge";
import SettledBillsPanel from "./SettledBillsPanel";
import {
  PAYMENT_METHOD_BY_ID,
  getMethodsByCategory,
} from "../../data/paymentMethods";
import { IconCash, IconMobilePay, IconSearch, IconWallet } from "../icons";

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

function UnpaidBillRow({ bill, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(bill)}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all sm:gap-4 ${
        selected
          ? "border-[#22D3EE] bg-[rgba(34,211,238,0.1)] shadow-[0_0_16px_rgba(34,211,238,0.15)]"
          : "border-[rgba(34,211,238,0.1)] bg-[rgba(17,34,64,0.4)] hover:border-[rgba(34,211,238,0.25)]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{bill.patientName}</p>
        <p className="mt-0.5 truncate text-xs text-[#94A3B8]">
          <span className="text-[#CBD5E1]">{bill.billId}</span>
          <span className="mx-1.5">·</span>
          {bill.service}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-[#22D3EE] sm:text-base">
        {formatEtb(bill.amount)}
      </span>
      <BillStatusBadge status={bill.status} />
    </button>
  );
}

export default function PaymentMainScreen({ onConfirm, restore }) {
  const [query, setQuery] = useState(restore?.query ?? "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(restore?.bill ?? null);
  const [method, setMethod] = useState(restore?.methodId ?? null);
  const [amount, setAmount] = useState(
    restore?.amount != null ? String(restore.amount) : "",
  );
  const [banksOpen, setBanksOpen] = useState(
    restore?.methodId ? isBankMethod(restore.methodId) : false,
  );
  const searchRef = useRef(null);
  const { unpaidBills, filterByQuery } = useReceptionBills();

  const searchResults = useMemo(
    () => filterByQuery(unpaidBills, query),
    [query, unpaidBills, filterByQuery],
  );
  const unpaidList = searchResults;
  const hasQuery = query.trim().length > 0;
  const showSearchDropdown = dropdownOpen && hasQuery;

  const selectedBank = isBankMethod(method)
    ? PAYMENT_METHOD_BY_ID[method]
    : null;

  const fixedServicePrice = selectedBill ? getFixedServicePrice(selectedBill.service) : null;

  const amountNum = Number(amount);
  const amountDiffers =
    selectedBill &&
    fixedServicePrice == null &&
    amount !== "" &&
    !Number.isNaN(amountNum) &&
    amountNum !== selectedBill.amount;

  const canSubmit =
    selectedBill &&
    method &&
    amount !== "" &&
    !Number.isNaN(amountNum) &&
    amountNum > 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectBill(bill) {
    setSelectedBill(bill);
    const price = getFixedServicePrice(bill.service) ?? bill.amount;
    setAmount(String(price));
    setMethod(null);
    setBanksOpen(false);
    setQuery(bill.patientName);
    setDropdownOpen(false);
  }

  function selectPrimaryMethod(id) {
    setMethod(id);
    setBanksOpen(false);
  }

  function selectBankMethod(id) {
    setMethod(id);
    setBanksOpen(true);
  }

  function handleSearchKeyDown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    setDropdownOpen(true);
    if (searchResults.length === 1) {
      selectBill(searchResults[0]);
    }
  }

  function handleSearchChange(value) {
    setQuery(value);
    setDropdownOpen(true);
    if (selectedBill) {
      const trimmed = value.trim().toLowerCase();
      const matchName = selectedBill.patientName.toLowerCase() === trimmed;
      const matchBill = selectedBill.billId.toLowerCase() === trimmed;
      if (!matchName && !matchBill) {
        setSelectedBill(null);
        setAmount("");
        setMethod(null);
        setBanksOpen(false);
      }
    }
  }

  function handleConfirmClick() {
    if (!canSubmit) return;
    const methodLabel = PAYMENT_METHOD_BY_ID[method]?.label ?? method;
    onConfirm({
      bill: selectedBill,
      method: methodLabel,
      methodId: method,
      amount: amountNum,
    });
  }

  const hasMethod = Boolean(method);
  const primaryDimmed = (id) => hasMethod && method !== id;

  return (
    <div className="w-full max-w-[88rem] space-y-6">
      <section ref={searchRef} className="relative">
        <label htmlFor="patient-search" className="sr-only">
          Search patient by name or Bill ID
        </label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="patient-search"
            type="search"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Search patient by name or Bill ID"
            autoComplete="off"
            className="w-full rounded-2xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.75)] py-4 pl-14 pr-5 text-lg text-white shadow-[0_0_20px_rgba(34,211,238,0.08)] outline-none transition-all placeholder:text-[#64748B] focus:border-[#22D3EE] focus:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
          />
        </div>

        {showSearchDropdown && (
          <ul className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-[rgba(34,211,238,0.25)] bg-[#0A1628] py-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            {searchResults.length === 0 ? (
              <li className="px-5 py-5 text-sm leading-relaxed text-[#94A3B8]">
                <p className="font-medium text-white">No matching patients</p>
                <p className="mt-1">
                  We couldn&apos;t find anyone for &ldquo;{query.trim()}&rdquo;. Check the spelling
                  or try a Bill ID (e.g. BILL-1001).
                </p>
              </li>
            ) : (
              searchResults.map((bill) => (
                <li key={bill.id}>
                  <button
                    type="button"
                    onClick={() => selectBill(bill)}
                    className="w-full px-5 py-3.5 text-left transition-colors hover:bg-[rgba(34,211,238,0.08)]"
                  >
                    <p className="font-semibold text-white">{bill.patientName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                      <span className="text-[#94A3B8]">{bill.billId}</span>
                      <span className="text-[#94A3B8]">·</span>
                      <span className="text-[#94A3B8]">{bill.service}</span>
                      <span className="ml-auto font-semibold text-[#22D3EE]">
                        {formatEtb(bill.amount)}
                      </span>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </section>

      <section className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Unpaid patients</h2>
            <p className="mt-0.5 text-xs text-[#94A3B8]">
              {unpaidList.length} bill{unpaidList.length === 1 ? "" : "s"} awaiting payment
            </p>
          </div>
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDropdownOpen(false);
              }}
              className="text-xs font-medium text-[#22D3EE] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {unpaidList.length === 0 ? (
          <div className="py-8 text-center text-sm leading-relaxed text-[#94A3B8]">
            {hasQuery ? (
              <>
                <p className="font-medium text-white">No matching unpaid bills</p>
                <p className="mt-1">
                  Nothing matches &ldquo;{query.trim()}&rdquo;. Try another name or Bill ID, or
                  clear search to see everyone.
                </p>
              </>
            ) : (
              <p>All patients are paid up — no unpaid bills right now.</p>
            )}
          </div>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {unpaidList.map((bill) => (
              <li key={bill.id} className="min-w-[260px] flex-1 basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33.333%-0.5rem)] xl:basis-[calc(25%-0.5625rem)]">
                <UnpaidBillRow
                  bill={bill}
                  selected={selectedBill?.id === bill.id}
                  onSelect={selectBill}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <SettledBillsPanel />

      {selectedBill && (
        <div className="grid gap-6 xl:grid-cols-12">
          <article className="bill-card-glow rounded-2xl bg-[linear-gradient(145deg,rgba(17,34,64,0.9)_0%,rgba(26,47,85,0.85)_100%)] p-6 xl:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedBill.patientName}</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">{selectedBill.billId}</p>
            </div>
            <BillStatusBadge status={selectedBill.status} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-8 border-t border-[rgba(34,211,238,0.12)] pt-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Service</p>
              <p className="mt-1 text-lg font-medium text-white">{selectedBill.service}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Total bill</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {formatEtb(selectedBill.amount)}
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
                  selectedBank || banksOpen
                    ? "border-[#22D3EE] bg-[rgba(34,211,238,0.12)] shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                    : "border-[rgba(34,211,238,0.12)] bg-[rgba(17,34,64,0.5)] hover:border-[rgba(34,211,238,0.25)]"
                } ${hasMethod && !selectedBank ? "opacity-45" : "opacity-100"}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <IconMobilePay
                    className={`h-7 w-7 shrink-0 ${selectedBank || banksOpen ? "text-[#22D3EE]" : "text-[#94A3B8]"}`}
                  />
                  <div>
                    <span
                      className={`block text-sm font-semibold ${selectedBank || banksOpen ? "text-[#22D3EE]" : "text-white"}`}
                    >
                      Other banks
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      {selectedBank
                        ? selectedBank.label
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
                  readOnly={fixedServicePrice != null}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full rounded-xl border border-[rgba(34,211,238,0.15)] py-3.5 pl-14 pr-4 text-lg text-white outline-none transition-colors ${
                    fixedServicePrice != null
                      ? "cursor-default bg-[rgba(5,13,26,0.35)] text-[#CBD5E1]"
                      : "bg-[rgba(5,13,26,0.6)] focus:border-[#22D3EE] focus:shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                  }`}
                />
              </div>
              {fixedServicePrice != null && (
                <p className="mt-2 text-sm text-[#94A3B8]">
                  Fixed service price — {formatEtb(fixedServicePrice)}
                </p>
              )}
              {amountDiffers && (
                <p className="mt-2 text-sm text-[#F59E0B]">Amount differs from original bill</p>
              )}
            </section>

            <button
              type="button"
              onClick={handleConfirmClick}
              disabled={!canSubmit}
              className={`w-full shrink-0 rounded-xl py-4 text-sm font-bold transition-all sm:w-56 ${
                canSubmit
                  ? "btn-confirm-active"
                  : "cursor-not-allowed bg-[#334155] text-[#64748B]"
              }`}
            >
              Confirm Payment
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
