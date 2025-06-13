"use client";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import CreateProgressDialog from "@/components/CreateProgressDialog";
import { useFetch } from "@/hooks/useFetch";
import { ProgressType } from "@/types";
import ProgressCard from "@/components/ProgressCard";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { useState } from "react";

export default function ProgressPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const { data: progress } = useFetch<ProgressType[]>("api/progress", [
    refreshKey,
  ]);

  return (
    <div key={refreshKey} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Pekerjaan</h1>
          <p className="text-muted-foreground">
            Pantau dan update progress pekerjaan klien
          </p>
        </div>
        <CreateProgressDialog onSuccess={handleRefresh}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Progress Baru
          </Button>
        </CreateProgressDialog>
      </div>

      <div className="grid gap-6">
        {progress && progress?.length > 0 ? (
          progress?.map((project) => (
            <ProgressCard
              key={project._id}
              project={project}
              onSuccess={handleRefresh}
            />
          ))
        ) : (
          <SkeletonCard />
        )}
      </div>
    </div>
  );
}
