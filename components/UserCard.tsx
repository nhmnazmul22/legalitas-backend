"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { UserType } from "@/types";
import { Eye, FileText, Receipt, Send } from "lucide-react";

const UserCard: React.FC<UserType> = ({
  fullName,
  email,
  status,
  whatsappNumber,
  service,
  username,
  createdAt,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {fullName}
              <Badge
                className={`${
                  status === "aktif"
                    ? "bg-green-500 hover:bg-green-500"
                    : status === "pending"
                    ? "bg-yellow-500 hover:bg-yellow-500"
                    : "bg-destructive hover:bg-destructive"
                }`}
              >
                {status}
              </Badge>
            </CardTitle>
            <CardDescription>
              @{username} • {service} • {createdAt && `Bergabung: ${formatDate(createdAt)} `}
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
                  <DialogDescription>
                    Informasi lengkap user {fullName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Lengkap</Label>
                      <p className="font-medium">{fullName}</p>
                    </div>
                    <div>
                      <Label>Username</Label>
                      <p className="font-medium">@{username}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{email}</p>
                    </div>
                    <div>
                      <Label>No. WhatsApp</Label>
                      <p className="font-medium">{whatsappNumber}</p>
                    </div>
                    <div>
                      <Label>Layanan</Label>
                      <p className="font-medium">{service}</p>
                    </div>
                    {/* <div>
                      <Label>Progress</Label>
                      <p className="font-medium">{user.progress}</p>
                    </div> */}
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
                  <DialogDescription>
                    Kirim proposal ke {fullName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="proposal-title">Judul Proposal</Label>
                    <Input
                      id="proposal-title"
                      placeholder="Contoh: Proposal Pendirian PT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proposal-content">Isi Proposal</Label>
                    <Textarea
                      id="proposal-content"
                      placeholder="Tulis detail proposal..."
                      rows={6}
                    />
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
                  <DialogDescription>
                    Buat dan kirim invoice ke {fullName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invoice-number">Nomor Invoice</Label>
                    <Input id="invoice-number" placeholder="INV-001" />
                  </div>
                  <div>
                    <Label htmlFor="invoice-service">Layanan</Label>
                    <Input id="invoice-service" defaultValue={service} />
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
                    <Textarea
                      id="invoice-notes"
                      placeholder="Catatan tambahan..."
                    />
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
            <strong>Email:</strong> {email}
          </p>
          <p className="text-sm">
            <strong>WhatsApp:</strong> {whatsappNumber}
          </p>
          {/* <p className="text-sm">
            <strong>Progress:</strong> 70%
          </p> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
