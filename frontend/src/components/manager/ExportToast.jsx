export default function ExportToast({ message, visible }) {
  if (!visible) return null;

  return (
    <div
      className="export-toast fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded-xl border border-[rgba(16,185,129,0.4)] bg-[#112240] px-6 py-3 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
      role="status"
    >
      <p className="text-sm font-semibold text-[#10B981]">{message}</p>
    </div>
  );
}
