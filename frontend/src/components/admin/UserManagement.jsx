const users = [
  { name: "Admin User", role: "System Admin", email: "admin@hospital.et", status: "Active" },
  { name: "Sara Bekele", role: "Manager", email: "manager@hospital.et", status: "Active" },
  { name: "Tigist Haile", role: "Reception", email: "reception@hospital.et", status: "Active" },
  { name: "Dawit Mekonnen", role: "Reception", email: "dawit@hospital.et", status: "Active" },
];

const roleColors = {
  "System Admin": "text-[#22D3EE]",
  Manager: "text-[#10B981]",
  Reception: "text-[#F59E0B]",
};

export default function UserManagement() {
  return (
    <div className="p-8">
      <section className="glass-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(34,211,238,0.1)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">System Users</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Manage portal access by role</p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-[#22D3EE] px-4 py-2 text-sm font-bold text-[#050D1A]"
          >
            Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.4)]">
                {["Name", "Role", "Email", "Status"].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.email}
                  className="table-row-hover border-b border-[rgba(34,211,238,0.06)]"
                >
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className={`px-6 py-4 font-semibold ${roleColors[user.role] ?? "text-white"}`}>
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-[#94A3B8]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="badge-verified rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
