"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Plus, Send } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useState, useEffect } from "react";
import { fetchUsers } from "@/store/UsersSlice";
import { toast } from "sonner";
import { fetchBanks } from "@/store/BankInfoSlice";
import api from "@/lib/config/axios";
import { UserType } from "@/types";
import { fetchProposalById } from "@/store/ProposalSliceById";

type CreateInvoiceDialogType = {
  children: React.ReactNode;
  onSuccess?: () => void;
  userInfo?: UserType;
};

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogType> = ({
  children,
  onSuccess,
  userInfo,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector(
    (state: RootState) => state.users.items,
    shallowEqual
  );
  const banksData = useSelector(
    (state: RootState) => state.bankInfo.items,
    shallowEqual
  );
  const proposalData = useSelector(
    (state: RootState) => state.proposalInfo.items,
    shallowEqual
  );

  const [clientId, setClientId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setClientId("");
    setService("");
    setAmount("");
    setDueDate("");
    setDescription("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        service,
        amount,
        description,
        dueDate,
        clientId,
        paymentId,
      };

      const res = await api.post("/api/invoices", data);
      if (res.status === 201) {
        toast.success("Invoice Create Successful");
        reset();
        onSuccess && onSuccess();
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
    dispatch(fetchUsers());
    dispatch(fetchBanks());
  }, []);

  useEffect(() => {
    if (userInfo?.proposalId) {
      dispatch(fetchProposalById(userInfo.proposalId));
    }
  }, [userInfo?.proposalId]);

  useEffect(() => {
    if (userInfo) {
      setClientId(String(userInfo._id) || "");
      setService(userInfo.service || "");
    }
  }, [userInfo]);

  useEffect(() => {
    if (proposalData?.data?.price) {
      setAmount(proposalData.data.price);
    }
  }, [proposalData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Invoice Baru</DialogTitle>
          <DialogDescription>Buat invoice untuk klien</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="client-select">Pilih Klien</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih klien" />
              </SelectTrigger>
              <SelectContent>
                {userData.data ? (
                  userData.data.map((user) => (
                    <SelectItem key={String(user._id)} value={String(user._id)}>
                      {user.fullName}{" "}
                      <span className="text-[10px] ms-2">{`(${user.username})`}</span>
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-center my-5 ">Loading...</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="invoice-service">Layanan</Label>
            <Input
              id="invoice-service"
              placeholder="Contoh: Pendirian PT"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="invoice-amount">Jumlah</Label>
            <Input
              id="invoice-amount"
              placeholder="Rp 3,000,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="invoice-due">Jatuh Tempo</Label>
            <Input
              id="invoice-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bank-select">Pilih Bank</Label>
            <Select value={paymentId} onValueChange={setPaymentId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Bank" />
              </SelectTrigger>
              <SelectContent>
                {banksData.data ? (
                  banksData.data.map((bank) => (
                    <SelectItem key={String(bank._id)} value={String(bank._id)}>
                      <div className="flex gap-2 items-center">
                        <Building size={16} />
                        <span> {bank.bankName}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-center my-5 ">Loading...</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="invoice-desc">Deskripsi</Label>
            <Textarea
              id="invoice-desc"
              placeholder="Deskripsi layanan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button className="w-full" disabled={loading} onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Buat & Kirim Invoice..." : "Buat & Kirim Invoice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
