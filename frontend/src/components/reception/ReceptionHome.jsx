import { IconCheck, IconClock, IconUsers } from "../icons";

const deskStats = [
  { label: "Patients Today", value: "47", icon: IconUsers, color: "text-white" },
  { label: "Payments Recorded", value: "44", icon: IconCheck, color: "text-[#10B981]" },
  { label: "Pending Bills", value: "3", icon: IconClock, color: "text-[#F59E0B]" },
];

const queue = [
  { name: "Yonas Bekele", service: "Consultation", billId: "BILL-1005", status: "Pending" },
  { name: "Selam Desta", service: "Laboratory", billId: "BILL-1007", status: "Waiting" },
  { name: "Bereket Alemu", service: "Pharmacy", billId: "BILL-1008", status: "Waiting" },
];

export default function ReceptionHome() {
  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {deskStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8]">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="rounded-xl bg-[rgba(34,211,238,0.08)] p-2">
                  <Icon className="h-5 w-5 text-[#22D3EE]" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="glass-card overflow-hidden">
        <div className="border-b border-[rgba(34,211,238,0.1)] px-6 py-4">
          <h2 className="font-semibold text-white">Waiting Queue</h2>
          <p className="text-sm text-[#94A3B8]">Patients ready for payment</p>
        </div>
        <ul className="divide-y divide-[rgba(34,211,238,0.06)]">
          {queue.map((item) => (
            <li
              key={item.name}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-[rgba(34,211,238,0.04)]"
            >
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-[#94A3B8]">{item.service}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#94A3B8]">{item.billId}</span>
                <span className="badge-pending rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
