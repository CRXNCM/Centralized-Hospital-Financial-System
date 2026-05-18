export const ADMIN_HEALTH_STATS = {
  activeUsers: 12,
  uptime: "99.8%",
  todayTransactions: 47,
  failedTransactions: 3,
};

export const ADMIN_ACTIVITY_EVENTS = [
  {
    id: "evt-1",
    type: "normal",
    icon: "payment",
    message: "Receptionist Tigist recorded payment — ETB 1,200",
    time: "10:45 AM",
  },
  {
    id: "evt-2",
    type: "normal",
    icon: "report",
    message: "Manager accessed revenue report",
    time: "10:30 AM",
  },
  {
    id: "evt-3",
    type: "error",
    icon: "alert",
    message: "Payment verification failed — TXN-0892",
    time: "10:15 AM",
  },
  {
    id: "evt-4",
    type: "normal",
    icon: "user",
    message: "New user account created — Selam Bekele",
    time: "09:50 AM",
  },
  {
    id: "evt-5",
    type: "warning",
    icon: "alert",
    message: "Backup service delayed — retry scheduled",
    time: "09:30 AM",
  },
  {
    id: "evt-6",
    type: "normal",
    icon: "payment",
    message: "Receptionist Tigist recorded payment — ETB 500",
    time: "09:12 AM",
  },
];

export const ADMIN_SERVICES = [
  { id: "telebirr", name: "Telebirr API", status: "online" },
  { id: "cbe-birr", name: "CBE Birr", status: "online" },
  { id: "amole", name: "Amole", status: "online" },
  { id: "database", name: "Database", status: "online" },
  { id: "backup", name: "Backup Service", status: "warning" },
];
