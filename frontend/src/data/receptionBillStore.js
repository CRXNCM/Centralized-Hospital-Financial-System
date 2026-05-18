/** Bill statuses for reception workflow */
export const BILL_STATUS = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  VOID: "Void",
};

/** Display status on today's payments table */
export const PAYMENT_DISPLAY_STATUS = {
  PAID: "Paid",
  PENDING: "Pending",
};

export const RECEPTIONIST_NAME = "Tigist";

/** Reception confirm screen verifies the payment — always Paid when recorded here. */
function verificationStatusForReceptionRecord() {
  return PAYMENT_DISPLAY_STATUS.PAID;
}

const INITIAL_BILLS = [
  { id: "bill-1001", billId: "BILL-1001", patientName: "Abebe Girma", service: "Consultation", amount: 500 },
  { id: "bill-1002", billId: "BILL-1002", patientName: "Fatuma Ali", service: "Laboratory", amount: 1200 },
  { id: "bill-1003", billId: "BILL-1003", patientName: "Daniel Tesfaye", service: "X-Ray", amount: 800 },
  { id: "bill-1004", billId: "BILL-1004", patientName: "Meron Haile", service: "Pharmacy", amount: 350 },
  { id: "bill-1005", billId: "BILL-1005", patientName: "Yonas Bekele", service: "Consultation", amount: 500 },
  { id: "bill-1006", billId: "BILL-1006", patientName: "Hiwot Tadesse", service: "Laboratory", amount: 1500 },
  { id: "bill-1007", billId: "BILL-1007", patientName: "Selam Desta", service: "Consultation", amount: 500 },
  { id: "bill-1008", billId: "BILL-1008", patientName: "Bereket Alemu", service: "Pharmacy", amount: 350 },
  { id: "bill-1009", billId: "BILL-1009", patientName: "Tigist Worku", service: "X-Ray", amount: 800 },
  { id: "bill-1010", billId: "BILL-1010", patientName: "Dawit Mekonnen", service: "Laboratory", amount: 1200 },
  { id: "bill-1011", billId: "BILL-1011", patientName: "Hanna Solomon", service: "Surgery Prep", amount: 3500 },
  { id: "bill-1012", billId: "BILL-1012", patientName: "Kidus Alemayehu", service: "Consultation", amount: 500 },
];

let recordCounter = 1;

export function createInitialBills() {
  return INITIAL_BILLS.map((b) => ({
    ...b,
    status: BILL_STATUS.UNPAID,
    lastPaymentRecordId: null,
  }));
}

function nowIso() {
  return new Date().toISOString();
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatTimestamp(date = new Date()) {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function generateTransactionId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `TXN-${y}${m}${d}-${h}${min}`;
}

function isToday(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/** Payment audit entries recorded today by this receptionist, newest first. */
export function getTodaysPayments(auditLog, recordedBy = RECEPTIONIST_NAME) {
  return auditLog
    .filter(
      (r) =>
        r.type === "payment" &&
        isToday(r.recordedAt) &&
        (!recordedBy || r.recordedBy === recordedBy),
    )
    .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
}

export function filterBillsByQuery(bills, query = "") {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return bills;
  return bills.filter(
    (b) =>
      b.patientName.toLowerCase().includes(q) ||
      b.billId.toLowerCase().includes(q),
  );
}

export function recordBillPayment(bills, auditLog, { bill, method, methodId, amount }) {
  const paymentId = `PAY-${String(++recordCounter).padStart(5, "0")}`;
  const at = nowIso();
  const recordedDate = new Date(at);
  const transactionId = generateTransactionId(recordedDate);

  const paymentRecord = {
    id: paymentId,
    transactionId,
    type: "payment",
    billId: bill.billId,
    billInternalId: bill.id,
    patientName: bill.patientName,
    service: bill.service,
    billAmount: bill.amount,
    amount,
    method,
    methodId,
    status: BILL_STATUS.PAID,
    verificationStatus: verificationStatusForReceptionRecord(),
    recordedAt: at,
    timestamp: formatTimestamp(recordedDate),
    time: formatTime(recordedDate),
    recordedBy: "Reception Staff",
    notes: "Payment recorded and verified at reception.",
  };

  const nextBills = bills.map((b) =>
    b.id === bill.id
      ? {
          ...b,
          status: BILL_STATUS.PAID,
          lastPaymentRecordId: paymentId,
          paidAt: at,
          voidedAt: null,
        }
      : b,
  );

  return {
    bills: nextBills,
    auditLog: [paymentRecord, ...auditLog],
    paymentRecord,
  };
}

export function voidBillPayment(bills, auditLog, billId) {
  const bill = bills.find((b) => b.id === billId);
  if (!bill || bill.status !== BILL_STATUS.PAID) {
    return { bills, auditLog, voidRecord: null };
  }

  const voidId = `VOID-${String(++recordCounter).padStart(5, "0")}`;
  const at = nowIso();
  const originalPayment = auditLog.find((r) => r.id === bill.lastPaymentRecordId);

  const voidRecord = {
    id: voidId,
    type: "void",
    billId: bill.billId,
    billInternalId: bill.id,
    patientName: bill.patientName,
    service: bill.service,
    billAmount: bill.amount,
    amount: originalPayment?.amount ?? bill.amount,
    method: originalPayment?.method ?? "—",
    methodId: originalPayment?.methodId ?? null,
    status: BILL_STATUS.VOID,
    relatedPaymentId: bill.lastPaymentRecordId,
    recordedAt: at,
    time: formatTime(new Date(at)),
    recordedBy: "Reception Staff",
    notes: "Payment voided — original payment retained in audit log.",
  };

  const nextBills = bills.map((b) =>
    b.id === billId
      ? { ...b, status: BILL_STATUS.VOID, voidedAt: at }
      : b,
  );

  return {
    bills: nextBills,
    auditLog: [voidRecord, ...auditLog],
    voidRecord,
  };
}

export function restoreBillToUnpaid(bills, auditLog, billId) {
  const bill = bills.find((b) => b.id === billId);
  if (!bill || bill.status !== BILL_STATUS.VOID) {
    return { bills, auditLog, restoreRecord: null };
  }

  const restoreId = `RST-${String(++recordCounter).padStart(5, "0")}`;
  const at = nowIso();

  const restoreRecord = {
    id: restoreId,
    type: "restore",
    billId: bill.billId,
    billInternalId: bill.id,
    patientName: bill.patientName,
    service: bill.service,
    billAmount: bill.amount,
    amount: bill.amount,
    method: "—",
    methodId: null,
    status: BILL_STATUS.UNPAID,
    relatedPaymentId: bill.lastPaymentRecordId,
    recordedAt: at,
    time: formatTime(new Date(at)),
    recordedBy: "Reception Staff",
    notes: "Bill restored to unpaid — prior payment and void entries kept on record.",
  };

  const nextBills = bills.map((b) =>
    b.id === billId
      ? {
          ...b,
          status: BILL_STATUS.UNPAID,
          lastPaymentRecordId: null,
          paidAt: null,
          voidedAt: null,
        }
      : b,
  );

  return {
    bills: nextBills,
    auditLog: [restoreRecord, ...auditLog],
    restoreRecord,
  };
}
