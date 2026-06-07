import { useCallback, useEffect, useRef, useState } from "react";
import {
  DATE_FORMAT_OPTIONS,
  LANGUAGE_OPTIONS,
  SESSION_TIMEOUT_OPTIONS,
  SYSTEM_INFO,
  createInitialGeneralSettings,
} from "../../data/adminGeneralSettings";
import AdminToast from "./AdminToast";
import ConfirmActionModal from "./ConfirmActionModal";
import StatusToggle from "./StatusToggle";

function SettingsRow({ label, description, children, badge }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(34,211,238,0.08)] py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-white">{label}</p>
          {badge && (
            <span className="rounded-md bg-[rgba(245,158,11,0.15)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F59E0B]">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-xs text-[#94A3B8]">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function FormField({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]";

export default function GeneralSystemSettings() {
  const [settings, setSettings] = useState(createInitialGeneralSettings);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = useCallback((message) => setToast(message), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (settings.hospital.logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(settings.hospital.logoPreview);
      }
    };
  }, [settings.hospital.logoPreview]);

  function updateHospital(field, value) {
    setSettings((prev) => ({
      ...prev,
      hospital: { ...prev.hospital, [field]: value },
    }));
  }

  function updatePreference(field, value) {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  }

  function updateSecurity(field, value) {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [field]: value },
    }));
  }

  function handleLogoFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, or SVG)");
      return;
    }
    const url = URL.createObjectURL(file);
    setSettings((prev) => {
      if (prev.hospital.logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.hospital.logoPreview);
      }
      return {
        ...prev,
        hospital: { ...prev.hospital, logoPreview: url },
      };
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    showToast("Hospital profile saved successfully");
  }

  function handleSaveAll(e) {
    e.preventDefault();
    showToast("System settings saved successfully");
  }

  function handleForceLogout() {
    setConfirmAction(null);
    showToast("All active sessions have been logged out");
  }

  function handleResetPasswords() {
    setConfirmAction(null);
    showToast("Password reset emails sent to all users");
  }

  const { hospital, preferences, security } = settings;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <form onSubmit={handleSaveProfile} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Hospital Profile</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Hospital identity shown on receipts, reports, and the portal
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField label="Hospital Name" id="hospital-name">
            <input
              id="hospital-name"
              type="text"
              value={hospital.name}
              onChange={(e) => updateHospital("name", e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Email" id="hospital-email">
            <input
              id="hospital-email"
              type="email"
              value={hospital.email}
              onChange={(e) => updateHospital("email", e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Address" id="hospital-address">
            <input
              id="hospital-address"
              type="text"
              value={hospital.address}
              onChange={(e) => updateHospital("address", e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Phone Number" id="hospital-phone">
            <input
              id="hospital-phone"
              type="tel"
              value={hospital.phone}
              onChange={(e) => updateHospital("phone", e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-white">Logo upload</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoFile(file);
              e.target.value = "";
            }}
          />
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`mt-2 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
              dragOver
                ? "border-[#22D3EE] bg-[rgba(34,211,238,0.08)]"
                : "border-[rgba(34,211,238,0.25)] bg-[rgba(5,13,26,0.35)] hover:border-[rgba(34,211,238,0.45)]"
            }`}
          >
            {hospital.logoPreview ? (
              <img
                src={hospital.logoPreview}
                alt="Hospital logo preview"
                className="max-h-24 max-w-full object-contain"
              />
            ) : (
              <>
                <p className="text-sm font-medium text-[#22D3EE]">
                  Drag and drop your logo here
                </p>
                <p className="mt-1 text-xs text-[#64748B]">or click to browse — PNG, JPG, SVG</p>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-landing-cyan mt-6 rounded-xl px-6 py-2.5 text-sm font-bold text-white"
        >
          Save Changes
        </button>
      </form>

      <form onSubmit={handleSaveAll} className="space-y-6">
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">General Settings</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Portal behavior and display preferences</p>
          <div className="mt-4">
            <SettingsRow label="Dark mode" description="Hospital portal theme">
              <StatusToggle
                active={preferences.darkMode}
                onChange={() => {}}
                disabled
              />
            </SettingsRow>
            <SettingsRow label="Show ETB currency symbol">
              <StatusToggle
                active={preferences.showEtbSymbol}
                onChange={(on) => updatePreference("showEtbSymbol", on)}
              />
            </SettingsRow>
            <SettingsRow label="Enable patient search autocomplete">
              <StatusToggle
                active={preferences.patientSearchAutocomplete}
                onChange={(on) => updatePreference("patientSearchAutocomplete", on)}
              />
            </SettingsRow>
            <SettingsRow label="Require payment confirmation step">
              <StatusToggle
                active={preferences.requirePaymentConfirmation}
                onChange={(on) => updatePreference("requirePaymentConfirmation", on)}
              />
            </SettingsRow>
            <SettingsRow label="Allow partial payments">
              <StatusToggle
                active={preferences.allowPartialPayments}
                onChange={(on) => updatePreference("allowPartialPayments", on)}
              />
            </SettingsRow>
            <SettingsRow label="Show failed transactions in dashboard">
              <StatusToggle
                active={preferences.showFailedTransactions}
                onChange={(on) => updatePreference("showFailedTransactions", on)}
              />
            </SettingsRow>
            <SettingsRow label="Default date format">
              <select
                value={preferences.dateFormat}
                onChange={(e) => updatePreference("dateFormat", e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
              >
                {DATE_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </SettingsRow>
            <SettingsRow label="Default language">
              <select
                value={preferences.language}
                onChange={(e) => updatePreference("language", e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </SettingsRow>
            <SettingsRow label="Session timeout">
              <select
                value={preferences.sessionTimeout}
                onChange={(e) => updatePreference("sessionTimeout", e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
              >
                {SESSION_TIMEOUT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </SettingsRow>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">Security & Access</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Authentication and account protection</p>
          <div className="mt-4">
            <SettingsRow label="Require password change every 90 days">
              <StatusToggle
                active={security.passwordChange90Days}
                onChange={(on) => updateSecurity("passwordChange90Days", on)}
              />
            </SettingsRow>
            <SettingsRow label="Lock account after 5 failed login attempts">
              <StatusToggle
                active={security.lockAfterFailedAttempts}
                onChange={(on) => updateSecurity("lockAfterFailedAttempts", on)}
              />
            </SettingsRow>
            <SettingsRow label="Two-factor authentication" badge="Coming soon">
              <StatusToggle
                active={security.twoFactorAuth}
                onChange={(on) => updateSecurity("twoFactorAuth", on)}
                disabled
              />
            </SettingsRow>
            <SettingsRow label="Minimum password length">
              <input
                type="number"
                min={6}
                max={32}
                value={security.minPasswordLength}
                onChange={(e) =>
                  updateSecurity("minPasswordLength", Number(e.target.value) || 8)
                }
                className="w-20 rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-3 py-2.5 text-center text-sm font-semibold text-[#22D3EE] outline-none focus:border-[#22D3EE]"
              />
            </SettingsRow>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setConfirmAction({
                  type: "logout",
                  title: "Force logout all sessions?",
                  message:
                    "This will immediately sign out every user currently logged into the hospital portal. They will need to sign in again.",
                  confirmLabel: "Logout all",
                })
              }
              className="rounded-xl border-2 border-[#F43F5E] px-5 py-2.5 text-sm font-semibold text-[#F43F5E] transition-colors hover:bg-[rgba(244,63,94,0.1)]"
            >
              Force logout all active sessions
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmAction({
                  type: "reset",
                  title: "Reset all user passwords?",
                  message:
                    "Every staff account will receive a password reset email. Users must set a new password before their next login.",
                  confirmLabel: "Reset passwords",
                  confirmClassName:
                    "rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-[#050D1A] hover:bg-[#fbbf24]",
                })
              }
              className="rounded-xl border-2 border-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#F59E0B] transition-colors hover:bg-[rgba(245,158,11,0.1)]"
            >
              Reset all user passwords
            </button>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">About This System</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Read-only system information</p>
          <dl className="mt-5 space-y-4 rounded-xl border border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.35)] p-5">
            {[
              ["System Name", SYSTEM_INFO.systemName],
              ["Version", SYSTEM_INFO.version],
              ["Developed by", SYSTEM_INFO.developedBy],
              ["Hospital", SYSTEM_INFO.hospital],
              ["Last Updated", SYSTEM_INFO.lastUpdated],
              ["Support Contact", SYSTEM_INFO.supportContact],
              ["Support Phone", SYSTEM_INFO.supportPhone],
            ].map(([term, value]) => (
              <div key={term} className="border-b border-[rgba(34,211,238,0.06)] pb-4 last:border-0 last:pb-0">
                <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  {term}
                </dt>
                <dd className="mt-1 text-sm text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <button
          type="submit"
          className="btn-landing-cyan w-full rounded-xl py-3.5 text-sm font-bold text-white sm:w-auto sm:min-w-[200px]"
        >
          Save Settings
        </button>
      </form>

      <ConfirmActionModal
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.confirmLabel}
        confirmClassName={confirmAction?.confirmClassName}
        onConfirm={
          confirmAction?.type === "reset" ? handleResetPasswords : handleForceLogout
        }
        onCancel={() => setConfirmAction(null)}
      />

      <AdminToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
