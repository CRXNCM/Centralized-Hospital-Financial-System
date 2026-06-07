import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  BILL_STATUS,
  createInitialBills,
  filterBillsByQuery,
  getTodaysPayments,
  recordBillPayment,
  restoreBillToUnpaid,
  voidBillPayment,
} from "../data/receptionBillStore";

const ReceptionBillsContext = createContext(null);

export function ReceptionBillsProvider({ children }) {
  const [state, setState] = useState(() => ({
    bills: createInitialBills(),
    auditLog: [],
  }));

  const recordPayment = useCallback((payment) => {
    let paymentRecord = null;
    setState((prev) => {
      const next = recordBillPayment(prev.bills, prev.auditLog, payment);
      paymentRecord = next.paymentRecord;
      return { bills: next.bills, auditLog: next.auditLog };
    });
    return paymentRecord;
  }, []);

  const voidPayment = useCallback((billId) => {
    setState((prev) => {
      const next = voidBillPayment(prev.bills, prev.auditLog, billId);
      return { bills: next.bills, auditLog: next.auditLog };
    });
  }, []);

  const restoreToUnpaid = useCallback((billId) => {
    setState((prev) => {
      const next = restoreBillToUnpaid(prev.bills, prev.auditLog, billId);
      return { bills: next.bills, auditLog: next.auditLog };
    });
  }, []);

  const value = useMemo(
    () => ({
      bills: state.bills,
      auditLog: state.auditLog,
      unpaidBills: state.bills.filter((b) => b.status === BILL_STATUS.UNPAID),
      settledBills: state.bills.filter(
        (b) => b.status === BILL_STATUS.PAID || b.status === BILL_STATUS.VOID,
      ),
      recordPayment,
      voidPayment,
      restoreToUnpaid,
      filterByQuery: filterBillsByQuery,
      todaysPayments: getTodaysPayments(state.auditLog),
    }),
    [state, recordPayment, voidPayment, restoreToUnpaid],
  );

  return (
    <ReceptionBillsContext.Provider value={value}>
      {children}
    </ReceptionBillsContext.Provider>
  );
}

export function useReceptionBills() {
  const ctx = useContext(ReceptionBillsContext);
  if (!ctx) {
    throw new Error("useReceptionBills must be used within ReceptionBillsProvider");
  }
  return ctx;
}
