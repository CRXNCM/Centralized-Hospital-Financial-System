import { useCallback, useEffect, useState } from "react";
import {
  FLAG_AFTER_OPTIONS,
  PAYMENT_CHANNEL_SETTINGS,
  createInitialPaymentSettings,
} from "../../data/adminPaymentSettings";
import { getPaymentMethodIcon } from "../reception/paymentMethodIcon";
import AdminToast from "./AdminToast";
import ConfirmDisableModal from "./ConfirmDisableModal";
import StatusToggle from "./StatusToggle";

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

export default function PaymentSettings() {
  const [settings, setSettings] = useState(createInitialPaymentSettings);
  const [pendingDisable, setPendingDisable] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => setToast(message), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function channelEnabled(id) {
    return settings.channels[id] ?? false;
  }

  function applyChannelToggle(id, enabled) {
    setSettings((prev) => ({
      ...prev,
      channels: { ...prev.channels, [id]: enabled },
    }));
  }

  function handleChannelToggle(channel, nextOn) {
    if (channel.locked) return;
    if (nextOn) {
      applyChannelToggle(channel.id, true);
      return;
    }
    setPendingDisable({ id: channel.id, label: channel.label });
  }

  function confirmDisable() {
    if (pendingDisable) {
      applyChannelToggle(pendingDisable.id, false);
      setPendingDisable(null);
    }
  }

  function updateVerification(field, value) {
    setSettings((prev) => ({
      ...prev,
      verification: { ...prev.verification, [field]: value },
    }));
  }

  function updateReceipt(field, value) {
    setSettings((prev) => ({
      ...prev,
      receipt: { ...prev.receipt, [field]: value },
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    showToast("Payment settings saved successfully");
  }

  const { verification, receipt } = settings;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <form onSubmit={handleSave} className="space-y-6">
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">Active Payment Channels</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Enable channels available at reception. Cash cannot be disabled.
          </p>
          <ul className="mt-5 space-y-3">
            {PAYMENT_CHANNEL_SETTINGS.map((channel) => {
              const enabled = channelEnabled(channel.id);
              const Icon = getPaymentMethodIcon(channel.id);
              return (
                <li
                  key={channel.id}
                  className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
                    enabled
                      ? "border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)]"
                      : "border-[rgba(71,85,105,0.4)] bg-[rgba(5,13,26,0.35)]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        enabled
                          ? "bg-[rgba(34,211,238,0.12)] text-[#22D3EE]"
                          : "bg-[rgba(71,85,105,0.3)] text-[#64748B]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{channel.label}</p>
                      {channel.locked && (
                        <p className="text-xs text-[#94A3B8]">Always enabled</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        enabled ? "text-[#10B981]" : "text-[#64748B]"
                      }`}
                    >
                      {enabled ? "Active" : "Inactive"}
                    </span>
                    <StatusToggle
                      active={enabled}
                      onChange={(on) => handleChannelToggle(channel, on)}
                      disabled={channel.locked}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">Verification Rules</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Control how digital payments are verified automatically
          </p>
          <div className="mt-4">
            <SettingsRow label="Auto-verify Telebirr payments">
              <StatusToggle
                active={verification.autoTelebirr}
                onChange={(on) => updateVerification("autoTelebirr", on)}
              />
            </SettingsRow>
            <SettingsRow label="Auto-verify CBE Birr payments">
              <StatusToggle
                active={verification.autoCbeBirr}
                onChange={(on) => updateVerification("autoCbeBirr", on)}
              />
            </SettingsRow>
            <SettingsRow label="Auto-verify Amole payments">
              <StatusToggle
                active={verification.autoAmole}
                onChange={(on) => updateVerification("autoAmole", on)}
              />
            </SettingsRow>
            <SettingsRow
              label="Require manual approval for amounts above ETB"
              description="Payments above this amount need manager approval"
            >
              <input
                type="number"
                min="0"
                step="100"
                value={verification.manualAboveEtb}
                onChange={(e) => updateVerification("manualAboveEtb", e.target.value)}
                className="w-32 rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-3 py-2 text-right text-sm font-semibold text-[#22D3EE] outline-none focus:border-[#22D3EE]"
              />
            </SettingsRow>
            <SettingsRow label="Flag unverified payments after">
              <select
                value={verification.flagAfterHours}
                onChange={(e) => updateVerification("flagAfterHours", e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-3 py-2 text-sm text-white outline-none focus:border-[#22D3EE]"
              >
                {FLAG_AFTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </SettingsRow>
            <SettingsRow
              label="Send alert for failed verifications"
              description="Notify admin when verification fails"
            >
              <StatusToggle
                active={verification.alertFailed}
                onChange={(on) => updateVerification("alertFailed", on)}
              />
            </SettingsRow>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">Receipt Settings</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Configure printed and digital receipts</p>
          <div className="mt-4">
            <SettingsRow label="Auto-generate receipt after payment">
              <StatusToggle
                active={receipt.autoGenerate}
                onChange={(on) => updateReceipt("autoGenerate", on)}
              />
            </SettingsRow>
            <SettingsRow label="Include hospital logo on receipt">
              <StatusToggle
                active={receipt.includeLogo}
                onChange={(on) => updateReceipt("includeLogo", on)}
              />
            </SettingsRow>
            <div className="pt-4">
              <label htmlFor="receipt-footer" className="text-sm font-medium text-white">
                Receipt footer text
              </label>
              <textarea
                id="receipt-footer"
                rows={3}
                value={receipt.footerText}
                onChange={(e) => updateReceipt("footerText", e.target.value)}
                placeholder="Thank you for choosing Central City Hospital. For inquiries call +251 11 000 0000."
                className="mt-2 w-full resize-none rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.6)] px-4 py-3 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#22D3EE]"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="btn-landing-cyan w-full rounded-xl py-3.5 text-sm font-bold text-white sm:w-auto sm:min-w-[200px]"
        >
          Save Settings
        </button>
      </form>

      <ConfirmDisableModal
        channelLabel={pendingDisable?.label}
        onConfirm={confirmDisable}
        onCancel={() => setPendingDisable(null)}
      />

      <AdminToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}


