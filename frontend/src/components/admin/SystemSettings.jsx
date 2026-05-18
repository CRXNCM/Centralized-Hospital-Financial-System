import { useState } from "react";
import {
  PAYMENT_CATEGORIES,
  PAYMENT_METHODS,
} from "../../data/paymentMethods";

function buildInitialEnabled() {
  return Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, true]));
}

export default function SystemSettings() {
  const [hospitalName, setHospitalName] = useState("Central City Hospital");
  const [enabledMethods, setEnabledMethods] = useState(buildInitialEnabled);
  const [autoVerify, setAutoVerify] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleMethod(id) {
    setEnabledMethods((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const grouped = Object.values(PAYMENT_CATEGORIES).map((cat) => ({
    ...cat,
    methods: PAYMENT_METHODS.filter((m) => m.category === cat.id),
  }));

  return (
    <div className="flex justify-center p-8">
      <form onSubmit={handleSave} className="w-full max-w-2xl space-y-6">
        {saved && (
          <div className="payment-success rounded-xl px-4 py-3 text-center text-sm font-semibold text-[#10B981]">
            Settings saved successfully
          </div>
        )}

        <section className="glass-card p-6">
          <h2 className="font-semibold text-white">Hospital Information</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Basic hospital profile</p>
          <label className="mt-4 block">
            <span className="text-sm text-[#94A3B8]">Hospital Name</span>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-4 py-3 text-white outline-none focus:border-[#22D3EE]"
            />
          </label>
        </section>

        <section className="glass-card p-6">
          <h2 className="font-semibold text-white">Payment Methods</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Enable or disable cash, mobile money, and Ethiopian bank wallets
          </p>
          <div className="mt-4 max-h-[420px] space-y-5 overflow-y-auto pr-1">
            {grouped.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#22D3EE]">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.methods.map((method) => (
                    <label
                      key={method.id}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-[rgba(34,211,238,0.1)] px-4 py-3"
                    >
                      <div>
                        <span className="text-white">{method.label}</span>
                        {method.bank && (
                          <p className="text-xs text-[#64748B]">{method.bank}</p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledMethods[method.id]}
                        onChange={() => toggleMethod(method.id)}
                        className="h-4 w-4 shrink-0 accent-[#22D3EE]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="font-semibold text-white">Advanced Options</h2>
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-4">
            <div>
              <span className="text-white">Auto-verify digital payments</span>
              <p className="text-sm text-[#94A3B8]">
                Automatically mark Telebirr, eBirr, and bank mobile payments as verified
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoVerify}
              onChange={(e) => setAutoVerify(e.target.checked)}
              className="h-4 w-4 shrink-0 accent-[#22D3EE]"
            />
          </label>
        </section>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#22D3EE] py-3.5 text-sm font-bold text-[#050D1A] shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:bg-[#67E8F9]"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
