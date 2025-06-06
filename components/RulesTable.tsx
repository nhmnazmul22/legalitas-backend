"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DynamicPagination from "./DynamicPagination";
import { truncateText } from "@/lib/utils";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import RuleDialog from "./RuleDialog";
import { RuleType } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/lib/config/axios";
import { toast } from "sonner";

type RulesTableType = {
  data: RuleType[];
  onRefresh: () => void;
};

const RulesTable: React.FC<RulesTableType> = ({ data, onRefresh }) => {
  const { currentItems } = useSelector((state: RootState) => state.pagination);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteRule = async (ruleId: string) => {
    try {
      setLoading(true);
      const res = await api.delete(`/api/rules/${ruleId}`);
      if (res.status === 200 || res.status === 201) {
        toast.success("Rule delete Successful");
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-fit text-center">#</TableHead>
              <TableHead className="w-fit">KBLI Code</TableHead>
              <TableHead className="w-fit">KBLI</TableHead>
              <TableHead className="text-left w-fit max-lg:hidden">
                Description
              </TableHead>
              <TableHead className="text-center w-fit">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems &&
              currentItems.map((kbli) => (
                <TableRow key={kbli._id}>
                  <TableCell className="text-center font-medium">
                    {kbli.no}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm w-fit">
                    {kbli.ruleCode}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground w-fit">
                    {kbli.rule}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground w-fit max-lg:hidden">
                    {truncateText(kbli.description, 80)}
                  </TableCell>
                  <TableCell className="text-right flex space-x-2">
                    <RuleDialog
                      type="edit"
                      ruleObj={kbli}
                      onSuccess={onRefresh}
                    >
                      <Button variant="outline" size="sm" disabled={loading}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </RuleDialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={loading}
                      onClick={() => deleteRule(kbli._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No KBLI found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-5">
        <DynamicPagination data={data} />
      </div>
    </>
  );
};

export default RulesTable;
