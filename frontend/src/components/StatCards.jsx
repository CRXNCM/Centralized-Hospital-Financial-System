import { useEffect, useState } from "react";
import { STAT_VALUES } from "../data/managerMockData";
import { getPharmacyTodayTotal } from "../data/pharmacySaleStore";
import { useCountUp } from "../hooks/useCountUp";
import { IconCheck, IconClock, IconPharmacy, IconTrendUp, IconUsers } from "./icons";

function formatEtb(n) {
  return n.toLocaleString();
}

function usePharmacyTodayTotal() {
  const [total, setTotal] = useState(() => getPharmacyTodayTotal());

  useEffect(() => {
    function refresh() {
      setTotal(getPharmacyTodayTotal());
    }
    window.addEventListener("pharmacy-sales-updated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("pharmacy-sales-updated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return total;
}

function StatValue({ stat }) {
  const count = useCountUp(stat.numericValue);
  const display = `${stat.prefix}${stat.format(Math.round(count))}`;

  return (
    <p className={`mt-2 text-2xl font-bold tracking-tight ${stat.valueClass}`}>{display}</p>
  );
}

export default function StatCards({ onNavigate }) {
  const pharmacyTodayTotal = usePharmacyTodayTotal();

  const statsConfig = [
    {
      id: "revenue",
      label: "Revenue Today",
      numericValue: STAT_VALUES.revenue,
      prefix: "ETB ",
      format: formatEtb,
      navigateTo: "transactions",
      icon: IconTrendUp,
      iconClass: "text-[#22D3EE] bg-[rgba(34,211,238,0.12)]",
      valueClass: "text-[#22D3EE]",
      showTrend: true,
      urgent: false,
    },
    {
      id: "pharmacy",
      label: "Pharmacy Payments Today",
      numericValue: pharmacyTodayTotal,
      prefix: "ETB ",
      format: formatEtb,
      navigateTo: "transactions",
      icon: IconPharmacy,
      iconClass: "text-[#8B5CF6] bg-[rgba(139,92,246,0.12)]",
      valueClass: "text-[#A78BFA]",
      showTrend: false,
      urgent: false,
    },
    {
      id: "patients",
      label: "Total Patients Today",
      numericValue: STAT_VALUES.patients,
      prefix: "",
      format: (n) => String(n),
      navigateTo: "transactions",
      icon: IconUsers,
      iconClass: "text-white bg-[rgba(255,255,255,0.08)]",
      valueClass: "text-white",
      showTrend: false,
      urgent: false,
    },
    {
      id: "verified",
      label: "Verified Payments",
      numericValue: STAT_VALUES.verifiedAmount,
      prefix: "ETB ",
      format: formatEtb,
      navigateTo: "transactions",
      filter: "verified",
      icon: IconCheck,
      iconClass: "text-[#10B981] bg-[rgba(16,185,129,0.12)]",
      valueClass: "text-[#10B981]",
      showTrend: false,
      urgent: false,
    },
    {
      id: "pending",
      label: "Pending Verifications",
      numericValue: STAT_VALUES.pendingAmount,
      prefix: "ETB ",
      format: formatEtb,
      navigateTo: "transactions",
      filter: "pending",
      icon: IconClock,
      iconClass: "text-[#F59E0B] bg-[rgba(245,158,11,0.12)]",
      valueClass: "text-[#F59E0B]",
      showTrend: false,
      urgent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => onNavigate?.(stat.navigateTo, stat.filter)}
            className="glass-card group cursor-pointer p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(34,211,238,0.22)] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#94A3B8]">{stat.label}</p>
                  {stat.urgent && (
                    <span
                      className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-[#F59E0B]"
                      title="Requires attention"
                    />
                  )}
                </div>
                <StatValue stat={stat} />
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass} transition-transform group-hover:scale-110`}
              >
                <Icon />
              </div>
            </div>
            {stat.showTrend && (
              <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#10B981]">
                <IconTrendUp className="h-3.5 w-3.5" />
                +12.4% vs yesterday
              </p>
            )}
            <p className="mt-2 text-xs text-[#94A3B8] opacity-0 transition-opacity group-hover:opacity-100">
              View details →
            </p>
          </button>
        );
      })}
    </div>
  );
}
