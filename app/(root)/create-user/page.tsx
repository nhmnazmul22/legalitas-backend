"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/constants";
import api from "@/lib/config/axios";
import { RootState } from "@/store";
import { Send, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function CreateUserPage() {
  const proposal = useSelector((state: RootState) => state.proposal.proposal);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    service: "",
    username: "",
    password: "",
    notes: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createUser = async () => {
    const res = await api.post("/api/users/create-user", {
      ...form,
      proposalId: proposal.proposalDetails._id,
    });
    return res.data;
  };

  const handleSubmit = async (mode: "none" | "email" | "whatsapp") => {
    try {
      setLoading(true);
      const user = await createUser();
      toast("User Created Successful");

      const message = `Akun Anda berhasil dibuat!\nEmail: ${user.email}\nPassword: ${user.password}`;

      if (mode === "email") {
        window.open(
          `mailto:${form.email}?subject=Login Akses&body=${encodeURIComponent(
            message
          )}`,
          "_blank"
        );
      }

      if (mode === "whatsapp") {
        const phone = form.whatsappNumber.replace(/[^0-9]/g, "");
        window.open(
          `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      }
    } catch (error: any) {
      toast(error?.response?.data?.message || "Gagal membuat user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (proposal) {
      setForm((prev) => ({
        ...prev,
        fullName: proposal.clientName,
        email: proposal.clientEmail,
        whatsappNumber: proposal.clientWhatsAppNumber,
        service: proposal.proposalDetails.name,
      }));
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buat Akun User Baru</h1>
        <p className="text-muted-foreground">
          Buat akun login untuk klien yang sudah request proposal
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Form Buat Akun User
          </CardTitle>
          <CardDescription>
            Isi informasi berikut untuk membuat akun user baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full-name">Nama Lengkap</Label>
                <Input
                  id="full-name"
                  placeholder="Contoh: Siti Juliana"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sitijuliana12@gmail.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">No. WhatsApp</Label>
                <Input
                  id="phone"
                  placeholder="6281128383"
                  value={form.whatsappNumber}
                  onChange={(e) =>
                    handleChange("whatsappNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="service">Layanan</Label>
                <Select
                  key={form.service}
                  value={form.service}
                  onValueChange={(val) => handleChange("service", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="sitijuliana"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Buat password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan tentang klien atau layanan..."
                rows={3}
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="account-status">Status Akun</Label>
              <Select
                value={form.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                className="w-full"
                onClick={() => handleSubmit("none")}
                disabled={loading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Buat Akun User
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSubmit("email")}
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                Buat Akun & Kirim Kredensial via Email
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleSubmit("whatsapp")}
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                Buat Akun & Kirim Kredensial via WhatsApp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
