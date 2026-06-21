import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string, locale: string = "id"): string {
  return new Date(dateStr).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

export function formatDateShort(dateStr: string, locale: string = "id"): string {
  return new Date(dateStr).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    { year: "numeric", month: "short" }
  );
}
