export const ALERT_RULES = [
  {
    id: "pending",
    label: "Alert when payment stays pending over",
    suffix: "hours",
    hasThreshold: true,
    thresholdKey: "pendingHours",
    thresholdType: "hours",
    defaultThreshold: 2,
  },
  {
    id: "revenue",
    label: "Alert when daily revenue drops below ETB",
    hasThreshold: true,
    thresholdKey: "revenueMinEtb",
    thresholdType: "currency",
    defaultThreshold: 5000,
  },
  {
    id: "failed",
    label: "Alert when a transaction is marked Failed",
    hasThreshold: false,
  },
  {
    id: "newUser",
    label: "Alert when a new user account is created",
    hasThreshold: false,
  },
  {
    id: "backupFail",
    label: "Alert when backup fails",
    hasThreshold: false,
  },
  {
    id: "channelOffline",
    label: "Alert when a payment channel goes offline",
    hasThreshold: false,
  },
];

export const NOTIFICATION_HISTORY = [
  {
    id: "nh-1",
    timestamp: "Dec 15 10:15 AM",
    alertType: "Verification Failed",
    detail: "TXN-0919",
    recipient: "Sent to Manager",
  },
  {
    id: "nh-2",
    timestamp: "Dec 14 11:59 PM",
    alertType: "Backup Completed",
    detail: "Automatic",
    recipient: "System",
  },
  {
    id: "nh-3",
    timestamp: "Dec 14 04:00 PM",
    alertType: "Pending Payment Alert",
    detail: "TXN-0887",
    recipient: "Sent to Manager",
  },
  {
    id: "nh-4",
    timestamp: "Dec 14 09:50 AM",
    alertType: "User Created",
    detail: "Selam Worku",
    recipient: "Sent to Manager",
  },
  {
    id: "nh-5",
    timestamp: "Dec 13 06:00 PM",
    alertType: "Daily Summary",
    detail: "End of day report",
    recipient: "Sent to Manager",
  },
];

export function createInitialNotificationSettings() {
  return {
    rules: {
      pending: true,
      revenue: true,
      failed: true,
      newUser: true,
      backupFail: true,
      channelOffline: true,
    },
    thresholds: {
      pendingHours: 2,
      revenueMinEtb: 5000,
    },
    delivery: {
      inApp: true,
      emailEnabled: true,
      managerEmail: "dawit.bekele@hospital.et",
      smsCritical: false,
      dailySummary: true,
      dailySummaryTime: "18:00",
    },
  };
}
