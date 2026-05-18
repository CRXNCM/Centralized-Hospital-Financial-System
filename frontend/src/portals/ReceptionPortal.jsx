import { useState } from "react";
import { ROLES } from "../config/roles";
import { ReceptionBillsProvider } from "../context/ReceptionBillsContext";
import { ReceptionToastProvider } from "../context/ReceptionToastContext";
import PageTransition from "../components/PageTransition";
import PortalLayout from "../components/PortalLayout";
import PatientHistory from "../components/reception/PatientHistory";
import ReceptionHome from "../components/reception/ReceptionHome";
import TodaysPaymentsScreen from "../components/reception/TodaysPaymentsScreen";
import ReceptionPayment from "../components/ReceptionPayment";

const role = ROLES.reception;

export default function ReceptionPortal({ onSwitchRole }) {
  const [page, setPage] = useState("home");

  const sidebarActivePage = page === "payment" ? "payment" : page;

  return (
    <ReceptionBillsProvider>
      <ReceptionToastProvider>
        <PortalLayout
          role={role}
          activePage={page}
          sidebarActivePage={sidebarActivePage}
          onNavigate={setPage}
          onSwitchRole={onSwitchRole}
        >
          <PageTransition pageKey={page}>
            {page === "home" && <ReceptionHome />}
            {page === "payment" && (
              <ReceptionPayment onViewToday={() => setPage("today")} />
            )}
            {page === "today" && (
              <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <TodaysPaymentsScreen onRecordPayment={() => setPage("payment")} />
              </div>
            )}
            {page === "history" && <PatientHistory />}
          </PageTransition>
        </PortalLayout>
      </ReceptionToastProvider>
    </ReceptionBillsProvider>
  );
}
