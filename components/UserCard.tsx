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
import SendProposal from "./SendProposal";
import Link from "next/link";
import CreateInvoiceDialog from "./CreateInvoiceDialog";

const UserCard: React.FC<UserType> = ({
  _id,
  fullName,
  email,
  status,
  whatsappNumber,
  service,
  proposalId,
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
              @{username} • {service} •{" "}
              {createdAt && `Bergabung: ${formatDate(createdAt)} `}
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

            <SendProposal
              userInfo={{
                _id,
                fullName,
                email,
                status,
                whatsappNumber,
                service,
                proposalId,
                username,
                createdAt,
              }}
            >
              <Button size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Kirim Proposal
              </Button>
            </SendProposal>

            <CreateInvoiceDialog
              userInfo={{ _id, fullName, service, proposalId, username }}
            >
              <Button variant="secondary" size="sm">
                <Receipt className="w-4 h-4 mr-2" />
                Kirim Invoice
              </Button>
            </CreateInvoiceDialog>
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
