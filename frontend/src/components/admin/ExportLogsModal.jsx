import { useState } from "react";

export default function ExportLogsModal({ open, onClose, onExport }) {
  const [format, setFormat] = useState("csv");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onExport({ format, dateFrom, dateTo });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-logs-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(2,8,20,0.75)] backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="glass-card relative z-10 w-full max-w-md rounded-2xl border border-[rgba(34,211,238,0.2)] p-6 shadow-xl">
        <h2 id="export-logs-title" className="text-lg font-semibold text-white">
          Export System Logs
        </h2>
        <p className="mt-1 text-sm text-[#94A3B8]">Choose format and date range for export.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Format
            </legend>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.5)] px-4 py-3 text-sm has-[:checked]:border-[#22D3EE] has-[:checked]:bg-[rgba(34,211,238,0.08)]">
                <input
                  type="radio"
                  name="export-format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  className="accent-[#22D3EE]"
                />
                <span className="text-white">CSV</span>
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[rgba(34,211,238,0.2)] bg-[rgba(5,13,26,0.5)] px-4 py-3 text-sm has-[:checked]:border-[#22D3EE] has-[:checked]:bg-[rgba(34,211,238,0.08)]">
                <input
                  type="radio"
                  name="export-format"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={() => setFormat("pdf")}
                  className="accent-[#22D3EE]"
                />
                <span className="text-white">PDF</span>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Date range
            </legend>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="Export from date"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="Export to date"
              />
            </div>
          </fieldset>

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
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

