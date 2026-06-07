import centralLogo from "../assets/central_logo.png";
import { IconLogout } from "./icons";
import { getNavIcon } from "./sidebarNavIcons";

export const SIDEBAR_WIDTH = 260;

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
    <aside
      className="portal-sidebar fixed left-0 top-0 z-30 flex h-full flex-col"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="flex items-center gap-3 border-b border-[rgba(34,211,238,0.08)] px-4 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[rgba(34,211,238,0.08)] shadow-[0_0_16px_rgba(34,211,238,0.15)]">
          <img
            src={centralLogo}
            alt="Central City Hospital"
            className="h-9 w-9 object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">Central City Hospital</p>
          <p className="truncate text-xs text-[#64748B]">{role.portalTitle}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {role.navItems.map(({ id, label }) => {
          const Icon = getNavIcon(id);
          const active = highlightedPage === id;
          const hasBadge = notificationBadges[id];

          return (
            <div key={id} className="relative">
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-[#22D3EE]"
                  aria-hidden
                />
              )}
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? "page" : undefined}
                className={`sidebar-nav-btn relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 ease-in-out ${
                  active ? "sidebar-nav-btn--active" : "sidebar-nav-btn--inactive"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
                {hasBadge && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#F43F5E] shadow-[0_0_6px_#F43F5E]" />
                )}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-[rgba(34,211,238,0.08)] px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(34,211,238,0.25)] bg-[rgba(34,211,238,0.12)] text-xs font-bold text-[#22D3EE]">
            {role.userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{role.userName}</p>
            <p className="truncate text-xs text-[#64748B]">{role.badge}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchRole}
          className="sidebar-logout-btn flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#475569] transition-all duration-200 ease-in-out"
        >
          <IconLogout className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
