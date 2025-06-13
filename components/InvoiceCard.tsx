"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Eye, Send, Download } from "lucide-react";
import { InvoiceType } from "@/types";
import { Button } from "./ui/button";
import StatusBadge from "./common/StatusBadge";
import { toast } from "sonner";
import api from "@/lib/config/axios";
import { useState } from "react";

type InvoiceCardType = {
  invoice: InvoiceType;
};

const InvoiceCard: React.FC<InvoiceCardType> = ({ invoice }) => {
  const [loading, setLoading] = useState(false);

  const downloadPdf = async () => {
    try {
      setLoading(true);
      const res = await api.post(
        `/api/invoices/generate-pdf/${invoice.invNo}`,
        invoice,
        { responseType: "blob" }
      );
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${invoice.invNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        toast.success("Pdf downloaded");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {invoice.invNo} - {invoice.clientDetails?.fullName}
              <StatusBadge status={invoice.status} />
            </CardTitle>
            <CardDescription>
              {invoice.service} • {invoice.amount} • Jatuh tempo:{" "}
              {formatDate(invoice.dueDate || "")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Detail
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Detail Invoice {invoice.invNo}</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap invoice
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nomor Invoice</Label>
                      <p className="font-medium">{invoice.invNo}</p>
                    </div>
                    <div>
                      <Label>Klien</Label>
                      <p className="font-medium">
                        {invoice.clientDetails?.fullName}
                      </p>
                    </div>
                    <div>
                      <Label>Layanan</Label>
                      <p className="font-medium">{invoice.service}</p>
                    </div>
                    <div>
                      <Label>Jumlah</Label>
                      <p className="font-medium">{invoice.amount}</p>
                    </div>
                    <div>
                      <Label>Tanggal Terbit</Label>
                      <p className="font-medium">
                        {formatDate(invoice.createdAt || "")}
                      </p>
                    </div>
                    <div>
                      <Label>Jatuh Tempo</Label>
                      <p className="font-medium">
                        {formatDate(invoice.dueDate || "")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <p className="text-sm text-muted-foreground">
                      {invoice.description}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" onClick={downloadPdf} disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              {loading ? "Downloading..." : "Download PDF"}
            </Button>

            <Button variant="secondary" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Kirim Ulang
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Tanggal Terbit:</strong>{" "}
            {formatDate(invoice.createdAt || "")}
          </p>
          <p className="text-sm">
            <strong>Deskripsi:</strong> {invoice.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
