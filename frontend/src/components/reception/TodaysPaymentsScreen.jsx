import { useMemo, useState } from "react";
import { formatEtb } from "../../data/receptionBills";
import { PAYMENT_DISPLAY_STATUS } from "../../data/receptionBillStore";
import { useReceptionBills } from "../../context/ReceptionBillsContext";
import PaymentDetailModal from "./PaymentDetailModal";
import PaymentStatusBadge, { getPaymentDisplayStatus } from "./PaymentStatusBadge";

const TABLE_COLUMNS = [
  "Patient Name",
  "Bill ID",
  "Service",
  "Amount",
  "Method",
  "Time",
  "Status",
];

function StatCard({ label, value, valueClassName = "text-white" }) {
  return (
    <div className="glass-card flex flex-col justify-center px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function TodaysPaymentsScreen({ onRecordPayment }) {
  const { todaysPayments } = useReceptionBills();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = useMemo(() => {
    const paidPayments = todaysPayments.filter(
      (p) => getPaymentDisplayStatus(p) === PAYMENT_DISPLAY_STATUS.PAID,
    );
    const pendingCount = todaysPayments.filter(
      (p) => getPaymentDisplayStatus(p) === PAYMENT_DISPLAY_STATUS.PENDING,
    ).length;

    return {
      totalCollected: paidPayments.reduce((sum, p) => sum + p.amount, 0),
      transactionCount: todaysPayments.length,
      pendingVerifications: pendingCount,
    };
  }, [todaysPayments]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Today&apos;s Payments</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">{todayLabel}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Collected Today"
          value={formatEtb(stats.totalCollected)}
          valueClassName="text-[#22D3EE]"
        />
        <StatCard label="Number of Transactions" value={stats.transactionCount} />
        <StatCard
          label="Pending Verifications"
          value={stats.pendingVerifications}
          valueClassName="text-[#F59E0B]"
        />
      </div>

      <section className="glass-card overflow-hidden">
        {todaysPayments.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-[#64748B]">
            No payments recorded today yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todaysPayments.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedPayment(row)}
                    className="table-row-hover cursor-pointer border-b border-[rgba(34,211,238,0.06)] transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-medium text-white">{row.patientName}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#94A3B8]">{row.billId}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">{row.service}</td>
                    <td className="px-5 py-4 font-semibold text-[#10B981]">
                      {formatEtb(row.amount)}
                    </td>
                    <td className="px-5 py-4 text-white">{row.method}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">{row.timestamp ?? row.time}</td>
                    <td className="px-5 py-4">
                      <PaymentStatusBadge status={getPaymentDisplayStatus(row)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={onRecordPayment}
        className="btn-confirm-active w-full rounded-xl py-4 text-sm font-bold sm:w-auto sm:min-w-[240px]"
      >
        Record Another Payment
      </button>

      <PaymentDetailModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}
