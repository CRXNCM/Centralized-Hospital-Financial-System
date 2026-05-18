import { useCallback, useEffect, useState } from "react";
import {
  ALERT_RULES,
  NOTIFICATION_HISTORY,
  createInitialNotificationSettings,
} from "../../data/adminNotifications";
import AdminToast from "./AdminToast";
import StatusToggle from "./StatusToggle";

const HISTORY_COLUMNS = ["Timestamp", "Alert Type", "Detail", "Recipient"];

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

function recipientStyle(recipient) {
  if (recipient === "System") return "text-[#94A3B8]";
  if (recipient.includes("Manager")) return "text-[#22D3EE]";
  return "text-[#94A3B8]";
}

export default function NotificationsAlerts() {
  const [settings, setSettings] = useState(createInitialNotificationSettings);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => setToast(message), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function toggleRule(ruleId, enabled) {
    setSettings((prev) => ({
      ...prev,
      rules: { ...prev.rules, [ruleId]: enabled },
    }));
  }

  function updateThreshold(key, value) {
    setSettings((prev) => ({
      ...prev,
      thresholds: { ...prev.thresholds, [key]: value },
    }));
  }

  function updateDelivery(field, value) {
    setSettings((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, [field]: value },
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    showToast("Notification settings saved successfully");
  }

  const { rules, thresholds, delivery } = settings;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <form onSubmit={handleSave} className="space-y-6">
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">Active Alert Rules</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Configure when the system sends alerts to staff and managers
          </p>

          <ul className="mt-5 space-y-3">
            {ALERT_RULES.map((rule) => {
              const enabled = rules[rule.id] ?? false;
              return (
                <li
                  key={rule.id}
                  className={`rounded-xl border px-4 py-3.5 transition-colors ${
                    enabled
                      ? "border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)]"
                      : "border-[rgba(71,85,105,0.4)] bg-[rgba(5,13,26,0.35)]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {rule.label}
                        {rule.hasThreshold && rule.suffix && enabled && (
                          <span className="text-[#94A3B8]"> {rule.suffix}</span>
                        )}
                      </p>
                      {rule.hasThreshold && enabled && (
                        <input
                          type="number"
                          min={rule.thresholdType === "hours" ? 1 : 0}
                          step={rule.thresholdType === "hours" ? 1 : 500}
                          value={thresholds[rule.thresholdKey]}
                          onChange={(e) =>
                            updateThreshold(
                              rule.thresholdKey,
                              Number(e.target.value) || rule.defaultThreshold,
                            )
                          }
                          className="w-24 rounded-lg border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-2.5 py-1.5 text-right text-sm font-semibold text-[#22D3EE] outline-none focus:border-[#22D3EE]"
                          aria-label={`Threshold for ${rule.label}`}
                        />
                      )}
                      {rule.hasThreshold &&
                        enabled &&
                        rule.thresholdType === "currency" && (
                          <span className="text-xs text-[#94A3B8]">ETB</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          enabled ? "text-[#10B981]" : "text-[#64748B]"
                        }`}
                      >
                        {enabled ? "ON" : "OFF"}
                      </span>
                      <StatusToggle
                        active={enabled}
                        onChange={(on) => toggleRule(rule.id, on)}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">How Alerts Are Delivered</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Choose channels for alert delivery and scheduled summaries
          </p>
          <div className="mt-4">
            <SettingsRow
              label="In-app notifications"
              description="Always enabled for all admin and manager sessions"
            >
              <StatusToggle
                active={delivery.inApp}
                onChange={() => {}}
                disabled
              />
            </SettingsRow>
            <SettingsRow label="Email notifications to Manager">
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                <input
                  type="email"
                  value={delivery.managerEmail}
                  onChange={(e) => updateDelivery("managerEmail", e.target.value)}
                  disabled={!delivery.emailEnabled}
                  className="w-full min-w-[200px] rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE] disabled:opacity-50 sm:w-64"
                  placeholder="manager@hospital.et"
                />
                <StatusToggle
                  active={delivery.emailEnabled}
                  onChange={(on) => updateDelivery("emailEnabled", on)}
                />
              </div>
            </SettingsRow>
            <SettingsRow
              label="SMS alerts for critical errors"
              description="Failed backups, verification failures, and channel outages"
            >
              <StatusToggle
                active={delivery.smsCritical}
                onChange={(on) => updateDelivery("smsCritical", on)}
              />
            </SettingsRow>
            <SettingsRow label="Daily summary notification">
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                <input
                  type="time"
                  value={delivery.dailySummaryTime}
                  onChange={(e) => updateDelivery("dailySummaryTime", e.target.value)}
                  disabled={!delivery.dailySummary}
                  className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE] disabled:opacity-50"
                  aria-label="Daily summary time"
                />
                <StatusToggle
                  active={delivery.dailySummary}
                  onChange={(on) => updateDelivery("dailySummary", on)}
                />
              </div>
            </SettingsRow>
          </div>
        </section>

        <section className="glass-card overflow-hidden">
          <div className="border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
            <h2 className="text-lg font-semibold text-white">Notification History</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Recent alerts sent by the system</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                  {HISTORY_COLUMNS.map((col) => (
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
                {NOTIFICATION_HISTORY.map((row) => (
                  <tr
                    key={row.id}
                    className="table-row-hover border-b border-[rgba(34,211,238,0.06)]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[#94A3B8]">
                      {row.timestamp}
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{row.alertType}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#CBD5E1]">{row.detail}</td>
                    <td
                      className={`px-5 py-4 text-sm font-medium ${recipientStyle(row.recipient)}`}
                    >
                      {row.recipient}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <button
          type="submit"
          className="btn-landing-cyan w-full rounded-xl py-3.5 text-sm font-bold text-white sm:w-auto sm:min-w-[200px]"
        >
          Save Settings
        </button>
      </form>

      <AdminToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
