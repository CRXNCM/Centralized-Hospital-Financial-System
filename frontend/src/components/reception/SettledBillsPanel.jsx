import { useState } from "react";
import { BILL_STATUS } from "../../data/receptionBillStore";
import { formatEtb } from "../../data/receptionBills";
import { useReceptionBills } from "../../context/ReceptionBillsContext";
import BillStatusBadge from "./BillStatusBadge";

function VoidConfirmModal({ bill, onConfirm, onCancel }) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/60"
        aria-label="Close"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[rgba(34,211,238,0.25)] bg-[#0A1628] p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white">Void payment?</h3>
        <p className="mt-2 text-sm text-[#94A3B8]">
          This marks <span className="text-white">{bill.patientName}</span> ({bill.billId}) as{" "}
          <span className="font-medium text-[#94A3B8]">Void</span>. The original payment stays in
          the audit log.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#F43F5E] px-4 py-3 text-sm font-bold text-white hover:bg-[#fb7185]"
          >
            Void payment
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[rgba(34,211,238,0.3)] px-4 py-3 text-sm font-semibold text-[#22D3EE]"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default function SettledBillsPanel() {
  const { settledBills, auditLog, voidPayment, restoreToUnpaid } = useReceptionBills();
  const [voidTarget, setVoidTarget] = useState(null);

  if (settledBills.length === 0 && auditLog.length === 0) {
    return null;
  }

  function getLatestPayment(bill) {
    return auditLog.find(
      (r) =>
        r.type === "payment" &&
        r.billInternalId === bill.id &&
        r.status === BILL_STATUS.PAID,
    );
  }

  return (
    <section className="glass-card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Paid & voided bills</h2>
        <p className="mt-0.5 text-xs text-[#94A3B8]">
          Void keeps the payment on record. Restore to unpaid reopens the bill for payment.
        </p>
      </div>

      {settledBills.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#64748B]">No paid or voided bills yet.</p>
      ) : (
        <ul className="space-y-2">
          {settledBills.map((bill) => {
            const payment = getLatestPayment(bill);
            return (
              <li
                key={bill.id}
                className="flex flex-col gap-3 rounded-xl border border-[rgba(34,211,238,0.1)] bg-[rgba(17,34,64,0.4)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white">{bill.patientName}</p>
                    <BillStatusBadge status={bill.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    {bill.billId} · {bill.service}
                    {payment ? ` · ${payment.method} · ${formatEtb(payment.amount)}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {bill.status === BILL_STATUS.PAID && (
                    <button
                      type="button"
                      onClick={() => setVoidTarget(bill)}
                      className="rounded-lg border border-[rgba(244,63,94,0.4)] px-3 py-2 text-xs font-semibold text-[#F43F5E] hover:bg-[rgba(244,63,94,0.1)]"
                    >
                      Void payment
                    </button>
                  )}
                  {bill.status === BILL_STATUS.VOID && (
                    <button
                      type="button"
                      onClick={() => restoreToUnpaid(bill.id)}
                      className="rounded-lg border border-[rgba(245,158,11,0.4)] px-3 py-2 text-xs font-semibold text-[#F59E0B] hover:bg-[rgba(245,158,11,0.1)]"
                    >
                      Restore to unpaid
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {voidTarget && (
        <VoidConfirmModal
          bill={voidTarget}
          onCancel={() => setVoidTarget(null)}
          onConfirm={() => {
            voidPayment(voidTarget.id);
            setVoidTarget(null);
          }}
        />
      )}
    </section>
  );
}


