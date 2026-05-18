import { IconCash, IconMobilePay, IconWallet } from "../icons";

export function getPaymentMethodIcon(methodId) {
  if (methodId === "cash") return IconCash;
  if (methodId === "ebirr") return IconWallet;
  if (methodId === "telebirr") return IconMobilePay;
  return IconMobilePay;
}
