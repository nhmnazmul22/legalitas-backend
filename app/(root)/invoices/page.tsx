"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Plus, Send, Download } from "lucide-react"

export default function InvoicesPage() {
  const invoices = [
    {
      id: "INV-001",
      client: "Siti Juliana",
      service: "Pendirian PT",
      amount: "Rp 3,000,000",
      status: "Pending",
      dueDate: "2024-01-25",
      issueDate: "2024-01-15",
      description: "Jasa pendirian PT termasuk akta notaris dan SK Kemenkumham",
    },
    {
      id: "INV-002",
      client: "Ahmad Rizki",
      service: "Pendirian CV",
      amount: "Rp 2,500,000",
      status: "Paid",
      dueDate: "2024-01-24",
      issueDate: "2024-01-14",
      description: "Jasa pendirian CV lengkap dengan dokumen pendukung",
    },
    {
      id: "INV-003",
      client: "Maya Sari",
      service: "Trademark",
      amount: "Rp 1,500,000",
      status: "Overdue",
      dueDate: "2024-01-20",
      issueDate: "2024-01-10",
      description: "Pendaftaran merek dagang di DJKI",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Invoice</h1>
          <p className="text-muted-foreground">Kelola semua invoice klien</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Buat Invoice Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Invoice Baru</DialogTitle>
              <DialogDescription>Buat invoice untuk klien</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-select">Pilih Klien</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih klien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siti">Siti Juliana</SelectItem>
                    <SelectItem value="ahmad">Ahmad Rizki</SelectItem>
                    <SelectItem value="maya">Maya Sari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoice-service">Layanan</Label>
                <Input id="invoice-service" placeholder="Contoh: Pendirian PT" />
              </div>
              <div>
                <Label htmlFor="invoice-amount">Jumlah</Label>
                <Input id="invoice-amount" placeholder="Rp 3,000,000" />
              </div>
              <div>
                <Label htmlFor="invoice-due">Jatuh Tempo</Label>
                <Input id="invoice-due" type="date" />
              </div>
              <div>
                <Label htmlFor="invoice-desc">Deskripsi</Label>
                <Textarea id="invoice-desc" placeholder="Deskripsi layanan..." />
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Buat & Kirim Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {invoice.id} - {invoice.client}
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "secondary"
                          : invoice.status === "Pending"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {invoice.service} • {invoice.amount} • Jatuh tempo: {invoice.dueDate}
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
                        <DialogTitle>Detail Invoice {invoice.id}</DialogTitle>
                        <DialogDescription>Informasi lengkap invoice</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nomor Invoice</Label>
                            <p className="font-medium">{invoice.id}</p>
                          </div>
                          <div>
                            <Label>Klien</Label>
                            <p className="font-medium">{invoice.client}</p>
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
                            <p className="font-medium">{invoice.issueDate}</p>
                          </div>
                          <div>
                            <Label>Jatuh Tempo</Label>
                            <p className="font-medium">{invoice.dueDate}</p>
                          </div>
                        </div>
                        <div>
                          <Label>Deskripsi</Label>
                          <p className="text-sm text-muted-foreground">{invoice.description}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
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
                  <strong>Tanggal Terbit:</strong> {invoice.issueDate}
                </p>
                <p className="text-sm">
                  <strong>Deskripsi:</strong> {invoice.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
