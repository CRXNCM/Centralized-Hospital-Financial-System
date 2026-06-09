import { useCallback, useEffect, useState } from "react";
import { getPharmacyTransactionsForManager } from "../../data/pharmacySaleStore";
import StatusBadge from "./StatusBadge";

export default function PharmacyTransactionsTable({ limit = 10 }) {
  const [transactions, setTransactions] = useState(() =>
    getPharmacyTransactionsForManager(limit),
  );
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTransactions(getPharmacyTransactionsForManager(limit));
    setLastRefresh(new Date());
    setTimeout(() => setRefreshing(false), 400);
  }, [limit]);

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    refresh();
    window.addEventListener("pharmacy-sales-updated", refresh);
    return () => window.removeEventListener("pharmacy-sales-updated", refresh);
  }, [refresh]);

  return (
    <section className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(139,92,246,0.12)] px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Pharmacy Sales</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Recent pharmacy sales — amount only (last {limit})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span
            className={`h-2 w-2 rounded-full ${refreshing ? "animate-pulse bg-[#A78BFA]" : "bg-[#8B5CF6]"}`}
          />
          Live · {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(139,92,246,0.12)] bg-[rgba(5,13,26,0.4)]">
              {["Sale ID", "Amount", "Payment Method", "Recorded By", "Status", "Time"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[#94A3B8]">
                  No pharmacy sales recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((row) => (
                <tr
                  key={row.id}
                  className="table-row-hover border-b border-[rgba(139,92,246,0.06)] transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-white">{row.saleId}</td>
                  <td className="px-6 py-4 font-semibold text-[#A78BFA]">{row.amountLabel}</td>
                  <td className="px-6 py-4 text-white">{row.method}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{row.recordedBy}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-[#94A3B8]">{row.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
