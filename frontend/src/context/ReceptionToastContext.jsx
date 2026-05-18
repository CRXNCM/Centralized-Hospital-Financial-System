import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReceptionToast from "../components/reception/ReceptionToast";

const ReceptionToastContext = createContext(null);

const TOAST_DURATION_MS = 4000;

export function ReceptionToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(hideToast, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ReceptionToastContext.Provider value={value}>
      {children}
      <ReceptionToast toast={toast} onDismiss={hideToast} />
    </ReceptionToastContext.Provider>
  );
}

export function useReceptionToast() {
  const ctx = useContext(ReceptionToastContext);
  if (!ctx) {
    throw new Error("useReceptionToast must be used within ReceptionToastProvider");
  }
  return ctx;
}
