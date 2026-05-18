export default function StatusBadge({ status }) {
  const normalized = status.toLowerCase();
  let className = "badge-paid";
  if (normalized === "pending") className = "badge-pending";
  else if (normalized === "failed") className = "badge-failed";
  else if (normalized === "verified" || normalized === "paid") className = "badge-verified";
  else if (normalized === "void") className = "badge-void";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}
