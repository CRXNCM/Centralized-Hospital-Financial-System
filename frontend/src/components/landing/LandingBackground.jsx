export default function LandingBackground() {
  return (
    <div className="landing-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="landing-radial-glow absolute inset-0" />
      <div className="landing-grid absolute inset-0" />
      <div className="landing-particles absolute inset-0">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="landing-particle"
            style={{
              left: `${(i * 17 + 8) % 100}%`,
              top: `${(i * 23 + 12) % 100}%`,
              animationDelay: `${(i % 8) * 0.7}s`,
              animationDuration: `${14 + (i % 6)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
