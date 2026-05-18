export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "am", label: "Amharic" },
];

export const SESSION_TIMEOUT_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
];

export const SYSTEM_INFO = {
  systemName: "Centralized Hospital Financial & Revenue Management System",
  version: "1.0.0",
  developedBy: "AbaderTech System",
  hospital: "Central City Hospital",
  lastUpdated: "December 2024",
  supportContact: "support@abadertech.com",
};

export function createInitialGeneralSettings() {
  return {
    hospital: {
      name: "Central City Hospital",
      address: "Bole Road, Addis Ababa, Ethiopia",
      phone: "+251 11 551 2345",
      email: "info@centralcityhospital.et",
      logoPreview: null,
    },
    preferences: {
      darkMode: true,
      showEtbSymbol: true,
      patientSearchAutocomplete: true,
      requirePaymentConfirmation: true,
      allowPartialPayments: false,
      showFailedTransactions: true,
      dateFormat: "DD/MM/YYYY",
      language: "en",
      sessionTimeout: "30",
    },
    security: {
      passwordChange90Days: true,
      lockAfterFailedAttempts: true,
      twoFactorAuth: false,
      minPasswordLength: 8,
    },
  };
}
