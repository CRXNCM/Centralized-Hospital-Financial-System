import { useEffect, useState } from "react";
import { CHART_DATA, CHART_PERIOD_LABELS } from "../data/managerMockData";

const PERIODS = ["daily", "weekly", "monthly"];

function formatEtb(amount) {
  return `ETB ${amount.toLocaleString()}`;
}

export default function RevenueChart() {
  const [period, setPeriod] = useState("daily");
  const [animateKey, setAnimateKey] = useState(0);
  const [hoveredBar, setHoveredBar] = useState(null);

  const channels = CHART_DATA[period];
  const maxAmount = Math.max(...channels.map((c) => c.amount));
  const totalAmount = channels.reduce((sum, c) => sum + c.amount, 0);

  useEffect(() => {
    setAnimateKey((k) => k + 1);
    setHoveredBar(null);
  }, [period]);

  const periodLabel = CHART_PERIOD_LABELS[period];

  return (
    <section className="glass-card p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Revenue by Payment Method</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Collection breakdown — {periodLabel}</p>
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
                    ? "bg-[#22D3EE] text-[#050D1A] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-[#22D3EE]">
            Total: {formatEtb(totalAmount)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex h-56 min-w-max items-end justify-start gap-6 px-2 sm:gap-8">
        {channels.map((channel, index) => {
          const heightPct = (channel.amount / maxAmount) * 100;
          const isHovered = hoveredBar === channel.name;

          return (
            <div key={`${animateKey}-${channel.name}`} className="relative flex flex-col items-center gap-3">
              <div
                className="relative flex h-40 w-16 items-end sm:w-20"
                onMouseEnter={() => setHoveredBar(channel.name)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {isHovered && (
                  <div className="chart-tooltip absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[rgba(34,211,238,0.3)] bg-[#112240] px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                    {formatEtb(channel.amount)} (
                    {totalAmount ? Math.round((channel.amount / totalAmount) * 100) : 0}%)
                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#112240]" />
                  </div>
                )}
                <div
                  className="bar-animate w-full cursor-pointer rounded-t-lg transition-opacity duration-200"
                  style={{
                    height: `${heightPct}%`,
                    background: `linear-gradient(180deg, ${channel.color} 0%, ${channel.color}99 100%)`,
                    boxShadow: isHovered
                      ? `0 0 32px ${channel.color}80`
                      : `0 0 24px ${channel.color}40`,
                    animationDelay: `${index * 120}ms`,
                    opacity: isHovered ? 1 : 0.92,
                  }}
                />
              </div>
              <span className="max-w-[4.5rem] text-center text-[10px] font-medium leading-tight text-[#94A3B8] sm:text-xs sm:max-w-none">
                {channel.name}
              </span>
            </div>
          );
        })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-[rgba(34,211,238,0.1)] pt-4">
        {channels.map((channel) => (
          <div key={channel.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: channel.color }}
            />
            <span className="text-xs text-[#94A3B8]">{channel.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
