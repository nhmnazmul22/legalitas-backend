import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/store/UsersSlice";
import { progressSteps, services } from "@/constants";
import { toast } from "sonner";
import api from "@/lib/config/axios";

type CreateProgressDialogType = {
  children: React.ReactNode;
  onSuccess: () => void;
};

const CreateProgressDialog: React.FC<CreateProgressDialogType> = ({
  children,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector(
    (state: RootState) => state.users.items,
    shallowEqual
  );

  const [clientId, setClientId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [firstStep, setFirstStep] = useState("");
  const [initialNotes, setInitialNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setClientId("");
    setServiceType("");
    setFirstStep("");
    setInitialNotes("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let percentage = 0;
      progressSteps.forEach((step) => {
        if (step.title === firstStep) {
          percentage = step.progress;
        }
      });

      const progress = progressSteps.map((step, index) => {
        const currentIndex = progressSteps.findIndex(
          (p) => p.title === firstStep
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
        clientId,
        serviceType,
        initialStep: firstStep,
        initialNotes,
        progressPercent: percentage,
        progressSteps: progress,
      };

      const res = await api.post("/api/progress", { ...data });
      if (res.status === 201 || res.status === 200) {
        toast.success("Progress set successful");
        reset();
        onSuccess();
      }
    } catch (err: any) {
      toast.error("Something went wrong!!");
      console.error(err);
    } finally {
      setLoading(false);
      reset();
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buat Progress Pekerjaan Baru</DialogTitle>
          <DialogDescription>
            Buat tracking progress untuk pekerjaan klien baru
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="select-client">Pilih Klien</Label>
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
            <Label htmlFor="service-type">Jenis Layanan</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis layanan" />
              </SelectTrigger>
              <SelectContent>
                {services.map((items) => (
                  <SelectItem key={items.id} value={items.name}>
                    {items.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="initial-step">Step Awal</Label>
            <Select value={firstStep} onValueChange={setFirstStep}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih step awal" />
              </SelectTrigger>
              <SelectContent>
                {progressSteps.map((step) => (
                  <SelectItem key={step.id} value={step.title}>
                    {step.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="initial-notes">Catatan Awal</Label>
            <Textarea
              id="initial-notes"
              placeholder="Catatan untuk pekerjaan ini..."
              rows={3}
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Buat Progress Pekerjaan..." : "Buat Progress Pekerjaan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProgressDialog;
