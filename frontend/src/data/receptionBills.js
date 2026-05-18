/** Unpaid bills available for reception payment (demo). */

export const RECEPTION_BILLS = [
  {
    id: "bill-1001",
    billId: "BILL-1001",
    patientName: "Abebe Girma",
    service: "Consultation",
    amount: 500,
    status: "Unpaid",
  },
  {
    id: "bill-1002",
    billId: "BILL-1002",
    patientName: "Fatuma Ali",
    service: "Laboratory",
    amount: 1200,
    status: "Unpaid",
  },
  {
    id: "bill-1003",
    billId: "BILL-1003",
    patientName: "Daniel Tesfaye",
    service: "X-Ray",
    amount: 800,
    status: "Unpaid",
  },
  {
    id: "bill-1004",
    billId: "BILL-1004",
    patientName: "Meron Haile",
    service: "Pharmacy",
    amount: 350,
    status: "Unpaid",
  },
  {
    id: "bill-1005",
    billId: "BILL-1005",
    patientName: "Yonas Bekele",
    service: "Consultation",
    amount: 500,
    status: "Unpaid",
  },
  {
    id: "bill-1006",
    billId: "BILL-1006",
    patientName: "Hiwot Tadesse",
    service: "Laboratory",
    amount: 1500,
    status: "Unpaid",
  },
  {
    id: "bill-1007",
    billId: "BILL-1007",
    patientName: "Selam Desta",
    service: "Consultation",
    amount: 500,
    status: "Unpaid",
  },
  {
    id: "bill-1008",
    billId: "BILL-1008",
    patientName: "Bereket Alemu",
    service: "Pharmacy",
    amount: 350,
    status: "Unpaid",
  },
  {
    id: "bill-1009",
    billId: "BILL-1009",
    patientName: "Tigist Worku",
    service: "X-Ray",
    amount: 800,
    status: "Unpaid",
  },
  {
    id: "bill-1010",
    billId: "BILL-1010",
    patientName: "Dawit Mekonnen",
    service: "Laboratory",
    amount: 1200,
    status: "Unpaid",
  },
  {
    id: "bill-1011",
    billId: "BILL-1011",
    patientName: "Hanna Solomon",
    service: "Surgery Prep",
    amount: 3500,
    status: "Unpaid",
  },
  {
    id: "bill-1012",
    billId: "BILL-1012",
    patientName: "Kidus Alemayehu",
    service: "Consultation",
    amount: 500,
    status: "Unpaid",
  },
];

export function searchReceptionBills(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return RECEPTION_BILLS.filter(
    (bill) =>
      bill.patientName.toLowerCase().includes(q) ||
      bill.billId.toLowerCase().includes(q),
  );
}

/** All unpaid bills, optionally filtered by the search query. */
export function listUnpaidBills(query = "") {
  const q = query.trim().toLowerCase();
  if (!q) return RECEPTION_BILLS;
  return searchReceptionBills(query);
}

export function formatEtb(amount) {
  return `ETB ${Number(amount).toLocaleString()}`;
}
