import { useEffect, useState } from "react";
import {
  CHART_PERIOD_LABELS,
  RECEPTION_COLLECTIONS,
} from "../../data/managerMockData";

const PERIODS = ["daily", "weekly", "monthly"];

function formatEtb(amount) {
  return `ETB ${amount.toLocaleString()}`;
}

export default function ReceptionCollectionsChart() {
  const [period, setPeriod] = useState("daily");
  const [animateKey, setAnimateKey] = useState(0);
  const [hoveredBar, setHoveredBar] = useState(null);

  const staff = RECEPTION_COLLECTIONS[period];
  const maxAmount = Math.max(...staff.map((s) => s.amount));
  const totalAmount = staff.reduce((sum, s) => sum + s.amount, 0);
  const periodLabel = CHART_PERIOD_LABELS[period];

  useEffect(() => {
    setAnimateKey((k) => k + 1);
    setHoveredBar(null);
  }, [period]);

  return (
    <section className="glass-card p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Collections by Receptionist</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Payments recorded per staff member — {periodLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  period === p
                    ? "bg-[#10B981] text-[#050D1A] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-[#10B981]">
            Total: {formatEtb(totalAmount)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex h-56 min-w-[320px] items-end justify-center gap-8 px-4 sm:gap-12">
          {staff.map((person, index) => {
            const heightPct = (person.amount / maxAmount) * 100;
            const isHovered = hoveredBar === person.name;
            const share = totalAmount
              ? Math.round((person.amount / totalAmount) * 100)
              : 0;

            return (
              <div
                key={`${animateKey}-${person.name}`}
                className="relative flex min-w-[72px] flex-1 flex-col items-center gap-3 sm:min-w-[88px]"
              >
                <div
                  className="relative flex h-44 w-full max-w-[100px] items-end"
                  onMouseEnter={() => setHoveredBar(person.name)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <div className="chart-tooltip absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[rgba(16,185,129,0.35)] bg-[#112240] px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-white">{person.name}</p>
                      <p className="mt-0.5 font-semibold text-[#10B981]">
                        {formatEtb(person.amount)}
                      </p>
                      <p className="mt-0.5 text-[#94A3B8]">
                        {person.transactions} payments · {share}%
                      </p>
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#112240]" />
                    </div>
                  )}
                  <div
                    className="bar-animate w-full cursor-pointer rounded-t-lg transition-opacity duration-200"
                    style={{
                      height: `${heightPct}%`,
                      background: `linear-gradient(180deg, ${person.color} 0%, ${person.color}99 100%)`,
                      boxShadow: isHovered
                        ? `0 0 32px ${person.color}80`
                        : `0 0 24px ${person.color}40`,
                      animationDelay: `${index * 120}ms`,
                      opacity: isHovered ? 1 : 0.92,
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    {person.shortName}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#64748B] sm:text-xs">
                    {formatEtb(person.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-6 border-t border-[rgba(34,211,238,0.1)] pt-4 sm:justify-start">
        {staff.map((person) => (
          <div key={person.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: person.color }}
            />
            <span className="text-xs text-[#94A3B8]">
              {person.name}
              <span className="ml-1 text-[#64748B]">({person.transactions} txns)</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
