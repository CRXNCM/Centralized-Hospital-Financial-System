import { useState } from "react";
import {
  TOP_SERVICES_BY_PERIOD,
  TOP_SERVICES_PERIOD_LABELS,
  formatEtb,
} from "../../../data/analyticsMockData";

const PERIODS = ["daily", "weekly", "monthly"];

export default function TopServicesList() {
  const [period, setPeriod] = useState("monthly");
  const services = TOP_SERVICES_BY_PERIOD[period];
  const maxRevenue = services[0]?.revenue ?? 1;
  const periodLabel = TOP_SERVICES_PERIOD_LABELS[period];

  return (
    <section className="glass-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Top Services by Revenue</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Ranked 1–5 — {periodLabel}</p>
        </div>
        <div className="flex rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                period === p
                  ? "bg-[#22D3EE] text-[#050D1A] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ol className="mt-6 space-y-5">
        {services.map((service, index) => {
          const scale = service.revenue / maxRevenue;
          return (
            <li key={`${period}-${service.name}`}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(34,211,238,0.15)] text-xs font-bold text-[#22D3EE]">
                    {service.rank}
                  </span>
                  <span className="font-medium text-white">{service.name}</span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[#22D3EE]">
                  {formatEtb(service.revenue)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(5,13,26,0.6)]">
                <div
                  className="service-bar h-full w-full origin-left rounded-full bg-gradient-to-r from-[#22D3EE] to-[#67E8F9]"
                  style={{
                    "--bar-scale": scale,
                    animationDelay: `${index * 100}ms`,
                    boxShadow: "0 0 12px rgba(34,211,238,0.4)",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
