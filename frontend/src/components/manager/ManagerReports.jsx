import MonthComparison from "./analytics/MonthComparison";
import PaymentDonutChart from "./analytics/PaymentDonutChart";
import RevenueTrendChart from "./analytics/RevenueTrendChart";
import TopServicesList from "./analytics/TopServicesList";

export default function ManagerReports() {
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Trend, payment splits, and service performance
        </p>
      </header>

      <RevenueTrendChart />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaymentDonutChart />
        <MonthComparison />
      </div>

      <TopServicesList />
    </div>
  );
}
