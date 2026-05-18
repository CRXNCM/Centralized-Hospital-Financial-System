import { useState } from "react";
import LandingPage from "./components/landing/LandingPage";
import AdminPortal from "./portals/AdminPortal";
import ManagerPortal from "./portals/ManagerPortal";
import ReceptionPortal from "./portals/ReceptionPortal";

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
    return <ReceptionPortal onSwitchRole={handleSwitchRole} />;
  }
  if (activeRole === "admin") {
    return <AdminPortal onSwitchRole={handleSwitchRole} />;
  }

  return <LandingPage onSelectRole={setActiveRole} />;
}
