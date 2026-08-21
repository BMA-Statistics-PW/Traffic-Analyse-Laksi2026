import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function n(value: number, digits = 0) {
  return value.toLocaleString("th-TH", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function hourLabel(h: string) {
  return h.replaceAll(".", ":");
}
