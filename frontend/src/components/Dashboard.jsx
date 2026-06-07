import QuickAlerts from "./manager/QuickAlerts";
import ManagerTransactionsTable from "./manager/ManagerTransactionsTable";
import ReceptionCollectionsChart from "./manager/ReceptionCollectionsChart";
import RevenueChart from "./RevenueChart";
import StatCards from "./StatCards";

export default function Dashboard({ onNavigate, alerts, onDismissAlert }) {
  return (
    <div className="space-y-6 p-8">
      <StatCards onNavigate={onNavigate} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <QuickAlerts alerts={alerts} onDismiss={onDismissAlert} />
      </div>

      <ReceptionCollectionsChart />

      <ManagerTransactionsTable limit={10} />
    </div>
  );
}
