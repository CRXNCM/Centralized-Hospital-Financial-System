import { useState } from "react";

export default function ReportDateRangeModal({ reportTitle, onClose, onGenerate }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  if (!reportTitle) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate({ dateFrom, dateTo });
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-range-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(2,8,20,0.75)] backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="modal-panel relative z-10 w-full max-w-md rounded-2xl border border-[rgba(34,211,238,0.25)] bg-[#112240] p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <h2 id="report-range-title" className="text-lg font-semibold text-white">
          Select date range
        </h2>
        <p className="mt-1 text-sm text-[#94A3B8]">{reportTitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[rgba(34,211,238,0.2)] px-4 py-2.5 text-sm font-semibold text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-landing-cyan flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
