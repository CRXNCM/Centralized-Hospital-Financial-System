import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  LOG_STATUS_STYLES,
  LOG_TYPE_OPTIONS,
  createInitialSystemLogs,
  getStaffFilterOptions,
} from "../../data/adminSystemLogs";
import { ROLE_COLORS } from "../../data/adminUsers";
import { IconSearch } from "../icons";
import AdminToast from "./AdminToast";
import ExportLogsModal from "./ExportLogsModal";

const PAGE_SIZE = 15;

const TABLE_COLUMNS = [
  "Timestamp",
  "User",
  "Role",
  "Action",
  "Details",
  "IP Address",
  "Status",
];

function matchesDateRange(log, dateFrom, dateTo) {
  if (dateFrom && log.date < dateFrom) return false;
  if (dateTo && log.date > dateTo) return false;
  return true;
}

function buildCsv(rows) {
  const header = TABLE_COLUMNS.join(",");
  const lines = rows.map((log) =>
    [
      `${log.date} ${log.time}`,
      log.user,
      log.role,
      log.action,
      log.details,
      log.ipAddress,
      log.status,
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header, ...lines].join("\n");
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openPdfPrint(rows) {
  const html = `
    <!DOCTYPE html><html><head><title>System Logs</title>
    <style>body{font-family:Inter,sans-serif;padding:24px}table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f1f5f9}</style></head><body>
    <h1>Central City Hospital — System Logs</h1>
    <table><thead><tr>${TABLE_COLUMNS.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map(
        (log) =>
          `<tr><td>${log.date} ${log.time}</td><td>${log.user}</td><td>${log.role}</td><td>${log.action}</td><td>${log.details}</td><td>${log.ipAddress}</td><td>${log.status}</td></tr>`,
      )
      .join("")}</tbody></table></body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export default function SystemLogs() {
  const [logs] = useState(createInitialSystemLogs);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const staffOptions = useMemo(() => getStaffFilterOptions(), []);

  const showToast = useCallback((message) => setToast(message), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs
      .filter((log) => {
        const matchesSearch =
          !q ||
          log.user.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q);
        const matchesType = typeFilter === "all" || log.type === typeFilter;
        const matchesUser = userFilter === "all" || log.user === userFilter;
        return (
          matchesSearch &&
          matchesType &&
          matchesUser &&
          matchesDateRange(log, dateFrom, dateTo)
        );
      })
      .sort((a, b) => b.sortKey - a.sortKey);
  }, [logs, search, typeFilter, userFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, userFilter, dateFrom, dateTo]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, page]);

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setUserFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setExpandedId(null);
  }

  function toggleRow(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function getExportRows(dateFromExport, dateToExport) {
    return logs
      .filter((log) => matchesDateRange(log, dateFromExport, dateToExport))
      .sort((a, b) => b.sortKey - a.sortKey);
  }

  function handleExport({ format, dateFrom: from, dateTo: to }) {
    const rows = getExportRows(from, to);
    if (format === "csv") {
      downloadFile(buildCsv(rows), "system-logs.csv", "text/csv;charset=utf-8");
      showToast(`Exported ${rows.length} log entries as CSV`);
      return;
    }
    openPdfPrint(rows);
    showToast(`Exported ${rows.length} log entries as PDF`);
  }

  return (
    <div className="space-y-6 p-8">
      <section className="glass-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">System Logs</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Audit trail of payments, logins, settings, and system events
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="btn-landing-cyan shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
          >
            Export Logs
          </button>
        </div>

        <div className="flex flex-col gap-4 border-b border-[rgba(34,211,238,0.08)] px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user name or action"
                className="w-full rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#22D3EE]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="Filter by log type"
              >
                {LOG_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="min-w-[140px] rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="Filter by user"
              >
                {staffOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="From date"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-xl border border-[rgba(34,211,238,0.15)] bg-[rgba(5,13,26,0.5)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22D3EE]"
                aria-label="To date"
              />
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-[rgba(34,211,238,0.2)] px-4 py-2.5 text-sm font-semibold text-[#94A3B8] transition-colors hover:border-[#22D3EE] hover:text-white"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                {TABLE_COLUMNS.map((col) => (
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
              {pageLogs.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length} className="px-6 py-12 text-center text-[#64748B]">
                    No logs match your search or filters.
                  </td>
                </tr>
              ) : (
                pageLogs.map((log) => {
                  const expanded = expandedId === log.id;
                  return (
                    <Fragment key={log.id}>
                      <tr
                        onClick={() => toggleRow(log.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleRow(log.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-expanded={expanded}
                        className={`table-row-hover cursor-pointer border-b border-[rgba(34,211,238,0.06)] ${
                          expanded ? "bg-[rgba(34,211,238,0.06)]" : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-[#94A3B8]">
                          <span className="text-white">{log.time}</span>
                          <span className="ml-2 text-xs text-[#64748B]">{log.date}</span>
                        </td>
                        <td className="px-5 py-4 font-medium text-white">{log.user}</td>
                        <td
                          className={`px-5 py-4 font-semibold ${ROLE_COLORS[log.role] ?? "text-[#94A3B8]"}`}
                        >
                          {log.role}
                        </td>
                        <td className="px-5 py-4 text-white">{log.action}</td>
                        <td className="max-w-[200px] truncate px-5 py-4 text-[#94A3B8]" title={log.details}>
                          {log.details}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-[#64748B]">{log.ipAddress}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-bold uppercase tracking-wide ${LOG_STATUS_STYLES[log.status] ?? "text-white"}`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                      {expanded && (
                        <tr key={`${log.id}-detail`} className="border-b border-[rgba(34,211,238,0.08)]">
                          <td colSpan={TABLE_COLUMNS.length} className="bg-[rgba(5,13,26,0.55)] px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#22D3EE]">
                              Full detail
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{log.fullDetail}</p>
                            <p className="mt-2 text-xs text-[#64748B]">
                              Type: {log.type} · Log ID: {log.id}
                            </p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(34,211,238,0.08)] px-6 py-4">
            <p className="text-sm text-[#64748B]">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-[rgba(34,211,238,0.2)] px-3 py-1.5 text-sm text-[#94A3B8] disabled:opacity-40 hover:text-white"
              >
                Previous
              </button>
              <span className="px-2 text-sm text-[#94A3B8]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-[rgba(34,211,238,0.2)] px-3 py-1.5 text-sm text-[#94A3B8] disabled:opacity-40 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <ExportLogsModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={handleExport}
      />

      <AdminToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
