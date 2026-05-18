import { formatEtb } from "../../data/receptionBills";
import { useReceptionBills } from "../../context/ReceptionBillsContext";
import BillStatusBadge from "./BillStatusBadge";

function auditTypeLabel(type) {
  if (type === "payment") return "Payment";
  if (type === "void") return "Void";
  if (type === "restore") return "Restore";
  return type;
}

export default function PatientHistory() {
  const { auditLog } = useReceptionBills();

  return (
    <div className="p-8">
      <section className="glass-card overflow-hidden">
        <div className="border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <h2 className="text-lg font-semibold text-white">Payment audit log</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            All reception actions are recorded — payments, voids, and restores to unpaid
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                {["Time", "Patient", "Bill ID", "Type", "Method", "Amount", "Status"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {auditLog.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                    No payment activity recorded yet today.
                  </td>
                </tr>
              ) : (
                auditLog.map((row) => (
                  <tr
                    key={row.id}
                    className={`table-row-hover border-b border-[rgba(34,211,238,0.06)] ${
                      row.type === "void" ? "bg-[rgba(244,63,94,0.04)]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-[#94A3B8]">{row.time}</td>
                    <td className="px-6 py-4 font-medium text-white">{row.patientName}</td>
                    <td className="px-6 py-4 text-[#94A3B8]">{row.billId}</td>
                    <td className="px-6 py-4 text-[#94A3B8]">{auditTypeLabel(row.type)}</td>
                    <td className="px-6 py-4 text-white">{row.method}</td>
                    <td className="px-6 py-4 font-semibold text-[#22D3EE]">
                      {row.method === "—" ? "—" : formatEtb(row.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <BillStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

