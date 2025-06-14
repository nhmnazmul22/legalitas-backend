"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Edit, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import api from "@/lib/config/axios";
import { toast } from "sonner";
import { setBanks } from "@/store/BankSlice";
import { fetchBanks } from "@/store/BankInfoSlice";

const BankInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: banks } = useSelector(
    (state: RootState) => state.bankInfo.items
  );

  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [bankId, setBankId] = useState("");
  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setBankName("");
    setAccountNo("");
    setAccountHolder("");
    setBankAddress("");
    setBankId("");
    setMode("add");
  };

  const saveBankInfo = async () => {
    try {
      setLoading(true);
      let res: any = {};
      if (mode === "edit") {
        res = await api.put(`/api/bank/${bankId}`, {
          bankName,
          accountNo,
          accountHolder,
          address: bankAddress,
        });
      } else {
        res = await api.post("/api/bank", {
          bankName,
          accountNo,
          accountHolder,
          address: bankAddress,
        });
      }
      if (res.status === 201) {
        toast.success(
          `Bank info ${mode === "edit" ? "updated" : "added"} successful`
        );
        dispatch(setBanks(res.data.data));
        dispatch(fetchBanks());
        reset();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        `Filed to ${mode === "edit" ? "updating" : "adding"} bank info`
      );
    } finally {
      setLoading(false);
      reset();
    }
  };

  const deleteBank = async (bankId: string) => {
    try {
      setLoading(true);
      const res = await api.delete(`/api/bank/${bankId}`);
      if (res.status === 200 || res.status === 201) {
        toast.success("Bank Delete Successful");
        dispatch(fetchBanks());
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Bank delete failed");
    } finally {
      setLoading(false);
    }
  };

  const addEditInfo = async (bankId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/bank/${bankId}`);
      if (res.status === 200 || res.status === 201) {
        const data = res.data.data;
        setBankName(data.bankName);
        setAccountNo(data.accountNo);
        setAccountHolder(data.accountHolder);
        setBankAddress(data.bankAddress);
        setBankId(String(bankId));
        setMode("edit");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Bank fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchBanks());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-8 h-8" />
          Info Bank Admin
        </CardTitle>
        <CardDescription>
          Tambahkan informasi bank admin untuk pembayaran
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bank-name">
            Nama Bank <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bank-name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Bank Nasional Ltd."
          />
        </div>
        <div>
          <Label htmlFor="bank-account-no">
            No. Rekening <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bank-account-no"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            placeholder="548624496254"
          />
        </div>
        <div>
          <Label htmlFor="bank-holder">
            Nama Pemilik Rekening <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bank-holder"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="Bapak Pemilik"
          />
        </div>
        <div>
          <Label htmlFor="bank-address">Alamat Bank</Label>
          <Textarea
            id="bank-address"
            value={bankAddress}
            onChange={(e) => setBankAddress(e.target.value)}
            placeholder="Jakarta, Indonesia"
            rows={3}
          />
        </div>

        <Button onClick={saveBankInfo} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? " Simpan Info..." : " Simpan Info"}
        </Button>
      </CardContent>
      {banks && banks.length > 0 && (
        <CardFooter className="flex flex-wrap gap-4 p-4">
          {banks.map((info) => (
            <div
              key={info.accountNo}
              className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.5rem)] bg-white shadow-md rounded-xl p-4 border border-gray-200 relative"
            >
              <div className="flex justify-end gap-2 absolute right-[10px]">
                <Button
                  variant="outline"
                  className="w-5 h-10"
                  onClick={() => addEditInfo(String(info._id!))}
                  disabled={loading}
                >
                  <Edit />
                </Button>
                <Button
                  variant="outline"
                  className="w-5 h-10"
                  onClick={() => deleteBank(String(info._id!))}
                  disabled={loading}
                >
                  <Trash />
                </Button>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 max-w-[85%]">
                {info.bankName}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Account No:</span>{" "}
                {info.accountNo}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Account Holder:</span>{" "}
                {info.accountHolder}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Bank Address:</span>{" "}
                {info.address}
              </p>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};

export default BankInfo;
