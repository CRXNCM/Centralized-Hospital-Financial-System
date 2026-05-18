import { useMemo, useRef, useState } from "react";
import { TREND_30_DAYS, formatEtb } from "../../../data/analyticsMockData";
import { buildAreaPath, buildSmoothLinePath } from "./chartUtils";

const WIDTH = 720;
const HEIGHT = 260;
const PAD = { top: 24, right: 20, bottom: 36, left: 56 };
const CHART_W = WIDTH - PAD.left - PAD.right;
const CHART_H = HEIGHT - PAD.top - PAD.bottom;

export default function RevenueTrendChart() {
  const svgRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const { points, linePath, areaPath, yTicks, maxRevenue } = useMemo(() => {
    const max = Math.max(...TREND_30_DAYS.map((d) => d.revenue));
    const min = Math.min(...TREND_30_DAYS.map((d) => d.revenue));
    const range = max - min || 1;

    const pts = TREND_30_DAYS.map((d, i) => ({
      ...d,
      x: PAD.left + (i / (TREND_30_DAYS.length - 1)) * CHART_W,
      y: PAD.top + CHART_H - ((d.revenue - min) / range) * CHART_H,
    }));

    const line = buildSmoothLinePath(pts);
    const area = buildAreaPath(
      line,
      PAD.top + CHART_H,
      pts[0].x,
      pts[pts.length - 1].x,
    );

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      y: PAD.top + CHART_H - t * CHART_H,
      label: formatEtb(Math.round(min + range * t)),
    }));

    return { points: pts, linePath: line, areaPath: area, yTicks: ticks, maxRevenue: max };
  }, []);

  function handleMouseMove(e) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;

    let nearest = points[0];
    let minDist = Infinity;
    for (const p of points) {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }
    setHovered(nearest);
  }

  return (
    <section className="glass-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">30-Day Revenue Trend</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">Daily hospital revenue — hover for details</p>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full min-w-[320px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
          role="img"
          aria-label="30 day revenue trend line chart"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick.label}>
              <line
                x1={PAD.left}
                y1={tick.y}
                x2={PAD.left + CHART_W}
                y2={tick.y}
                stroke="rgba(34,211,238,0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={PAD.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="10"
              >
                {tick.label.replace("ETB ", "")}
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#areaGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.5))" }}
          />

          {hovered && (
            <>
              <line
                x1={hovered.x}
                y1={PAD.top}
                x2={hovered.x}
                y2={PAD.top + CHART_H}
                stroke="rgba(34,211,238,0.35)"
                strokeDasharray="4 4"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r="6"
                fill="#22D3EE"
                stroke="#050D1A"
                strokeWidth="2"
              />
            </>
          )}

          {[0, 7, 14, 21, 29].map((i) => (
            <text
              key={TREND_30_DAYS[i].fullDate}
              x={points[i].x}
              y={HEIGHT - 8}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="10"
            >
              {TREND_30_DAYS[i].date}
            </text>
          ))}
        </svg>

        {hovered && (
          <div
            className="chart-tooltip pointer-events-none absolute z-10 rounded-lg border border-[rgba(34,211,238,0.3)] bg-[#112240] px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${((hovered.x / WIDTH) * 100).toFixed(1)}%`,
              top: "12px",
              transform: "translateX(-50%)",
            }}
          >
            <p className="font-semibold text-[#22D3EE]">{hovered.date}</p>
            <p className="mt-0.5 font-bold text-white">{formatEtb(hovered.revenue)}</p>
          </div>
        )}
      </div>

      <p className="mt-2 text-right text-xs text-[#94A3B8]">
        Peak: {formatEtb(maxRevenue)}
      </p>
    </section>
  );
}
