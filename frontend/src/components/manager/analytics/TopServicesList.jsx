import { TOP_SERVICES, formatEtb } from "../../../data/analyticsMockData";

export default function TopServicesList() {
  const maxRevenue = TOP_SERVICES[0].revenue;

  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white">Top Services by Revenue</h2>
      <p className="mt-1 text-sm text-[#94A3B8]">Ranked 1–5 this month</p>

      <ol className="mt-6 space-y-5">
        {TOP_SERVICES.map((service, index) => {
          const scale = service.revenue / maxRevenue;
          return (
            <li key={service.name}>
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
