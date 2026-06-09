import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  filterSalesByQuery,
  getTodaysSales,
  loadPersistedSales,
  persistSales,
  recordSale,
} from "../data/pharmacySaleStore";

const PharmacySalesContext = createContext(null);

export function PharmacySalesProvider({ children }) {
  const [sales, setSales] = useState(loadPersistedSales);

  useEffect(() => {
    function syncFromStorage() {
      setSales(loadPersistedSales());
    }

    window.addEventListener("pharmacy-sales-updated", syncFromStorage);
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("focus", syncFromStorage);

    return () => {
      window.removeEventListener("pharmacy-sales-updated", syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("focus", syncFromStorage);
    };
  }, []);

  const saveSale = useCallback((saleInput) => {
    let saleRecord = null;
    setSales((prev) => {
      const next = recordSale(prev, saleInput);
      saleRecord = next.saleRecord;
      persistSales(next.sales);
      return next.sales;
    });
    return saleRecord;
  }, []);

  const value = useMemo(
    () => ({
      sales,
      todaysSales: getTodaysSales(sales),
      saveSale,
      filterByQuery: filterSalesByQuery,
    }),
    [sales, saveSale],
  );

  return (
    <PharmacySalesContext.Provider value={value}>{children}</PharmacySalesContext.Provider>
  );
}

export function usePharmacySales() {
  const ctx = useContext(PharmacySalesContext);
  if (!ctx) {
    throw new Error("usePharmacySales must be used within PharmacySalesProvider");
  }
  return ctx;
}
