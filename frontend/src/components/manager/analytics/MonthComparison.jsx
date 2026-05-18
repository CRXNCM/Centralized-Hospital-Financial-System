import { MONTH_COMPARISON, formatEtb } from "../../../data/analyticsMockData";
import { IconTrendDown, IconTrendUp } from "../../icons";

export default function MonthComparison() {
  const { thisMonth, lastMonth, thisMonthLabel, lastMonthLabel } = MONTH_COMPARISON;
  const diff = thisMonth - lastMonth;
  const pctDiff = ((diff / lastMonth) * 100).toFixed(1);
  const isUp = diff >= 0;

  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white">Month vs Last Month</h2>
      <p className="mt-1 text-sm text-[#94A3B8]">Revenue comparison</p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-[rgba(34,211,238,0.12)] bg-[rgba(5,13,26,0.5)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#22D3EE]">
            {thisMonthLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{formatEtb(thisMonth)}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">This month</p>
        </div>

        <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(17,34,64,0.35)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            {lastMonthLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#94A3B8]">{formatEtb(lastMonth)}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Last month</p>
        </div>
      </div>

      <div
        className={`mt-6 flex items-center justify-center gap-3 rounded-xl border px-4 py-4 ${
          isUp
            ? "border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.1)]"
            : "border-[rgba(244,63,94,0.35)] bg-[rgba(244,63,94,0.1)]"
        }`}
      >
        {isUp ? (
          <IconTrendUp className="h-6 w-6 text-[#10B981]" />
        ) : (
          <IconTrendDown className="h-6 w-6 text-[#F43F5E]" />
        )}
        <div className="text-center">
          <p className={`text-2xl font-bold ${isUp ? "text-[#10B981]" : "text-[#F43F5E]"}`}>
            {isUp ? "+" : ""}
            {pctDiff}%
          </p>
          <p className="text-sm text-[#94A3B8]">
            {isUp ? "Higher" : "Lower"} than last month ({formatEtb(Math.abs(diff))})
          </p>
        </div>
      </div>
    </section>
  );
}
