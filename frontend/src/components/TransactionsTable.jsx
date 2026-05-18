const transactions = [
  { patient: "Abebe Girma", service: "Consultation", amount: "ETB 500", method: "Cash", status: "Paid", time: "09:14 AM" },
  { patient: "Fatuma Ali", service: "Laboratory", amount: "ETB 1,200", method: "Telebirr", status: "Verified", time: "09:45 AM" },
  { patient: "Daniel Tesfaye", service: "X-Ray", amount: "ETB 800", method: "eBirr", status: "Verified", time: "10:02 AM" },
  { patient: "Meron Haile", service: "Pharmacy", amount: "ETB 350", method: "Cash", status: "Paid", time: "10:30 AM" },
  { patient: "Yonas Bekele", service: "Consultation", amount: "ETB 500", method: "Telebirr", status: "Pending", time: "10:55 AM" },
  { patient: "Hiwot Tadesse", service: "Laboratory", amount: "ETB 1,500", method: "eBirr", status: "Verified", time: "11:20 AM" },
];

function StatusBadge({ status }) {
  const normalized = status.toLowerCase();
  let className = "badge-paid";
  if (normalized === "pending") className = "badge-pending";
  else if (normalized === "failed") className = "badge-failed";
  else if (normalized === "verified" || normalized === "paid") className = "badge-verified";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}

export default function TransactionsTable() {
  return (
    <section className="glass-card overflow-hidden">
      <div className="border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">Latest patient payments and verifications</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
              {["Patient Name", "Service", "Amount", "Payment Method", "Status", "Time"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((row) => (
              <tr
                key={`${row.patient}-${row.time}`}
                className="table-row-hover border-b border-[rgba(34,211,238,0.06)] transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium text-white">{row.patient}</td>
                <td className="px-6 py-4 text-[#94A3B8]">{row.service}</td>
                <td className="px-6 py-4 font-semibold text-[#22D3EE]">{row.amount}</td>
                <td className="px-6 py-4 text-white">{row.method}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-6 py-4 text-[#94A3B8]">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
