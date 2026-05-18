import { useMemo, useState } from "react";
import { ROLES } from "../config/roles";
import { QUICK_ALERTS } from "../data/managerMockData";
import Dashboard from "../components/Dashboard";
import ManagerReports from "../components/manager/ManagerReports";
import PatientPaymentDetails from "../components/manager/PatientPaymentDetails";
import ReportsPage from "../components/manager/ReportsPage";
import TransactionHistory from "../components/manager/TransactionHistory";
import PortalLayout from "../components/PortalLayout";

const role = ROLES.manager;

export default function ManagerPortal({ onSwitchRole }) {
  const [page, setPage] = useState("dashboard");
  const [transactionFilter, setTransactionFilter] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState(() => new Set());

  const activeAlerts = useMemo(
    () => QUICK_ALERTS.filter((a) => !dismissedAlerts.has(a.id)),
    [dismissedAlerts],
  );

  const notificationBadges = useMemo(
    () => (activeAlerts.length > 0 ? { dashboard: true } : {}),
    [activeAlerts.length],
  );

  function handleNavigate(targetPage, filter) {
    setTransactionFilter(filter ?? null);
    setPage(targetPage);
  }

  function handleDismissAlert(alertId) {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  }

  return (
    <PortalLayout
      role={role}
      activePage={page}
      onNavigate={(id) => {
        setPage(id);
        if (id !== "transactions") setTransactionFilter(null);
      }}
      onSwitchRole={onSwitchRole}
      notificationBadges={notificationBadges}
    >
      {page === "dashboard" && (
        <Dashboard
          onNavigate={handleNavigate}
          alerts={activeAlerts}
          onDismissAlert={handleDismissAlert}
        />
      )}
      {page === "analytics" && <ManagerReports />}
      {page === "reports" && <ReportsPage />}
      {page === "transactions" && (
        <TransactionHistory initialStatusFilter={transactionFilter} />
      )}
      {page === "patients" && <PatientPaymentDetails />}
    </PortalLayout>
  );
}
