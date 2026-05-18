/** Payment channels shown on admin Payment Settings screen */
export const PAYMENT_CHANNEL_SETTINGS = [
  { id: "cash", label: "Cash", locked: true, enabled: true },
  { id: "telebirr", label: "Telebirr", enabled: true },
  { id: "cbe-birr", label: "CBE Birr", enabled: true },
  { id: "amole", label: "Amole", enabled: true },
  { id: "apollo", label: "Apollo", enabled: false },
  { id: "coopay-ebirr", label: "Coopay-Ebirr", enabled: true },
  { id: "awash-wallet", label: "Awash Wallet", enabled: false },
  { id: "wegagen-ebirr", label: "Wegagen Mobile", enabled: false },
  { id: "nib-mobile", label: "NIB Mobile", enabled: false },
  { id: "zemen-mobile", label: "Zemen Mobile", enabled: false },
  { id: "enat-pay", label: "Enat Mobile", enabled: false },
  { id: "bunna-mobile", label: "Bunna Mobile", enabled: false },
];

export const FLAG_AFTER_OPTIONS = [
  { value: "1", label: "1 hour" },
  { value: "2", label: "2 hours" },
  { value: "4", label: "4 hours" },
  { value: "24", label: "24 hours" },
];

export function createInitialPaymentSettings() {
  return {
    channels: Object.fromEntries(
      PAYMENT_CHANNEL_SETTINGS.map((c) => [c.id, c.enabled]),
    ),
    verification: {
      autoTelebirr: true,
      autoCbeBirr: true,
      autoAmole: true,
      manualAboveEtb: "10000",
      flagAfterHours: "1",
      alertFailed: true,
    },
    receipt: {
      autoGenerate: true,
      includeLogo: true,
      footerText: "",
    },
  };
}
