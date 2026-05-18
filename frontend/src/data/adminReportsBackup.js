export const REPORT_TYPES = [
  {
    id: "financial",
    title: "Financial Summary Report",
    description:
      "Aggregated payment totals by channel, daily and monthly trends, outstanding balances, and verification status breakdown.",
    iconColor: "text-[#22D3EE]",
    iconBg: "bg-[rgba(34,211,238,0.12)]",
    borderHover: "hover:border-[rgba(34,211,238,0.35)]",
  },
  {
    id: "activity",
    title: "User Activity Report",
    description:
      "Staff login history, session duration, actions performed by role, and inactive account alerts for the selected period.",
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[rgba(245,158,11,0.12)]",
    borderHover: "hover:border-[rgba(245,158,11,0.35)]",
  },
  {
    id: "audit",
    title: "Transaction Audit Report",
    description:
      "Full transaction ledger with TXN IDs, amounts, payment methods, verification outcomes, and flagged exceptions.",
    iconColor: "text-[#10B981]",
    iconBg: "bg-[rgba(16,185,129,0.12)]",
    borderHover: "hover:border-[rgba(16,185,129,0.35)]",
  },
];

export const BACKUP_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function createInitialReportsBackupSettings() {
  return {
    scheduled: {
      dailyReport: true,
      monthlyReport: true,
      sendToEmail: "dawit.bekele@hospital.et",
      emailAutomatically: true,
    },
    backup: {
      automaticDaily: true,
      frequency: "daily",
      retentionDays: 30,
    },
    lastBackup: {
      label: "December 14, 2024 — 11:59 PM — Successful",
      status: "success",
    },
    nextBackup: "December 15, 2024 — 11:59 PM",
  };
}
