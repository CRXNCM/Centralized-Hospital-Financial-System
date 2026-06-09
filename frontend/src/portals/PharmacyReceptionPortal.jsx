import { useState } from "react";
import { ROLES } from "../config/roles";
import { ReceptionToastProvider } from "../context/ReceptionToastContext";
import PageTransition from "../components/PageTransition";
import PortalLayout from "../components/PortalLayout";
import PharmacyHome from "../components/pharmacy/PharmacyHome";
import PharmacySale from "../components/pharmacy/PharmacySale";
import TodaysSalesScreen from "../components/pharmacy/TodaysSalesScreen";

const role = ROLES.pharmacy;

export default function PharmacyReceptionPortal({ onSwitchRole }) {
  const [page, setPage] = useState("home");

  const sidebarActivePage = page === "sale" ? "sale" : page;

  return (
    <ReceptionToastProvider>
      <PortalLayout
        role={role}
        activePage={page}
        sidebarActivePage={sidebarActivePage}
        onNavigate={setPage}
        onSwitchRole={onSwitchRole}
      >
        <PageTransition pageKey={page}>
          {page === "home" && (
            <PharmacyHome
              onCreateSale={() => setPage("sale")}
              onViewSales={() => setPage("sales")}
            />
          )}
          {page === "sale" && (
            <PharmacySale onViewSales={() => setPage("sales")} />
          )}
          {page === "sales" && (
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
              <TodaysSalesScreen onCreateSale={() => setPage("sale")} />
            </div>
          )}
        </PageTransition>
      </PortalLayout>
    </ReceptionToastProvider>
  );
}
