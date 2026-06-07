import { useMemo } from "react";
import { formatEtb } from "../../data/pharmacySaleStore";
import { usePharmacySales } from "../../context/PharmacySalesContext";
import { IconCheck, IconPharmacy, IconTrendUp } from "../icons";

export default function PharmacyHome({ onCreateSale, onViewSales }) {
  const { todaysSales } = usePharmacySales();

  const stats = useMemo(() => {
    const total = todaysSales.reduce((sum, s) => sum + s.amount, 0);
    const units = todaysSales.reduce((sum, s) => sum + s.quantity, 0);
    return {
      salesCount: todaysSales.length,
      totalCollected: total,
      unitsSold: units,
    };
  }, [todaysSales]);

  const recentSales = todaysSales.slice(0, 5);

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <article className="glass-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">Sales Today</p>
              <p className="mt-2 text-2xl font-bold text-[#22D3EE]">{stats.salesCount}</p>
            </div>
            <div className="rounded-xl bg-[rgba(34,211,238,0.08)] p-2">
              <IconPharmacy className="h-5 w-5 text-[#22D3EE]" />
            </div>
          </div>
        </article>
        <article className="glass-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">Collected Today</p>
              <p className="mt-2 text-2xl font-bold text-[#10B981]">
                {formatEtb(stats.totalCollected)}
              </p>
            </div>
            <div className="rounded-xl bg-[rgba(16,185,129,0.08)] p-2">
              <IconTrendUp className="h-5 w-5 text-[#10B981]" />
            </div>
          </div>
        </article>
        <article className="glass-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">Units Sold</p>
              <p className="mt-2 text-2xl font-bold text-white">{stats.unitsSold}</p>
            </div>
            <div className="rounded-xl bg-[rgba(34,211,238,0.08)] p-2">
              <IconCheck className="h-5 w-5 text-[#22D3EE]" />
            </div>
          </div>
        </article>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCreateSale}
          className="btn-confirm-active rounded-xl px-6 py-3 text-sm font-bold"
        >
          Create a Sale
        </button>
        <button
          type="button"
          onClick={onViewSales}
          className="rounded-xl border-2 border-[rgba(34,211,238,0.35)] px-6 py-3 text-sm font-semibold text-[#22D3EE] transition-colors hover:bg-[rgba(34,211,238,0.08)]"
        >
          View My Sales
        </button>
      </div>

      <section className="glass-card overflow-hidden">
        <div className="border-b border-[rgba(34,211,238,0.1)] px-6 py-4">
          <h2 className="font-semibold text-white">Recent Sales Today</h2>
          <p className="text-sm text-[#94A3B8]">Latest pharmacy transactions</p>
        </div>
        {recentSales.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-[#64748B]">
            No sales recorded yet today. Create your first sale to get started.
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(34,211,238,0.06)]">
            {recentSales.map((sale) => (
              <li
                key={sale.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-[rgba(34,211,238,0.04)]"
              >
                <div>
                  <p className="font-medium text-white">{sale.medicineName}</p>
                  <p className="text-sm text-[#94A3B8]">
                    Qty {sale.quantity} · {sale.method ?? sale.paymentType}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[#94A3B8]">{sale.saleId}</span>
                  <span className="text-sm font-semibold text-[#10B981]">
                    {formatEtb(sale.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
