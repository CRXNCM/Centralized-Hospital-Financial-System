import AdminActivityFeed from "./AdminActivityFeed";
import AdminHealthCards from "./AdminHealthCards";
import AdminSystemStatus from "./AdminSystemStatus";

export default function AdminOverview() {
  return (
    <div className="space-y-6 p-8">
      <AdminHealthCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AdminActivityFeed />
        </div>
        <div className="xl:col-span-5">
          <AdminSystemStatus />
        </div>
      </div>
    </div>
  );
}
