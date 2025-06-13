"use client";

import { Button } from "@/components/ui/button";

import { Eye, Plus, Send, Download } from "lucide-react";
import CreateInvoiceDialog from "@/components/CreateInvoiceDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { fetchInvoices } from "@/store/InvoiceSlice";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import InvoiceCard from "@/components/InvoiceCard";

export default function InvoicesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: invoiceData } = useSelector(
    (state: RootState) => state.invoices
  );

  useEffect(() => {
    dispatch(fetchInvoices());
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Invoice</h1>
          <p className="text-muted-foreground">Kelola semua invoice klien</p>
        </div>
        <CreateInvoiceDialog onSuccess={fetchInvoices}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Buat Invoice Baru
          </Button>
        </CreateInvoiceDialog>
      </div>

      <div className="grid gap-6">
        {invoiceData?.data && invoiceData.data.length > 0 ? (
          invoiceData.data.map((invoice) => (
            <InvoiceCard key={invoice._id} invoice={invoice} />
          ))
        ) : (
          <SkeletonCard />
        )}
      </div>
    </div>
  );
}
