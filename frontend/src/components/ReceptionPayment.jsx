import { useState } from "react";
import { useReceptionBills } from "../context/ReceptionBillsContext";
import { useReceptionToast } from "../context/ReceptionToastContext";
import PageTransition from "./PageTransition";
import PaymentConfirmScreen from "./reception/PaymentConfirmScreen";
import PaymentMainScreen from "./reception/PaymentMainScreen";
import PaymentSuccessScreen from "./reception/PaymentSuccessScreen";

export default function ReceptionPayment({ onViewToday }) {
  const { recordPayment } = useReceptionBills();
  const { showToast } = useReceptionToast();
  const [step, setStep] = useState("payment");
  const [pendingPayment, setPendingPayment] = useState(null);
  const [completedPayment, setCompletedPayment] = useState(null);

  function handleProceedToConfirm(payment) {
    setPendingPayment(payment);
    setStep("confirm");
  }

  function handleBack() {
    setStep("payment");
  }

  function handleComplete() {
    const record = recordPayment(pendingPayment);
    setCompletedPayment({ ...pendingPayment, record });
    setPendingPayment(null);
    setStep("success");
    showToast("Payment recorded successfully");
  }

  function handleNewPayment() {
    setCompletedPayment(null);
    setPendingPayment(null);
    setStep("payment");
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageTransition pageKey={step}>
        {step === "payment" && (
          <PaymentMainScreen
            restore={
              pendingPayment
                ? {
                    bill: pendingPayment.bill,
                    methodId: pendingPayment.methodId,
                    amount: pendingPayment.amount,
                    query: pendingPayment.bill.patientName,
                  }
                : null
            }
            onConfirm={handleProceedToConfirm}
          />
        )}
        {step === "confirm" && pendingPayment && (
          <PaymentConfirmScreen
            payment={pendingPayment}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}
        {step === "success" && completedPayment && (
          <PaymentSuccessScreen
            payment={completedPayment}
            record={completedPayment.record}
            onNewPayment={handleNewPayment}
            onViewToday={onViewToday ?? handleNewPayment}
          />
        )}
      </PageTransition>
    </div>
  );
}
