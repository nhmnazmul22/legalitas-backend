"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Mail,
  MessageSquare,
  Bell,
  Shield,
  Database,
  Palette,
  Building,
} from "lucide-react";
import AdminInfo from "@/components/AdminInfo";
import BankInfo from "@/components/BankInfo";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan sistem admin panel
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="adminInfo">Admin Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>
                Konfigurasi dasar sistem admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Nama Perusahaan</Label>
                <Input id="company-name" defaultValue="Legalitas.org" />
              </div>
              <div>
                <Label htmlFor="company-address">Alamat Perusahaan</Label>
                <Textarea
                  id="company-address"
                  defaultValue="Jakarta, Indonesia"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-phone">Telepon</Label>
                  <Input id="company-phone" defaultValue="+62 21 1234 5678" />
                </div>
                <div>
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    defaultValue="admin@legalitas.org"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timezone">Zona Waktu</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih zona waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wib">WIB (UTC+7)</SelectItem>
                    <SelectItem value="wita">WITA (UTC+8)</SelectItem>
                    <SelectItem value="wit">WIT (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adminInfo" className="space-y-6">
          <AdminInfo />
          <BankInfo />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Atur kapan dan bagaimana notifikasi dikirim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Proposal Baru</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi saat ada permintaan proposal baru
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Pembayaran</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi saat ada pembayaran invoice
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Progress Update</Label>
                  <p className="text-sm text-muted-foreground">
                    Kirim notifikasi ke klien saat progress diupdate
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Invoice Overdue</Label>
                  <p className="text-sm text-muted-foreground">
                    Kirim reminder untuk invoice yang terlambat
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan Notifikasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Pengaturan Email
              </CardTitle>
              <CardDescription>
                Konfigurasi SMTP untuk pengiriman email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" placeholder="admin@legalitas.org" />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="smtp-ssl" />
                <Label htmlFor="smtp-ssl">Gunakan SSL/TLS</Label>
              </div>
              <div>
                <Label htmlFor="email-template">Template Email Default</Label>
                <Textarea
                  id="email-template"
                  placeholder="Template email untuk notifikasi..."
                  rows={6}
                  defaultValue="Halo {nama_klien},

Terima kasih telah menggunakan layanan Legalitas.org.

{konten_email}

Salam,
Tim Legalitas.org"
                />
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Pengaturan WhatsApp
              </CardTitle>
              <CardDescription>
                Konfigurasi WhatsApp API untuk notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wa-api-url">WhatsApp API URL</Label>
                <Input
                  id="wa-api-url"
                  placeholder="https://api.whatsapp.com/..."
                />
              </div>
              <div>
                <Label htmlFor="wa-token">API Token</Label>
                <Input
                  id="wa-token"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <Label htmlFor="wa-phone">Nomor WhatsApp Business</Label>
                <Input id="wa-phone" placeholder="6281234567890" />
              </div>
              <div>
                <Label htmlFor="wa-template">Template Pesan WhatsApp</Label>
                <Textarea
                  id="wa-template"
                  placeholder="Template pesan WhatsApp..."
                  rows={6}
                  defaultValue="Halo *{nama_klien}*,

{konten_pesan}

Terima kasih,
*Legalitas.org*"
                />
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan WhatsApp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>
                Konfigurasi keamanan sistem admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan 2FA untuk keamanan tambahan
                  </p>
                </div>
                <Switch />
              </div>
              <div>
                <Label htmlFor="session-timeout">Session Timeout (menit)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
              <div>
                <Label htmlFor="max-login-attempts">
                  Maksimal Percobaan Login
                </Label>
                <Input id="max-login-attempts" type="number" defaultValue="5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Logout</Label>
                  <p className="text-sm text-muted-foreground">
                    Logout otomatis saat tidak aktif
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan Keamanan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Pengaturan Backup
              </CardTitle>
              <CardDescription>
                Konfigurasi backup otomatis data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup Otomatis</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan backup otomatis harian
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <Label htmlFor="backup-time">Waktu Backup</Label>
                <Input id="backup-time" type="time" defaultValue="02:00" />
              </div>
              <div>
                <Label htmlFor="backup-retention">Simpan Backup (hari)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="backup-location">Lokasi Backup</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi backup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Server</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="both">Local + Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Pengaturan
                </Button>
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Backup Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
