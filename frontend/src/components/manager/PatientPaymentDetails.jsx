import { useEffect, useMemo, useRef, useState } from "react";
import {
  PATIENT_PROFILES,
  getPatientById,
  searchPatients,
} from "../../data/patientProfiles";
import PatientSummaryCard from "./PatientSummaryCard";
import PaymentTimeline from "./PaymentTimeline";

export default function PatientPaymentDetails() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const suggestions = useMemo(
    () => (query.trim() ? searchPatients(query) : []),
    [query],
  );

  const selectedProfile = useMemo(
    () => (selectedId ? getPatientById(selectedId) : null),
    [selectedId],
  );

  useEffect(() => {
    setDropdownOpen(query.trim().length > 0 && suggestions.length > 0);
  }, [query, suggestions.length]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectPatient(patientId, name) {
    setSelectedId(patientId);
    setQuery(name);
    setDropdownOpen(false);
  }

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Patient Payment Details</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Look up a patient to view their payment history and standing
        </p>
      </header>

      <div ref={searchRef} className="relative">
        <label htmlFor="patient-search" className="sr-only">
          Search patients
        </label>
        <div className="glass-card flex items-center gap-3 px-5 py-4">
          <svg
            className="h-6 w-6 shrink-0 text-[#22D3EE]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="patient-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) setSelectedId(null);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setDropdownOpen(true);
            }}
            placeholder="Search by patient name or patient ID..."
            className="w-full bg-transparent text-lg text-white outline-none placeholder:text-[#94A3B8]"
            autoComplete="off"
          />
        </div>

        {dropdownOpen && (
          <ul className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-[rgba(34,211,238,0.2)] bg-[#112240] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {suggestions.map((p) => (
              <li key={p.patientId}>
                <button
                  type="button"
                  onClick={() => selectPatient(p.patientId, p.name)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-[rgba(34,211,238,0.1)]"
                >
                  <div>
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-sm font-mono text-[#94A3B8]">{p.patientId}</p>
                  </div>
                  <span className="text-xs text-[#94A3B8]">
                    {p.totalVisits} visit{p.totalVisits !== 1 ? "s" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!selectedProfile && (
        <section className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-lg font-medium text-[#94A3B8]">
            Search for a patient above to load their profile
          </p>
          <p className="mt-2 text-sm text-[#94A3B8]">
            {PATIENT_PROFILES.length} patients in the system
          </p>
        </section>
      )}

      {selectedProfile && (
        <>
          <PatientSummaryCard profile={selectedProfile} />
          <PaymentTimeline payments={selectedProfile.payments} />
        </>
      )}
    </div>
  );
}
