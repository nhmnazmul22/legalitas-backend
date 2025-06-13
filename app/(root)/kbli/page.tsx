"use client";
import RuleDialog from "@/components/RuleDialog";
import RulesTable from "@/components/RulesTable";
import { Button } from "@/components/ui/button";
import { RuleType } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/config/axios";

export default function RulesPage() {
  const [data, setData] = useState<RuleType[]>([]);

  const fetchRules = async () => {
    const res = await api.get("/api/rules");
    const rules: RuleType[] = res.data.data;
    setData(rules);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">KBLI Manager</h1>
        <RuleDialog type="add" onSuccess={fetchRules}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </RuleDialog>
      </div>
      <RulesTable data={data} onRefresh={fetchRules} />
    </div>
  );
}
