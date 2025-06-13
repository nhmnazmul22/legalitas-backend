import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  const formatted = new Date(date).toLocaleDateString("en-GB");
  return formatted;
};

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://legalitas.vercel.app",
  "https://202.74.74.123",
];

export function getCorsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400", // 1 day cache for preflight
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export function truncateText(text: string, maxLength: number) {
  if (typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateInvoiceNumber() {
  const randomNum = Math.floor(Math.random() * 90000) + 10000;
  return `INV-${randomNum}`;
}

export function convertMb(bytes: number) {
  let fileSize = "";
  if (bytes <= 1024000) {
    fileSize = `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    fileSize = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return fileSize;
}
