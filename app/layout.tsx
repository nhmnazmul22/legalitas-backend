import { Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";

const poppinsSans = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${poppinsSans.className} antialiased`}>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Admin Panel | Mitra Jasa Legalitas Surabaya",
  description: "Mitra Jasa Legalitas Surabaya",
};
