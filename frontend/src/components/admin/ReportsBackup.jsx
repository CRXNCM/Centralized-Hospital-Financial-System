import { useCallback, useEffect, useState } from "react";
import {
  BACKUP_FREQUENCY_OPTIONS,
  REPORT_TYPES,
  createInitialReportsBackupSettings,
} from "../../data/adminReportsBackup";
import { delay, randomLoadingMs } from "../../utils/generateReport";
import { IconBarChart, IconShield, IconUsers } from "../icons";
import AdminToast from "./AdminToast";
import ReportDateRangeModal from "./ReportDateRangeModal";
import StatusToggle from "./StatusToggle";

const REPORT_ICONS = {
  financial: IconBarChart,
  activity: IconUsers,
  audit: IconShield,
};

function SettingsRow({ label, description, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(34,211,238,0.08)] py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#94A3B8]">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <svg
        className="h-12 w-12 animate-spin text-[#22D3EE]"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-sm font-medium text-white">{label}</p>
    </div>
  );
}

export default function ReportsBackup() {
  const [settings, setSettings] = useState(createInitialReportsBackupSettings);
  const [pendingReport, setPendingReport] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [backupRunning, setBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => setToast(message), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function updateScheduled(field, value) {
    setSettings((prev) => ({
      ...prev,
      scheduled: { ...prev.scheduled, [field]: value },
    }));
  }

  function updateBackup(field, value) {
    setSettings((prev) => ({
      ...prev,
      backup: { ...prev.backup, [field]: value },
    }));
  }

  async function handleReportGenerate({ dateFrom, dateTo }) {
    const report = pendingReport;
    setPendingReport(null);
    if (!report) return;

    setGenerating(report.title);
    await delay(randomLoadingMs());
    setGenerating(null);
    showToast(
      `${report.title} generated successfully (${dateFrom} to ${dateTo})`,
    );
  }

  async function handleManualBackup() {
    if (backupRunning) return;
    setBackupRunning(true);
    setBackupProgress(0);
    setBackupSuccess(false);

    const steps = 20;
    const stepMs = 80;
    for (let i = 1; i <= steps; i += 1) {
      await delay(stepMs);
      setBackupProgress(Math.round((i / steps) * 100));
    }

    setBackupRunning(false);
    setBackupSuccess(true);
    showToast("Backup completed successfully");

    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setSettings((prev) => ({
      ...prev,
      lastBackup: { label: `${formatted} — Successful`, status: "success" },
    }));
  }

  const { scheduled, backup, lastBackup, nextBackup } = settings;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Generate System Reports</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Export hospital-wide reports for finance, compliance, and operations
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {REPORT_TYPES.map((report) => {
            const Icon = REPORT_ICONS[report.id] ?? IconBarChart;
            return (
              <article
                key={report.id}
                className={`flex flex-col rounded-xl border border-[rgba(34,211,238,0.12)] bg-[rgba(5,13,26,0.35)] p-5 transition-colors ${report.borderHover}`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${report.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${report.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-white">{report.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#94A3B8]">
                  {report.description}
                </p>
                <button
                  type="button"
                  disabled={Boolean(generating)}
                  onClick={() => setPendingReport(report)}
                  className="btn-landing-cyan mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  Generate
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Scheduled Reports</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Automate report delivery to hospital leadership
        </p>
        <div className="mt-5">
          <SettingsRow
            label="Auto-generate daily report at end of day"
            description="Sent after the last reception shift closes"
          >
            <StatusToggle
              active={scheduled.dailyReport}
              onChange={(on) => updateScheduled("dailyReport", on)}
            />
          </SettingsRow>
          <SettingsRow
            label="Auto-generate monthly report on 1st of each month"
            description="Includes full prior-month financial and audit summary"
          >
            <StatusToggle
              active={scheduled.monthlyReport}
              onChange={(on) => updateScheduled("monthlyReport", on)}
            />
          </SettingsRow>
          <SettingsRow label="Send report to" description="Manager notification email">
            <input
              type="email"
              value={scheduled.sendToEmail}
              onChange={(e) => updateScheduled("sendToEmail", e.target.value)}
              className="w-full min-w-[220px] rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE] sm:w-72"
              placeholder="manager@hospital.et"
            />
          </SettingsRow>
          <SettingsRow label="Email report automatically">
            <StatusToggle
              active={scheduled.emailAutomatically}
              onChange={(on) => updateScheduled("emailAutomatically", on)}
            />
          </SettingsRow>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Data Backup</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Protect transaction records, user data, and system configuration
        </p>

        <div className="mt-5 space-y-4 rounded-xl border border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.35)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Last backup
            </p>
            <p className="mt-1 text-sm font-semibold text-[#10B981]">{lastBackup.label}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Next scheduled backup
            </p>
            <p className="mt-1 text-sm text-white">{nextBackup}</p>
          </div>

          {backupRunning && (
            <div className="pt-2">
              <div className="mb-2 flex justify-between text-xs text-[#94A3B8]">
                <span>Running backup…</span>
                <span>{backupProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(71,85,105,0.5)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#22D3EE] to-[#10B981] transition-all duration-150"
                  style={{ width: `${backupProgress}%` }}
                />
              </div>
            </div>
          )}

          {backupSuccess && !backupRunning && (
            <p className="text-sm font-semibold text-[#10B981]" role="status">
              Backup completed successfully
            </p>
          )}

          <button
            type="button"
            onClick={handleManualBackup}
            disabled={backupRunning}
            className="btn-landing-cyan rounded-xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            Run Backup Now
          </button>
        </div>

        <div className="mt-6">
          <SettingsRow label="Automatic daily backup">
            <StatusToggle
              active={backup.automaticDaily}
              onChange={(on) => updateBackup("automaticDaily", on)}
            />
          </SettingsRow>
          <SettingsRow label="Backup frequency">
            <select
              value={backup.frequency}
              onChange={(e) => updateBackup("frequency", e.target.value)}
              className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
              aria-label="Backup frequency"
            >
              {BACKUP_FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsRow>
          <SettingsRow label="Backup retention period">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={365}
                value={backup.retentionDays}
                onChange={(e) =>
                  updateBackup("retentionDays", Number(e.target.value) || 30)
                }
                className="w-20 rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="Retention days"
              />
              <span className="text-sm text-[#94A3B8]">days</span>
            </div>
          </SettingsRow>
        </div>
      </section>

      <ReportDateRangeModal
        reportTitle={pendingReport?.title ?? null}
        onClose={() => setPendingReport(null)}
        onGenerate={handleReportGenerate}
      />

      {generating && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(2,8,20,0.85)] backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm rounded-2xl border border-[rgba(34,211,238,0.2)] p-8 text-center">
            <Spinner label={`Generating ${generating}…`} />
          </div>
        </div>
      )}

      <AdminToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
