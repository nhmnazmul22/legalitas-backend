import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";
import StoreProvider from "@/context/StoreProvider";

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
      <body className={`${poppinsSans.className} antialiased`}>
        <SidebarProvider>
          <AdminSidebar />
          <main className="flex-1">
            <StoreProvider>{children}</StoreProvider>
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
