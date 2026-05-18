import { TRANSACTION_HISTORY } from "./managerMockData";

function formatEtb(amount) {
  return `ETB ${amount.toLocaleString()}`;
}

export function buildPatientProfiles(transactions) {
  const byName = new Map();

  for (const tx of transactions) {
    if (!byName.has(tx.patient)) {
      byName.set(tx.patient, {
        name: tx.patient,
        patientId: tx.patientId,
        payments: [],
      });
    }
    byName.get(tx.patient).payments.push(tx);
  }

  return Array.from(byName.values()).map((entry) => {
    const payments = [...entry.payments].sort((a, b) => b.timestamp - a.timestamp);
    const totalPaidLifetime = payments.reduce(
      (sum, t) =>
        sum + (t.status === "Paid" || t.status === "Verified" ? t.amountPaid : 0),
      0,
    );
    const outstandingBalance = payments.reduce(
      (sum, t) => sum + (t.status === "Pending" ? t.billAmount - t.amountPaid : 0),
      0,
    );
    const last = payments[0];

    return {
      id: entry.patientId,
      name: entry.name,
      patientId: payments[0].patientId,
      totalVisits: payments.length,
      totalPaidLifetime,
      totalPaidLabel: formatEtb(totalPaidLifetime),
      outstandingBalance,
      outstandingLabel: formatEtb(outstandingBalance),
      lastVisitDate: last?.date ?? "—",
      reliability: outstandingBalance > 0 ? "outstanding" : "good",
      payments,
    };
  });
}

export const PATIENT_PROFILES = buildPatientProfiles(TRANSACTION_HISTORY);

export function searchPatients(query, profiles = PATIENT_PROFILES) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return profiles
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q),
    )
    .slice(0, 8);
}

export function getPatientById(patientId, profiles = PATIENT_PROFILES) {
  return profiles.find(
    (p) => p.patientId === patientId || p.id === patientId,
  );
}
