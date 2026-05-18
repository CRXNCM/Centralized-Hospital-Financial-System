export default function PatientSummaryCard({ profile }) {
  const hasBalance = profile.outstandingBalance > 0;
  const isGoodStanding = profile.reliability === "good";

  return (
    <section className="glass-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(34,211,238,0.1)] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
          <p className="mt-1 font-mono text-sm text-[#22D3EE]">{profile.patientId}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isGoodStanding
              ? "badge-verified"
              : "badge-pending"
          }`}
        >
          {isGoodStanding ? "Good Standing" : "Outstanding Balance"}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.4)] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Total Visits
          </dt>
          <dd className="mt-1 text-xl font-bold text-white">{profile.totalVisits}</dd>
        </div>
        <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.4)] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Lifetime Paid
          </dt>
          <dd className="mt-1 text-xl font-bold text-[#22D3EE]">{profile.totalPaidLabel}</dd>
        </div>
        <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.4)] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Outstanding Balance
          </dt>
          <dd
            className={`mt-1 text-xl font-bold ${
              hasBalance ? "text-[#F59E0B]" : "text-[#10B981]"
            }`}
          >
            {hasBalance ? profile.outstandingLabel : "ETB 0"}
          </dd>
        </div>
        <div className="rounded-xl border border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.4)] px-4 py-3 sm:col-span-2 lg:col-span-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Last Visit
          </dt>
          <dd className="mt-1 text-lg font-medium text-white">{profile.lastVisitDate}</dd>
        </div>
      </dl>
    </section>
  );
}
