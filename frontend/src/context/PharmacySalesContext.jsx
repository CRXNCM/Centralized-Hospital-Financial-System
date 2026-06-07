import { createContext, useCallback, useContext, useMemo, useState } from "react";
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
