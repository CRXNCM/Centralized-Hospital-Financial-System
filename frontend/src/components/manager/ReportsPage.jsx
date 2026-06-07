import { useState } from "react";
import {
  buildMonthReport,
  buildReport,
  buildTodayReport,
  buildWeekReport,
  delay,
  randomLoadingMs,
} from "../../utils/generateReport";
import ExportToast from "./ExportToast";
import ReportPreview from "./ReportPreview";
import { PAYMENT_METHOD_LABELS } from "../../data/paymentMethods";

const METHODS = PAYMENT_METHOD_LABELS;
const STATUSES = ["Paid", "Verified", "Pending", "Failed"];

function Spinner({ light }) {
  return (
    <svg
      className={`h-5 w-5 animate-spin ${light ? "text-[#22D3EE]" : "text-[#050D1A]"}`}
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
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingQuick, setLoadingQuick] = useState(null);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [methods, setMethods] = useState([...METHODS]);
  const [statuses, setStatuses] = useState([...STATUSES]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  }

  async function runQuickReport(type) {
    setLoadingQuick(type);
    setQuickSuccess(null);
    await delay(randomLoadingMs());
    const result =
      type === "today"
        ? buildTodayReport()
        : type === "week"
          ? buildWeekReport()
          : buildMonthReport();
    setReport(result);
    setLoadingQuick(null);
    setQuickSuccess(type);
    setTimeout(() => setQuickSuccess(null), 2500);
  }

  async function runCustomReport(e) {
    e.preventDefault();
    setLoadingCustom(true);
    await delay(randomLoadingMs());
    const result = buildReport({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      methods: methods.length === METHODS.length ? [] : methods,
      statuses: statuses.length === STATUSES.length ? [] : statuses,
      periodLabel: "Custom report",
    });
    setReport(result);
    setLoadingCustom(false);
    showToast("Report generated successfully");
  }

  function toggleItem(list, setList, item, allItems) {
    if (list.includes(item)) {
      const next = list.filter((i) => i !== item);
      setList(next.length ? next : [...allItems]);
    } else {
      setList([...list, item]);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Generate, preview, and export hospital financial reports
        </p>
      </header>

      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Quick Reports</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">One-click report generation</p>
        <div className="mt-5 flex flex-wrap gap-4">
          <button
            type="button"
            disabled={loadingQuick !== null}
            onClick={() => runQuickReport("today")}
            className="flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(34,211,238,0.25)] bg-[rgba(34,211,238,0.1)] px-6 py-4 text-sm font-bold text-[#22D3EE] transition-all hover:bg-[rgba(34,211,238,0.18)] disabled:opacity-60 sm:flex-none"
          >
            {loadingQuick === "today" ? <Spinner light /> : null}
            {loadingQuick === "today" ? "Generating…" : "Generate Today's Report"}
          </button>
          <button
            type="button"
            disabled={loadingQuick !== null}
            onClick={() => runQuickReport("week")}
            className="flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(34,211,238,0.25)] bg-[rgba(34,211,238,0.1)] px-6 py-4 text-sm font-bold text-[#22D3EE] transition-all hover:bg-[rgba(34,211,238,0.18)] disabled:opacity-60 sm:flex-none"
          >
            {loadingQuick === "week" ? <Spinner light /> : null}
            {loadingQuick === "week" ? "Generating…" : "Generate Weekly Report"}
          </button>
          <button
            type="button"
            disabled={loadingQuick !== null}
            onClick={() => runQuickReport("month")}
            className="flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(34,211,238,0.25)] bg-[rgba(34,211,238,0.1)] px-6 py-4 text-sm font-bold text-[#22D3EE] transition-all hover:bg-[rgba(34,211,238,0.18)] disabled:opacity-60 sm:flex-none"
          >
            {loadingQuick === "month" ? <Spinner light /> : null}
            {loadingQuick === "month" ? "Generating…" : "Generate This Month's Report"}
          </button>
        </div>
        {quickSuccess && (
          <p className="mt-4 text-sm font-semibold text-[#10B981]">
            ✓{" "}
            {quickSuccess === "today"
              ? "Today's"
              : quickSuccess === "week"
                ? "Weekly"
                : "Monthly"}{" "}
            report generated successfully
          </p>
        )}
      </section>

      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white">Custom Report Builder</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">Configure filters and generate a tailored report</p>

        <form onSubmit={runCustomReport} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Start Date
              </span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-4 py-2.5 text-white outline-none focus:border-[#22D3EE] [color-scheme:dark]"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                End Date
              </span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.6)] px-4 py-2.5 text-white outline-none focus:border-[#22D3EE] [color-scheme:dark]"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Payment Method
            </p>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-[rgba(34,211,238,0.1)] p-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {METHODS.map((m) => (
                  <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={methods.includes(m)}
                      onChange={() => toggleItem(methods, setMethods, m, METHODS)}
                      className="h-4 w-4 shrink-0 accent-[#22D3EE]"
                    />
                    <span className="truncate">{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Status
            </p>
            <div className="flex flex-wrap gap-4">
              {STATUSES.map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={statuses.includes(s)}
                    onChange={() => toggleItem(statuses, setStatuses, s, STATUSES)}
                    className="h-4 w-4 accent-[#22D3EE]"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingCustom}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] py-3.5 text-sm font-bold text-[#050D1A] shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-opacity hover:opacity-95 disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {loadingCustom ? <Spinner /> : null}
            {loadingCustom ? "Generating…" : "Generate Report"}
          </button>
        </form>
      </section>

      <ReportPreview report={report} />

      {report && (
        <section className="glass-card flex flex-wrap gap-3 p-6">
          <button
            type="button"
            onClick={() => showToast("Report downloaded as PDF successfully")}
            className="rounded-xl bg-[#22D3EE] px-5 py-2.5 text-sm font-bold text-[#050D1A] hover:bg-[#67E8F9]"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => {
              showToast("Opening print dialog…");
              window.print();
            }}
            className="rounded-xl border-2 border-[#22D3EE] bg-transparent px-5 py-2.5 text-sm font-bold text-[#22D3EE] hover:bg-[rgba(34,211,238,0.1)]"
          >
            Print Report
          </button>
          <button
            type="button"
            onClick={() => showToast("Report shared via email successfully")}
            className="rounded-xl border border-[#94A3B8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#94A3B8] hover:border-white hover:text-white"
          >
            Share via Email
          </button>
        </section>
      )}

      <ExportToast message={toast} visible={Boolean(toast)} />
    </div>
  );
}
