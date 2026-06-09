import { useState } from "react";
import LandingPage from "./components/landing/LandingPage";
import AdminPortal from "./portals/AdminPortal";
import ManagerPortal from "./portals/ManagerPortal";
import PharmacyReceptionPortal from "./portals/PharmacyReceptionPortal";
import ReceptionPortal from "./portals/ReceptionPortal";
import { PharmacySalesProvider } from "./context/PharmacySalesContext";
import { ReceptionBillsProvider } from "./context/ReceptionBillsContext";

export default function App() {
  const [activeRole, setActiveRole] = useState(null);

  if (!activeRole) {
    return <LandingPage onSelectRole={setActiveRole} />;
  }

  const handleSwitchRole = () => setActiveRole(null);

  let portal = null;
  if (activeRole === "manager") {
    portal = <ManagerPortal onSwitchRole={handleSwitchRole} />;
  } else if (activeRole === "reception") {
    portal = <ReceptionPortal onSwitchRole={handleSwitchRole} />;
  } else if (activeRole === "pharmacy") {
    portal = <PharmacyReceptionPortal onSwitchRole={handleSwitchRole} />;
  } else if (activeRole === "admin") {
    portal = <AdminPortal onSwitchRole={handleSwitchRole} />;
  } else {
    return <LandingPage onSelectRole={setActiveRole} />;
  }

  return (
    <PharmacySalesProvider>
      <ReceptionBillsProvider>{portal}</ReceptionBillsProvider>
    </PharmacySalesProvider>
  );
}
