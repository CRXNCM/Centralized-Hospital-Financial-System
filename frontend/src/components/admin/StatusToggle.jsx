export default function StatusToggle({ active, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      disabled={disabled}
      onClick={() => onChange(!active)}
      className={`admin-status-toggle relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
        active ? "bg-[#10B981]" : "bg-[#475569]"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{active ? "Active" : "Inactive"}</span>
    </button>
  );
}
