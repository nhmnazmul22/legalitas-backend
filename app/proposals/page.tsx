"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, UserPlus, Send } from "lucide-react"

export default function ProposalsPage() {
  const [selectedProposal, setSelectedProposal] = useState(null)

  const proposals = [
    {
      id: "PR001",
      client: "Siti Juliana",
      email: "sitijuliana12@gmail.com",
      phone: "6281128383",
      service: "Pendirian PT",
      price: "Rp 3,000,000",
      status: "Baru",
      date: "2024-01-15",
      description: "Ingin mendirikan PT untuk usaha perdagangan",
    },
    {
      id: "PR002",
      client: "Ahmad Rizki",
      email: "ahmad.rizki@email.com",
      phone: "6281234567",
      service: "Pendirian CV",
      price: "Rp 2,500,000",
      status: "Review",
      date: "2024-01-14",
      description: "Mendirikan CV untuk jasa konsultan",
    },
    {
      id: "PR003",
      client: "Maya Sari",
      email: "maya.sari@email.com",
      phone: "6281987654",
      service: "Trademark",
      price: "Rp 1,500,000",
      status: "Approved",
      date: "2024-01-13",
      description: "Pendaftaran merek dagang produk fashion",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permintaan Proposal</h1>
        <p className="text-muted-foreground">Kelola semua permintaan proposal dari klien</p>
      </div>

      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {proposal.client}
                    <Badge
                      variant={
                        proposal.status === "Baru"
                          ? "destructive"
                          : proposal.status === "Review"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {proposal.service} • {proposal.price} • {proposal.date}
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
                        <DialogTitle>Detail Permintaan Proposal</DialogTitle>
                        <DialogDescription>Informasi lengkap permintaan dari {proposal.client}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nama Klien</Label>
                            <p className="font-medium">{proposal.client}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="font-medium">{proposal.email}</p>
                          </div>
                          <div>
                            <Label>No. WhatsApp</Label>
                            <p className="font-medium">{proposal.phone}</p>
                          </div>
                          <div>
                            <Label>Layanan</Label>
                            <p className="font-medium">{proposal.service}</p>
                          </div>
                        </div>
                        <div>
                          <Label>Deskripsi</Label>
                          <p className="text-sm text-muted-foreground">{proposal.description}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Buat Akun
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Buat Akun User</DialogTitle>
                        <DialogDescription>Buat akun login untuk {proposal.client}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue={proposal.client.toLowerCase().replace(" ", "")} />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" placeholder="Buat password" />
                        </div>
                        <div>
                          <Label htmlFor="status">Status Akun</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">
                          <Send className="w-4 h-4 mr-2" />
                          Buat Akun & Kirim Kredensial
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm">
                    <strong>Email:</strong> {proposal.email}
                  </p>
                  <p className="text-sm">
                    <strong>WhatsApp:</strong> {proposal.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
