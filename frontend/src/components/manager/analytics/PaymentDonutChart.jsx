import { useMemo, useState } from "react";
import {
  PAYMENT_METHOD_SPLIT,
  formatEtb,
  paymentSplitTotal,
} from "../../../data/analyticsMockData";
import { describeArc, polarToCartesian } from "./chartUtils";

const CX = 120;
const CY = 120;
const RADIUS = 88;
const STROKE = 28;

export default function PaymentDonutChart() {
  const [selected, setSelected] = useState(null);
  const total = paymentSplitTotal();

  const segments = useMemo(() => {
    let angle = 0;
    return PAYMENT_METHOD_SPLIT.map((item) => {
      const pct = (item.amount / total) * 100;
      const sweep = (pct / 100) * 360;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      return { ...item, pct, start, end };
    });
  }, [total]);

  const active = segments.find((s) => s.id === selected) ?? null;

  return (
    <section className="glass-card flex flex-col p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Payment Method Split</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">Click a segment for details</p>
      </div>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 240 240" className="h-56 w-56" role="img" aria-label="Payment method donut chart">
          {segments.map((seg) => {
            const isSelected = selected === seg.id;
            const isDimmed = selected && !isSelected;
            const midAngle = (seg.start + seg.end) / 2;
            const labelPos = polarToCartesian(CX, CY, RADIUS, midAngle);

            return (
              <g
                key={seg.id}
                className="cursor-pointer transition-opacity"
                style={{ opacity: isDimmed ? 0.35 : 1 }}
                onClick={() => setSelected(isSelected ? null : seg.id)}
              >
                <path
                  d={describeArc(CX, CY, RADIUS, seg.start, seg.end - 0.5)}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isSelected ? STROKE + 6 : STROKE}
                  strokeLinecap="butt"
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 10px ${seg.color})` : undefined,
                  }}
                />
                {!selected && seg.pct > 8 && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="9"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {Math.round(seg.pct)}%
                  </text>
                )}
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={RADIUS - STROKE - 4} fill="#0A1628" />
          <text x={CX} y={CY - 6} textAnchor="middle" fill="#94A3B8" fontSize="10">
            {active ? active.name : "Total"}
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" fill="#22D3EE" fontSize="12" fontWeight="700">
            {active ? formatEtb(active.amount) : formatEtb(total)}
          </text>
          {active && (
            <text x={CX} y={CY + 30} textAnchor="middle" fill="#94A3B8" fontSize="10">
              {active.pct.toFixed(1)}%
            </text>
          )}
        </svg>

        <ul className="mt-4 flex w-full max-h-32 flex-wrap justify-center gap-x-4 gap-y-2 overflow-y-auto">
          {segments.map((seg) => (
            <li key={seg.id}>
              <button
                type="button"
                onClick={() => setSelected(selected === seg.id ? null : seg.id)}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm transition-colors ${
                  selected === seg.id ? "text-white" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: seg.color, boxShadow: `0 0 8px ${seg.color}80` }}
                />
                <span className="font-medium">{seg.name}</span>
                <span className="text-xs">{seg.pct.toFixed(1)}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
