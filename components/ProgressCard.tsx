import { ProgressType } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProgressUpdateDialog from "./ProgressUpdateDialog";
import { progressSteps } from "@/constants";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/config/axios";
type ProgressCardType = {
  project: ProgressType;
  onSuccess: () => void;
};

const ProgressCard: React.FC<ProgressCardType> = ({ project, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const completeProject = async () => {
    try {
      setLoading(true);

      const progress = progressSteps.map((step, index) => {
        return { title: step.title, status: "completed" };
      });

      const data = {
        progressSteps: progress,
        status: "completed",
      };

      const res = await api.put(`/api/progress/${project._id}`, data);
      if (res.status === 201) {
        toast.success("Progress completed successful");
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card key={project._id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {project.clientDetails?.fullName}
              <Badge
                variant={
                  project.status === "in progress" ? "secondary" : "default"
                }
              >
                {project.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {project.serviceType} • Update terakhir:{" "}
              {formatDate(project.updatedAt || "")}
            </CardDescription>
          </div>
          {project.currentStep.title ===
            progressSteps[progressSteps.length - 1].title ||
          project.status === "completed" ? (
            <Button size="sm" onClick={completeProject} disabled={loading}>
              <Edit className="w-4 h-4 mr-2" />
              {loading ? "Completing Project..." : "Complete Project"}
            </Button>
          ) : (
            <ProgressUpdateDialog onSuccess={onSuccess} project={project}>
              <Button size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Update Progress
              </Button>
            </ProgressUpdateDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>
              Progress: {project.currentStep.title}-{" "}
              {project.currentStep.status}
            </span>
            <span>{project.progressPercent}%</span>
          </div>
          <Progress value={Number(project.progressPercent)} className="h-2" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Timeline Pekerjaan:</Label>
          <div className="space-y-2">
            {project?.progressSteps?.map((step) => (
              <div key={step._id} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    step.status === "completed"
                      ? "bg-green-500"
                      : step.status === "reviewing"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-sm ${
                    step.status === "completed"
                      ? "text-green-600"
                      : step.status === "reviewing"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
