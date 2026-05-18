import { IconCheckCircle } from "../icons";

export default function ReceptionToast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="reception-toast fixed right-6 top-6 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-[rgba(16,185,129,0.45)] bg-[#112240] px-5 py-4 shadow-[0_0_28px_rgba(16,185,129,0.3)]"
      role="status"
      aria-live="polite"
    >
      <IconCheckCircle className="h-6 w-6 shrink-0 text-[#10B981]" />
      <p className="flex-1 text-sm font-semibold text-[#10B981]">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-[#64748B] transition-colors hover:text-white"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
