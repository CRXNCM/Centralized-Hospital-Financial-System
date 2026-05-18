import { useEffect, useMemo, useState } from "react";
import { TRANSACTION_HISTORY } from "../../data/managerMockData";
import ExportToast from "./ExportToast";
import StatusBadge from "./StatusBadge";
import TransactionDetailModal from "./TransactionDetailModal";
import {
  PAYMENT_CATEGORIES,
  PAYMENT_METHODS,
} from "../../data/paymentMethods";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Paid", "Verified", "Pending", "Failed"];

const COLUMNS = [
  { key: "patient", label: "Patient Name" },
  { key: "billId", label: "Bill ID" },
  { key: "service", label: "Service" },
  { key: "amountNum", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "dateISO", label: "Date" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },
];

const DEFAULT_FILTERS = {
  search: "",
  method: "All",
  status: "All",
  dateFrom: "",
  dateTo: "",
};

function compareValues(a, b, key) {
  if (key === "amountNum") return a.amountNum - b.amountNum;
  if (key === "dateISO") return a.dateISO.localeCompare(b.dateISO) || a.time.localeCompare(b.time);
  const av = String(a[key] ?? "").toLowerCase();
  const bv = String(b[key] ?? "").toLowerCase();
  return av.localeCompare(bv);
}

export default function TransactionHistory({ initialStatusFilter = null }) {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    status: initialStatusFilter
      ? initialStatusFilter.charAt(0).toUpperCase() + initialStatusFilter.slice(1)
      : "All",
  });
  const [sortKey, setSortKey] = useState("dateISO");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filters, sortKey, sortDir]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return TRANSACTION_HISTORY.filter((tx) => {
      if (q && !tx.patient.toLowerCase().includes(q) && !tx.billId.toLowerCase().includes(q)) {
        return false;
      }
      if (filters.method !== "All" && tx.method !== filters.method) return false;
      if (filters.status !== "All" && tx.status !== filters.status) return false;
      if (filters.dateFrom && tx.dateISO < filters.dateFrom) return false;
      if (filters.dateTo && tx.dateISO > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const cmp = compareValues(a, b, sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function clearFilters() {
    setFilters({ ...DEFAULT_FILTERS });
  }

  function handleExport(format) {
    setExportOpen(false);
    setToast(`Report exported successfully as ${format}`);
    setTimeout(() => setToast(null), 3200);
  }

  const hasActiveFilters =
    filters.search ||
    filters.method !== "All" ||
    filters.status !== "All" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-6 p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Search, filter, and export hospital payment records
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((o) => !o)}
            className="rounded-xl border-2 border-[#22D3EE] bg-transparent px-4 py-2.5 text-sm font-bold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.1)]"
          >
            Export ▾
          </button>
          {exportOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20"
                aria-label="Close export menu"
                onClick={() => setExportOpen(false)}
              />
              <ul className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-[rgba(34,211,238,0.2)] bg-[#112240] py-1 shadow-xl">
                <li>
                  <button
                    type="button"
                    onClick={() => handleExport("PDF")}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[rgba(34,211,238,0.1)]"
                  >
                    Export as PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleExport("CSV")}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[rgba(34,211,238,0.1)]"
                  >
                    Export as CSV
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </header>

      <section className="glass-card p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <label className="lg:col-span-4">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Search
            </span>
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Patient name or bill ID..."
              className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
            />
          </label>

          <label className="lg:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Payment Method
            </span>
            <select
              value={filters.method}
              onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
            >
              <option value="All" className="bg-[#112240]">
                All
              </option>
              {Object.values(PAYMENT_CATEGORIES).map((cat) => (
                <optgroup key={cat.id} label={cat.label} className="bg-[#112240]">
                  {PAYMENT_METHODS.filter((m) => m.category === cat.id).map((m) => (
                    <option key={m.id} value={m.label} className="bg-[#112240]">
                      {m.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label className="lg:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Status
            </span>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-[#112240]">
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              From
            </span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE] [color-scheme:dark]"
            />
          </label>

          <label className="lg:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              To
            </span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE] [color-scheme:dark]"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#94A3B8]">
            {sorted.length} transaction{sorted.length !== 1 ? "s" : ""} found
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#22D3EE] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      <section className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-[#22D3EE]">{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-6 py-12 text-center text-[#94A3B8]">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const isPending = row.status === "Pending";
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelected(row)}
                      className={`table-row-hover cursor-pointer border-b border-[rgba(34,211,238,0.06)] ${
                        isPending ? "pending-row-glow" : ""
                      }`}
                    >
                      <td className="px-4 py-4 font-medium text-white">{row.patient}</td>
                      <td className="px-4 py-4 font-mono text-xs text-[#94A3B8]">{row.billId}</td>
                      <td className="px-4 py-4 text-[#94A3B8]">{row.service}</td>
                      <td className="px-4 py-4 font-semibold text-[#22D3EE]">{row.amount}</td>
                      <td className="px-4 py-4 text-white">{row.method}</td>
                      <td className="px-4 py-4 text-[#94A3B8]">{row.date}</td>
                      <td className="px-4 py-4 text-[#94A3B8]">{row.time}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(34,211,238,0.1)] px-6 py-4">
          <p className="text-sm text-[#94A3B8]">
            Page {safePage} of {totalPages} · {PAGE_SIZE} per page
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-[rgba(34,211,238,0.2)] px-3 py-1.5 text-sm text-white disabled:opacity-40 hover:bg-[rgba(34,211,238,0.08)]"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .map((n, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && n - prev > 1;
                return (
                  <span key={n} className="flex items-center gap-2">
                    {showEllipsis && <span className="text-[#94A3B8]">…</span>}
                    <button
                      type="button"
                      onClick={() => setPage(n)}
                      className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-sm ${
                        n === safePage
                          ? "bg-[#22D3EE] font-bold text-[#050D1A]"
                          : "border border-[rgba(34,211,238,0.2)] text-white hover:bg-[rgba(34,211,238,0.08)]"
                      }`}
                    >
                      {n}
                    </button>
                  </span>
                );
              })}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-[rgba(34,211,238,0.2)] px-3 py-1.5 text-sm text-white disabled:opacity-40 hover:bg-[rgba(34,211,238,0.08)]"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <TransactionDetailModal transaction={selected} onClose={() => setSelected(null)} />
      <ExportToast message={toast} visible={Boolean(toast)} />
    </div>
  );
}
