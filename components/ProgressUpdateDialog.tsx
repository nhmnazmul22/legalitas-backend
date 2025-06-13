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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressType } from "@/types";
import { useState } from "react";
import api from "@/lib/config/axios";
import { toast } from "sonner";
import { progressSteps } from "@/constants";
type ProgressUpdateDialogType = {
  children: React.ReactNode;
  project: ProgressType;
  onSuccess: () => void;
};

const ProgressUpdateDialog: React.FC<ProgressUpdateDialogType> = ({
  children,
  project,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(
    project.currentStep.title || ""
  );
  const [notificationMethods, setNotificationMethods] = useState(
    project.notificationMethods || ""
  );
  const [initialNotes, setInitialNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setCurrentStep("");
    setNotificationMethods("");
    setInitialNotes("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let percentage = project.progressPercent;

      const currentIndex = project.progressSteps?.findIndex(
        (p) => p.title === currentStep
      );

      if (currentIndex !== -1) {
        percentage = String(progressSteps[currentIndex!].progress);
      }

      const progress = progressSteps.map((step, index) => {
        const currentIndex = progressSteps.findIndex(
          (p) => p.title === currentStep
        );

        if (index < currentIndex) {
          return { title: step.title, status: "completed" };
        } else if (index === currentIndex) {
          return { title: step.title, status: "reviewing" };
        } else {
          return { title: step.title, status: "pending" };
        }
      });

      const data = {
        currentStep,
        progressPercent: percentage,
        notificationMethods,
        initialNotes,
        progressSteps: progress,
      };

      const res = await api.put(`/api/progress/${project._id}`, data);
      if (res.status === 201) {
        toast.success("Progress updated successful");
        reset();
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Progress Pekerjaan</DialogTitle>
          <DialogDescription>
            Update progress untuk {project.clientDetails?.fullName} -{" "}
            {project.serviceType}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-step">Step Saat Ini</Label>
            <Select value={currentStep} onValueChange={setCurrentStep}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih step saat ini" />
              </SelectTrigger>
              <SelectContent>
                {project?.progressSteps?.map((step) => (
                  <SelectItem key={step._id} value={step.title}>
                    {step.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="update-notes">Catatan Update</Label>
            <Textarea
              id="update-notes"
              placeholder="Tulis update progress..."
              rows={4}
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="notify-client">Notifikasi ke Klien</Label>
            <Select
              value={notificationMethods}
              onValueChange={setNotificationMethods}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode notifikasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="both">Email & WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Simpan & Kirim Update..." : "Simpan & Kirim Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressUpdateDialog;
