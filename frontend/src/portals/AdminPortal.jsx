import { useState } from "react";
import { ROLES } from "../config/roles";
import AdminOverview from "../components/admin/AdminOverview";
import SystemSettings from "../components/admin/SystemSettings";
import UserManagement from "../components/admin/UserManagement";
import SystemLogs from "../components/admin/SystemLogs";
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
      {page === "settings" && <SystemSettings />}
      {page === "users" && <UserManagement />}
      {page === "logs" && <SystemLogs />}
    </PortalLayout>
  );
}
