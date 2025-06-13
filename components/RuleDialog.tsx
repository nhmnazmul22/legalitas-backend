"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RuleType } from "@/types";
import { Button } from "./ui/button";
import api from "@/lib/config/axios";
import { toast } from "sonner";

type RuleDialogType = {
  children: React.ReactNode;
  ruleObj?: RuleType;
  type: "add" | "edit";
  onSuccess?: () => void;
};
const RuleDialog: React.FC<RuleDialogType> = ({
  children,
  ruleObj,
  type,
  onSuccess,
}) => {
  const [ruleCode, setRuleCode] = useState<string>("");
  const [rule, setRule] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const reset = () => {
    setRuleCode("");
    setRule("");
    setDescription("");
  };

  const addRule = async () => {
    try {
      setLoading(true);

      if (!ruleCode || !rule || !description) {
        toast.error("Please input all fields");
        return;
      }

      let res;
      if (type === "edit") {
        res = await api.put(`/api/rules/${ruleObj?._id}`, {
          ruleCode,
          rule,
          description,
        });
        if (res.status === 200 || res.status === 201) {
          toast.success("Rule Edit Successful");
        }
      } else {
        res = await api.post(`/api/rules`, {
          ruleCode,
          rule,
          description,
        });
        if (res.status === 200 || res.status === 201) {
          toast.success("Rule Added Successful");
        }
      }

      if (res?.status === 200 || res?.status === 201) {
        onSuccess?.();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!!");
    } finally {
      reset();
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (ruleObj) {
      setRuleCode(ruleObj.ruleCode || "");
      setRule(ruleObj.rule || "");
      setDescription(ruleObj.description || "");
    }
  }, [ruleObj]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add new KBLI </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="ruleCode">KBLI Code</Label>
            <Input
              id="ruleCode"
              name="ruleCode"
              placeholder="01111"
              value={ruleCode}
              onChange={(e) => setRuleCode(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="ruleCode">KBLI</Label>
            <Input
              id="rule"
              name="rule"
              placeholder="Pertanian Jagung"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="ruleCode">Description</Label>
            <Textarea
              id="rule"
              name="rule"
              placeholder="Write something about kbli..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={addRule}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RuleDialog;
