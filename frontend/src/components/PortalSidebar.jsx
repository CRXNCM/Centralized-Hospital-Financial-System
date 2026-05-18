import { IconHospital, IconLogout } from "./icons";
import { getNavIcon } from "./sidebarNavIcons";

export const SIDEBAR_WIDTH = 72;

export default function PortalSidebar({
  role,
  activePage,
  sidebarActivePage,
  onNavigate,
  onSwitchRole,
  notificationBadges = {},
}) {
  const highlightedPage = sidebarActivePage ?? activePage;
  return (
    <aside className="portal-sidebar fixed left-0 top-0 z-30 flex h-full w-[72px] flex-col">
      <div className="flex justify-center border-b border-[rgba(34,211,238,0.08)] py-5">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#22D3EE]"
          title="Central City Hospital"
        >
          <IconHospital className="h-7 w-7" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 py-4">
        {role.navItems.map(({ id, label }) => {
          const Icon = getNavIcon(id);
          const active = highlightedPage === id;
          const hasBadge = notificationBadges[id];

          return (
            <div key={id} className="group relative flex w-full justify-center px-2">
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#22D3EE]"
                  aria-hidden
                />
              )}
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`sidebar-nav-btn relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-200 ease-in-out ${
                  active ? "sidebar-nav-btn--active" : "sidebar-nav-btn--inactive"
                }`}
              >
                <Icon className="h-[22px] w-[22px] shrink-0" />
                {hasBadge && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F43F5E] shadow-[0_0_6px_#F43F5E]" />
                )}
              </button>
              <span className="sidebar-tooltip" role="tooltip">
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 border-t border-[rgba(34,211,238,0.08)] py-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(34,211,238,0.25)] bg-[rgba(34,211,238,0.12)] text-xs font-bold text-[#22D3EE]"
          title={role.userName}
        >
          {role.userInitial}
        </div>

        <div className="group relative">
          <button
            type="button"
            onClick={onSwitchRole}
            aria-label="Logout"
            className="sidebar-logout-btn flex h-10 w-10 items-center justify-center rounded-lg text-[#475569] transition-all duration-200 ease-in-out"
          >
            <IconLogout className="h-5 w-5" />
          </button>
          <span className="sidebar-tooltip" role="tooltip">
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
}
