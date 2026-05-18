import { useCallback, useEffect, useState } from "react";
import { INITIAL_TRANSACTIONS, refreshTransactions } from "../../data/managerMockData";
import StatusBadge from "./StatusBadge";
import TransactionDrawer from "./TransactionDrawer";

export default function ManagerTransactionsTable({
  limit = 10,
  statusFilter = null,
  showRefreshIndicator = true,
  hideAmount = false,
}) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selected, setSelected] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTransactions((prev) => refreshTransactions(prev));
    setLastRefresh(new Date());
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const filtered = statusFilter
    ? transactions.filter((t) => t.status.toLowerCase() === statusFilter.toLowerCase())
    : transactions;

  const displayed = filtered.slice(0, limit);

  return (
    <>
      <section className="glass-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Last {limit} transactions
              {statusFilter && (
                <span className="text-[#22D3EE]"> · filtered: {statusFilter}</span>
              )}
            </p>
          </div>
          {showRefreshIndicator && (
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <span
                className={`h-2 w-2 rounded-full ${refreshing ? "animate-pulse bg-[#22D3EE]" : "bg-[#10B981]"}`}
              />
              Auto-refresh 30s · {lastRefresh.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                {(
                  hideAmount
                    ? ["Patient Name", "Service", "Payment Method", "Status", "Time"]
                    : ["Patient Name", "Service", "Amount", "Payment Method", "Status", "Time"]
                ).map((col) => (
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
              {displayed.map((row) => {
                const isPending = row.status.toLowerCase() === "pending";
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelected(row)}
                    className={`table-row-hover cursor-pointer border-b border-[rgba(34,211,238,0.06)] transition-colors duration-150 ${
                      isPending ? "pending-row-glow" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-white">{row.patient}</td>
                    <td className="px-6 py-4 text-[#94A3B8]">{row.service}</td>
                    {!hideAmount && (
                      <td className="px-6 py-4 font-semibold text-[#22D3EE]">{row.amount}</td>
                    )}
                    <td className="px-6 py-4 text-white">{row.method}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8]">{row.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <TransactionDrawer transaction={selected} onClose={() => setSelected(null)} />
    </>
  );
}
