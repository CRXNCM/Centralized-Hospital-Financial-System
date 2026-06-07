import {
  IconAlert,
  IconBarChart,
  IconDashboard,
  IconHistory,
  IconHospital,
  IconPayment,
  IconPharmacy,
  IconDatabase,
  IconSettings,
  IconShield,
  IconUsers,
} from "./icons";

/** Maps nav item ids to sidebar icons (centered icon rail). */
export const SIDEBAR_NAV_ICONS = {
  dashboard: IconDashboard,
  home: IconDashboard,
  payment: IconPayment,
  reception: IconPayment,
  history: IconHistory,
  today: IconBarChart,
  transactions: IconHistory,
  patients: IconUsers,
  reports: IconBarChart,
  analytics: IconBarChart,
  settings: IconSettings,
  overview: IconShield,
  users: IconUsers,
  logs: IconDatabase,
  notifications: IconAlert,
  sale: IconPharmacy,
  sales: IconBarChart,
  system: IconHospital,
};

export function getNavIcon(id) {
  return SIDEBAR_NAV_ICONS[id] ?? IconDashboard;
}
