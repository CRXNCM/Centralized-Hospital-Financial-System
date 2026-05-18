import { useState } from "react";
import { ROLES } from "../config/roles";
import AdminOverview from "../components/admin/AdminOverview";
import PaymentSettings from "../components/admin/PaymentSettings";
import GeneralSystemSettings from "../components/admin/GeneralSystemSettings";
import UserManagement from "../components/admin/UserManagement";
import SystemLogs from "../components/admin/SystemLogs";
import ReportsBackup from "../components/admin/ReportsBackup";
import NotificationsAlerts from "../components/admin/NotificationsAlerts";
import PortalLayout from "../components/PortalLayout";

const role = ROLES.admin;

export default function AdminPortal({ onSwitchRole }) {
  const [page, setPage] = useState("overview");

  return (
    <PortalLayout
      role={role}
      activePage={page}
      onNavigate={setPage}
      onSwitchRole={onSwitchRole}
    >
      {page === "overview" && <AdminOverview />}
      {page === "settings" && <PaymentSettings />}
      {page === "system" && <GeneralSystemSettings />}
      {page === "users" && <UserManagement />}
      {page === "logs" && <SystemLogs />}
      {page === "reports" && <ReportsBackup />}
      {page === "notifications" && <NotificationsAlerts />}
    </PortalLayout>
  );
}
