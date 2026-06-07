import { useState } from "react";
import LandingPage from "./components/landing/LandingPage";
import AdminPortal from "./portals/AdminPortal";
import ManagerPortal from "./portals/ManagerPortal";
import PharmacyReceptionPortal from "./portals/PharmacyReceptionPortal";
import ReceptionPortal from "./portals/ReceptionPortal";
import { ReceptionBillsProvider } from "./context/ReceptionBillsContext";

export default function App() {
  const [activeRole, setActiveRole] = useState(null);

  if (!activeRole) {
    return <LandingPage onSelectRole={setActiveRole} />;
  }

  const handleSwitchRole = () => setActiveRole(null);

  if (activeRole === "manager") {
    return <ManagerPortal onSwitchRole={handleSwitchRole} />;
  }
  if (activeRole === "reception") {
    return (
      <ReceptionBillsProvider>
        <ReceptionPortal onSwitchRole={handleSwitchRole} />
      </ReceptionBillsProvider>
    );
  }
  if (activeRole === "pharmacy") {
    return <PharmacyReceptionPortal onSwitchRole={handleSwitchRole} />;
  }
  if (activeRole === "admin") { 
    return <AdminPortal onSwitchRole={handleSwitchRole} />;
  }

  return <LandingPage onSelectRole={setActiveRole} />;
}
