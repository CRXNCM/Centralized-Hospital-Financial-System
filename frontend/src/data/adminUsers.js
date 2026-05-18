/** Logged-in admin — role cannot be changed on self-edit */
export const CURRENT_ADMIN_ID = "admin-1";

export const USER_ROLES = ["Manager", "Receptionist", "System Admin"];

export const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "Manager", label: "Manager" },
  { value: "Receptionist", label: "Receptionist" },
  { value: "System Admin", label: "Admin" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function createInitialUsers() {
  return [
    {
      id: CURRENT_ADMIN_ID,
      name: "System Admin",
      role: "System Admin",
      email: "admin@hospital.et",
      phone: "+251 911 000 001",
      status: "Active",
      lastLogin: "Today, 08:12 AM",
    },
    {
      id: "user-2",
      name: "Tigist Alemu",
      role: "Receptionist",
      email: "tigist.alemu@hospital.et",
      phone: "+251 911 234 567",
      status: "Active",
      lastLogin: "Today, 10:45 AM",
    },
    {
      id: "user-3",
      name: "Meron Haile",
      role: "Receptionist",
      email: "meron.haile@hospital.et",
      phone: "+251 922 345 678",
      status: "Active",
      lastLogin: "Today, 09:30 AM",
    },
    {
      id: "user-4",
      name: "Dawit Bekele",
      role: "Manager",
      email: "dawit.bekele@hospital.et",
      phone: "+251 933 456 789",
      status: "Active",
      lastLogin: "Yesterday, 4:15 PM",
    },
    {
      id: "user-5",
      name: "Selam Worku",
      role: "Receptionist",
      email: "selam.worku@hospital.et",
      phone: "+251 944 567 890",
      status: "Inactive",
      lastLogin: "Mar 12, 2:00 PM",
    },
    {
      id: "user-6",
      name: "Hiwot Tadesse",
      role: "Receptionist",
      email: "hiwot.tadesse@hospital.et",
      phone: "+251 955 678 901",
      status: "Active",
      lastLogin: "Today, 08:55 AM",
    },
  ];
}

export const ROLE_COLORS = {
  "System Admin": "text-[#22D3EE]",
  Manager: "text-[#10B981]",
  Receptionist: "text-[#F59E0B]",
};
