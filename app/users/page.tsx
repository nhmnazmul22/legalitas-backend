"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Send, FileText, Receipt } from "lucide-react"

export default function UsersPage() {
  const users = [
    {
      id: "USR001",
      username: "sitijuliana",
      name: "Siti Juliana",
      email: "sitijuliana12@gmail.com",
      phone: "6281128383",
      status: "Aktif",
      service: "Pendirian PT",
      progress: "Dokumen Review",
      joinDate: "2024-01-15",
    },
    {
      id: "USR002",
      username: "ahmadrizki",
      name: "Ahmad Rizki",
      email: "ahmad.rizki@email.com",
      phone: "6281234567",
      status: "Aktif",
      service: "Pendirian CV",
      progress: "Proses Notaris",
      joinDate: "2024-01-14",
    },
    {
      id: "USR003",
      username: "mayasari",
      name: "Maya Sari",
      email: "maya.sari@email.com",
      phone: "6281987654",
      status: "Completed",
      service: "Trademark",
      progress: "Selesai",
      joinDate: "2024-01-13",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <p className="text-muted-foreground">Kelola akun user dan kirim proposal/invoice</p>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {user.name}
                    <Badge
                      variant={
                        user.status === "Aktif" ? "default" : user.status === "Completed" ? "secondary" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    @{user.username} • {user.service} • Bergabung: {user.joinDate}
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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detail User</DialogTitle>
                        <DialogDescription>Informasi lengkap user {user.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nama Lengkap</Label>
                            <p className="font-medium">{user.name}</p>
                          </div>
                          <div>
                            <Label>Username</Label>
                            <p className="font-medium">@{user.username}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          <div>
                            <Label>No. WhatsApp</Label>
                            <p className="font-medium">{user.phone}</p>
                          </div>
                          <div>
                            <Label>Layanan</Label>
                            <p className="font-medium">{user.service}</p>
                          </div>
                          <div>
                            <Label>Progress</Label>
                            <p className="font-medium">{user.progress}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Kirim Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kirim Proposal</DialogTitle>
                        <DialogDescription>Kirim proposal ke {user.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="proposal-title">Judul Proposal</Label>
                          <Input id="proposal-title" placeholder="Contoh: Proposal Pendirian PT" />
                        </div>
                        <div>
                          <Label htmlFor="proposal-content">Isi Proposal</Label>
                          <Textarea id="proposal-content" placeholder="Tulis detail proposal..." rows={6} />
                        </div>
                        <div>
                          <Label htmlFor="proposal-price">Harga</Label>
                          <Input id="proposal-price" placeholder="Rp 3,000,000" />
                        </div>
                        <Button className="w-full">
                          <Send className="w-4 h-4 mr-2" />
                          Kirim Proposal
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <Receipt className="w-4 h-4 mr-2" />
                        Kirim Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kirim Invoice</DialogTitle>
                        <DialogDescription>Buat dan kirim invoice ke {user.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="invoice-number">Nomor Invoice</Label>
                          <Input id="invoice-number" placeholder="INV-001" />
                        </div>
                        <div>
                          <Label htmlFor="invoice-service">Layanan</Label>
                          <Input id="invoice-service" defaultValue={user.service} />
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
                          <Label htmlFor="invoice-notes">Catatan</Label>
                          <Textarea id="invoice-notes" placeholder="Catatan tambahan..." />
                        </div>
                        <Button className="w-full">
                          <Send className="w-4 h-4 mr-2" />
                          Kirim Invoice
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm">
                  <strong>WhatsApp:</strong> {user.phone}
                </p>
                <p className="text-sm">
                  <strong>Progress:</strong> {user.progress}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
