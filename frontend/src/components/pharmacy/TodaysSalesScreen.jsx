import { useMemo, useState } from "react";
import { formatEtb } from "../../data/pharmacySaleStore";
import { usePharmacySales } from "../../context/PharmacySalesContext";
import SaleDetailModal from "./SaleDetailModal";

const TABLE_COLUMNS = [
  "Medicine",
  "Sale ID",
  "Quantity",
  "Amount",
  "Payment Method",
  "Time",
];

function StatCard({ label, value, valueClassName = "text-white" }) {
  return (
    <div className="glass-card flex flex-col justify-center px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function TodaysSalesScreen({ onCreateSale }) {
  const { todaysSales } = usePharmacySales();
  const [selectedSale, setSelectedSale] = useState(null);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = useMemo(() => {
    const totalCollected = todaysSales.reduce((sum, s) => sum + s.amount, 0);
    const totalUnits = todaysSales.reduce((sum, s) => sum + s.quantity, 0);
    return {
      totalCollected,
      saleCount: todaysSales.length,
      totalUnits,
    };
  }, [todaysSales]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">My Sales Records</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">{todayLabel}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Collected Today"
          value={formatEtb(stats.totalCollected)}
          valueClassName="text-[#22D3EE]"
        />
        <StatCard label="Sales Recorded" value={stats.saleCount} />
        <StatCard
          label="Units Sold"
          value={stats.totalUnits}
          valueClassName="text-[#10B981]"
        />
      </div>

      <section className="glass-card overflow-hidden">
        {todaysSales.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-[#64748B]">
            No sales recorded today yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todaysSales.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedSale(row)}
                    className="table-row-hover cursor-pointer border-b border-[rgba(34,211,238,0.06)] transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-medium text-white">{row.medicineName}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#94A3B8]">{row.saleId}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">{row.quantity}</td>
                    <td className="px-5 py-4 font-semibold text-[#10B981]">
                      {formatEtb(row.amount)}
                    </td>
                    <td className="px-5 py-4 text-white">{row.method ?? row.paymentType}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">{row.timestamp ?? row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={onCreateSale}
        className="btn-confirm-active w-full rounded-xl py-4 text-sm font-bold sm:w-auto sm:min-w-[240px]"
      >
        Record Another Sale
      </button>

      <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
}
