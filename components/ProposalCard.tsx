"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, UserPlus } from "lucide-react";
import { RequestedProposal } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setProposal } from "@/store/proposalSlice";
import type { AppDispatch } from "@/store";
export const ProposalCard: React.FC<RequestedProposal> = ({
  clientName,
  clientEmail,
  clientWhatsAppNumber,
  status,
  createdAt,
  proposalDetails,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const addProposalInfo = () => {
    dispatch(
      setProposal({
        clientName,
        clientEmail,
        clientWhatsAppNumber,
        status,
        createdAt,
        proposalDetails,
      })
    );
    return;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {clientName}
              <Badge
                variant={
                  status === "rejected"
                    ? "destructive"
                    : status === "Review"
                    ? "default"
                    : "secondary"
                }
              >
                {status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {proposalDetails.name} • {proposalDetails.price} •{" "}
              {formatDate(createdAt!)}
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
                  <DialogDescription>
                    Informasi lengkap permintaan dari {clientName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Klien</Label>
                      <p className="font-medium">{clientName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{clientEmail}</p>
                    </div>
                    <div>
                      <Label>No. WhatsApp</Label>
                      <p className="font-medium">{clientWhatsAppNumber}</p>
                    </div>
                    <div>
                      <Label>Layanan</Label>
                      <p className="font-medium">{proposalDetails.name}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <p className="text-sm text-muted-foreground">
                      {proposalDetails.category}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Link href="/create-user" onClick={addProposalInfo}>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Buat Akun
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Email:</strong> {clientEmail}
            </p>
            <p className="text-sm">
              <strong>WhatsApp:</strong> {clientWhatsAppNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              {proposalDetails.category}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
