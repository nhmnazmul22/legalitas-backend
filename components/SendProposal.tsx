"use client";
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
import { Button } from "./ui/button";
import { FileText, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { UserType } from "@/types";
import api from "@/lib/config/axios";
import { toast } from "sonner";
type SendProposalType = {
  children: React.ReactNode;
  userInfo: UserType;
};

const SendProposal: React.FC<SendProposalType> = ({ children, userInfo }) => {
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setServiceTitle("");
    setServicePrice("");
    setServiceDetails("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        proposalTitle: serviceTitle,
        proposalContent: serviceDetails,
        proposalPrice: servicePrice,
        proposalId: userInfo.proposalId,
        clientId: userInfo._id,
      };

      const res = await api.post("/api/proposals/send-proposal", data);
      if (res.status === 201) {
        toast.success("Propose send successful");
        reset();
      }
    } catch (err: any) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
      reset();
    }
  };

  useEffect(() => {
    setServiceTitle(userInfo.service || "");
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kirim Proposal</DialogTitle>
          <DialogDescription>
            Kirim proposal ke {userInfo.fullName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="proposal-title">Proposal Title</Label>
            <Input
              id="proposal-title"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              placeholder="Contoh: Proposal Pendirian PT"
            />
          </div>
          <div>
            <Label htmlFor="proposal-content">Isi Proposal</Label>
            <Textarea
              id="proposal-content"
              placeholder="Tulis detail proposal..."
              value={serviceDetails}
              onChange={(e) => setServiceDetails(e.target.value)}
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="proposal-price">Harga</Label>
            <Input
              id="proposal-price"
              placeholder="Rp 3,000,000"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? " Kirim Proposal..." : "Kirim Proposal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendProposal;
