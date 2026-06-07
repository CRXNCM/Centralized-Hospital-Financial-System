import LiveClock from "./LiveClock";
import PortalSidebar, { SIDEBAR_WIDTH } from "./PortalSidebar";

function formatHeaderDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function PortalLayout({
  role,
  activePage,
  sidebarActivePage,
  onNavigate,
  onSwitchRole,
  notificationBadges = {},
  children,
}) {
  const today = formatHeaderDate(new Date());
  const pageTitle = role.pageTitles[activePage] ?? role.portalSubtitle;
  const isWelcomeHeader = role.headerMode === "welcome";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050D1A] to-[#0A1628]">
      <PortalSidebar
        role={role}
        activePage={activePage}
        sidebarActivePage={sidebarActivePage}
        onNavigate={onNavigate}
        onSwitchRole={onSwitchRole}
        notificationBadges={notificationBadges}
      />

      <main className="min-h-screen" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <header className="sticky top-0 z-20 border-b border-[rgba(34,211,238,0.08)] bg-[rgba(5,13,26,0.6)] px-8 py-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#22D3EE]">{today}</p>
              {isWelcomeHeader ? (
                <>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Welcome, {role.userName}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#94A3B8]">{pageTitle}</p>
                  <LiveClock className="mt-2 font-mono text-sm font-semibold tabular-nums text-[#22D3EE] sm:hidden" />
                </>
              ) : (
                <>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    {getGreeting()}, {role.userName}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#94A3B8]">{pageTitle}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isWelcomeHeader && (
                <div className="glass-card hidden rounded-xl px-4 py-2.5 sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
                    Current time
                  </p>
                  <LiveClock className="mt-0.5 block font-mono text-lg font-semibold tabular-nums text-[#22D3EE]" />
                </div>
              )}
              <span className="hidden rounded-lg border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.08)] px-3 py-1.5 text-xs font-semibold text-[#22D3EE] sm:inline">
                {role.portalTitle}
              </span>
              <div className="glass-card flex items-center gap-3 rounded-full px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(34,211,238,0.2)] text-sm font-bold text-[#22D3EE]">
                  {role.userInitial}
                </div>
                <span className="text-sm font-medium text-white">{role.userName}</span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
