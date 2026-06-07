import { useState } from "react";
import { usePharmacySales } from "../../context/PharmacySalesContext";
import { useReceptionToast } from "../../context/ReceptionToastContext";
import PageTransition from "../PageTransition";
import SaleConfirmScreen from "./SaleConfirmScreen";
import SaleMainScreen from "./SaleMainScreen";
import SaleSuccessScreen from "./SaleSuccessScreen";

export default function PharmacySale({ onViewSales }) {
  const { saveSale } = usePharmacySales();
  const { showToast } = useReceptionToast();
  const [step, setStep] = useState("sale");
  const [pendingSale, setPendingSale] = useState(null);
  const [completedSale, setCompletedSale] = useState(null);

  function handleProceedToConfirm(sale) {
    setPendingSale(sale);
    setStep("confirm");
  }

  function handleBack() {
    setStep("sale");
  }

  function handleComplete() {
    const record = saveSale(pendingSale);
    setCompletedSale({ ...pendingSale, record });
    setPendingSale(null);
    setStep("success");
    showToast("Sale recorded successfully");
  }

  function handleNewSale() {
    setCompletedSale(null);
    setPendingSale(null);
    setStep("sale");
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageTransition pageKey={step}>
        {step === "sale" && (
          <SaleMainScreen
            restore={
              pendingSale
                ? {
                    medicineName: pendingSale.medicineName,
                    quantity: pendingSale.quantity,
                    methodId: pendingSale.methodId ?? pendingSale.paymentTypeId,
                    amount: pendingSale.amount,
                  }
                : null
            }
            onConfirm={handleProceedToConfirm}
          />
        )}
        {step === "confirm" && pendingSale && (
          <SaleConfirmScreen
            sale={pendingSale}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}
        {step === "success" && completedSale && (
          <SaleSuccessScreen
            sale={completedSale}
            record={completedSale.record}
            onNewSale={handleNewSale}
            onViewSales={onViewSales ?? handleNewSale}
          />
        )}
      </PageTransition>
    </div>
  );
}
