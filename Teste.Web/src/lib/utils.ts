import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const convertCurrencyToNumber = (amount: string): number => {
  return parseFloat(
    amount
      ?.replace("R$", "")
      ?.replace(".", "")
      ?.replace(",", ".")
      ?.replace(/\s/g, "")
  );
};
