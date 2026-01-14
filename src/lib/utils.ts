import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTemp = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

// Format date to Thai locale
export const formatThaiDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time to 24hr
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Check if string is empty or whitespace
export const isEmptyString = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

// Format percentage
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`;
};
