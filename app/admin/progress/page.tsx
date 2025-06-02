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
import { Progress } from "@/components/ui/progress"
import { Edit, Save, Plus } from "lucide-react"

export default function ProgressPage() {
  const projects = [
    {
      id: "PRJ001",
      client: "Siti Juliana",
      service: "Pendirian PT",
      status: "Dalam Progress",
      progress: 60,
      currentStep: "Dokumen Review",
      steps: [
        { name: "Konsultasi Awal", status: "completed" },
        { name: "Persiapan Dokumen", status: "completed" },
        { name: "Dokumen Review", status: "current" },
        { name: "Proses Notaris", status: "pending" },
        { name: "Pendaftaran Kemenkumham", status: "pending" },
        { name: "Selesai", status: "pending" },
      ],
      lastUpdate: "2024-01-15",
    },
    {
      id: "PRJ002",
      client: "Ahmad Rizki",
      service: "Pendirian CV",
      status: "Dalam Progress",
      progress: 80,
      currentStep: "Proses Notaris",
      steps: [
        { name: "Konsultasi Awal", status: "completed" },
        { name: "Persiapan Dokumen", status: "completed" },
        { name: "Dokumen Review", status: "completed" },
        { name: "Proses Notaris", status: "current" },
        { name: "Pendaftaran", status: "pending" },
        { name: "Selesai", status: "pending" },
      ],
      lastUpdate: "2024-01-14",
    },
    {
      id: "PRJ003",
      client: "Maya Sari",
      service: "Trademark",
      status: "Selesai",
      progress: 100,
      currentStep: "Selesai",
      steps: [
        { name: "Konsultasi Awal", status: "completed" },
        { name: "Persiapan Dokumen", status: "completed" },
        { name: "Pendaftaran DJKI", status: "completed" },
        { name: "Pemeriksaan Substantif", status: "completed" },
        { name: "Sertifikat Terbit", status: "completed" },
        { name: "Selesai", status: "completed" },
      ],
      lastUpdate: "2024-01-13",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Pekerjaan</h1>
          <p className="text-muted-foreground">Pantau dan update progress pekerjaan klien</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Progress Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Progress Pekerjaan Baru</DialogTitle>
              <DialogDescription>Buat tracking progress untuk pekerjaan klien baru</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="select-client">Pilih Klien</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih klien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siti">Siti Juliana</SelectItem>
                    <SelectItem value="ahmad">Ahmad Rizki</SelectItem>
                    <SelectItem value="maya">Maya Sari</SelectItem>
                    <SelectItem value="budi">Budi Santoso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service-type">Jenis Layanan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendirian-pt">Pendirian PT</SelectItem>
                    <SelectItem value="pendirian-cv">Pendirian CV</SelectItem>
                    <SelectItem value="trademark">Trademark</SelectItem>
                    <SelectItem value="izin-usaha">Izin Usaha</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="initial-step">Step Awal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih step awal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="konsultasi">Konsultasi Awal</SelectItem>
                    <SelectItem value="dokumen">Persiapan Dokumen</SelectItem>
                    <SelectItem value="review">Dokumen Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="initial-notes">Catatan Awal</Label>
                <Textarea id="initial-notes" placeholder="Catatan untuk pekerjaan ini..." rows={3} />
              </div>
              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Buat Progress Pekerjaan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.client}
                    <Badge variant={project.status === "Selesai" ? "secondary" : "default"}>{project.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {project.service} • Update terakhir: {project.lastUpdate}
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Update Progress
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Update Progress Pekerjaan</DialogTitle>
                      <DialogDescription>
                        Update progress untuk {project.client} - {project.service}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-step">Step Saat Ini</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih step saat ini" />
                          </SelectTrigger>
                          <SelectContent>
                            {project.steps.map((step, index) => (
                              <SelectItem key={index} value={step.name}>
                                {step.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="progress-percentage">Persentase Progress</Label>
                        <Input
                          id="progress-percentage"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={project.progress}
                        />
                      </div>
                      <div>
                        <Label htmlFor="update-notes">Catatan Update</Label>
                        <Textarea id="update-notes" placeholder="Tulis update progress..." rows={4} />
                      </div>
                      <div>
                        <Label htmlFor="notify-client">Notifikasi ke Klien</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode notifikasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="both">Email & WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan & Kirim Update
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress: {project.currentStep}</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Timeline Pekerjaan:</Label>
                <div className="space-y-2">
                  {project.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : step.status === "current"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          step.status === "completed"
                            ? "text-green-600"
                            : step.status === "current"
                              ? "text-blue-600"
                              : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
