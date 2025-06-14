"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Feature {
  category: string;
  name: string;
  price: string;
  features: string[];
}

interface VoucherDetails {
  id?: string;
  serviceName: string;
  services: string[];
  price: string;
  isLimitedTime: boolean;
  features_Price: Feature[];
  isJobCompletion: boolean;
  lastUpdated?: string;
}

// Mock database - In real app, this would be replaced with actual database calls
const mockDatabase: Record<string, VoucherDetails> = {
  yayasan: {
    id: "yayasan",
    serviceName: "Yayasan Services",
    services: ["Pendirian Yayasan", "Pendirian Yayasan + Izin"],
    price: "Rp. 3.000.000",
    isLimitedTime: true,
    features_Price: [
      {
        category: "Yayasan",
        name: "Pendirian Yayasan",
        price: "Rp. 3.000.000",
        features: [
          "Pengecekan Nama Yayasan",
          "Pemesanan Nama Yayasan",
          "Persiapan Minuta",
          "Akta Pendirian Yayasan",
          "SK Menteri",
          "[BONUS] Dapat 20 KBLI",
        ],
      },
      {
        category: "Yayasan",
        name: "Pendirian Yayasan + Izin",
        price: "Rp. 6.000.000",
        features: [
          "Pengecekan Nama Yayasan",
          "Pemesanan Nama Yayasan",
          "Persiapan Minuta",
          "Akta Pendirian Yayasan",
          "SK Menteri",
          "Dapat 20 KBLI",
          "NPWP Yayasan",
          "SKT Pajak",
          "NIB",
          "[BONUS] Dapat 20 KBLI",
          "[BONUS] Buka rekening Bank",
          "[BONUS] Stempel perusahaan",
          "[BONUS] Kartu nama 1 (satu) Ketua",
          "[BONUS] EFIN Badan",
          "[BONUS] Akun OSS",
        ],
      },
    ],
    isJobCompletion: true,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  pt: {
    id: "pt",
    serviceName: "PT (Perseroan Terbatas) Services",
    services: ["Pendirian PT", "Pendirian PT + Izin Lengkap"],
    price: "Rp. 5.000.000",
    isLimitedTime: false,
    features_Price: [
      {
        category: "PT",
        name: "Pendirian PT",
        price: "Rp. 5.000.000",
        features: [
          "Pengecekan Nama PT",
          "Pemesanan Nama PT",
          "Akta Pendirian PT",
          "SK Menteri",
          "NPWP Perusahaan",
        ],
      },
      {
        category: "PT",
        name: "Pendirian PT + Izin Lengkap",
        price: "Rp. 8.000.000",
        features: [
          "Pengecekan Nama PT",
          "Pemesanan Nama PT",
          "Akta Pendirian PT",
          "SK Menteri",
          "NPWP Perusahaan",
          "NIB",
          "SKT Pajak",
          "[BONUS] Stempel perusahaan",
          "[BONUS] Kartu nama direktur",
        ],
      },
    ],
    isJobCompletion: true,
    lastUpdated: "2024-01-10T14:20:00Z",
  },
  cv: {
    id: "cv",
    serviceName: "CV (Commanditaire Vennootschap) Services",
    services: ["Pendirian CV", "Pendirian CV + Izin"],
    price: "Rp. 2.500.000",
    isLimitedTime: true,
    features_Price: [
      {
        category: "CV",
        name: "Pendirian CV",
        price: "Rp. 2.500.000",
        features: [
          "Pengecekan Nama CV",
          "Akta Pendirian CV",
          "NPWP Perusahaan",
          "SKT Pajak",
        ],
      },
    ],
    isJobCompletion: false,
    lastUpdated: "2024-01-12T09:15:00Z",
  },
};

const availableServices = [
  { id: "yayasan", name: "Yayasan Services" },
  { id: "pt", name: "PT (Perseroan Terbatas) Services" },
  { id: "cv", name: "CV (Commanditaire Vennootschap) Services" },
];

export default function VoucherManagement() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [voucherDetails, setVoucherDetails] = useState<VoucherDetails>({
    serviceName: "",
    services: [],
    price: "",
    isLimitedTime: false,
    features_Price: [],
    isJobCompletion: false,
  });
  const [newService, setNewService] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Load data when service is selected
  const loadServiceData = async (serviceId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const serviceData = mockDatabase[serviceId];
      if (serviceData) {
        setVoucherDetails(serviceData);
        setSaveStatus("idle");
      } else {
        // Create new service template
        setVoucherDetails({
          id: serviceId,
          serviceName:
            availableServices.find((s) => s.id === serviceId)?.name || "",
          services: [],
          price: "",
          isLimitedTime: false,
          features_Price: [],
          isJobCompletion: false,
        });
      }
    } catch (error) {
      console.error("Error loading service data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    loadServiceData(serviceId);
  };

  const addService = () => {
    if (newService.trim()) {
      setVoucherDetails((prev) => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setVoucherDetails((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const addFeaturePackage = () => {
    const newPackage: Feature = {
      category: "",
      name: "",
      price: "",
      features: [],
    };
    setVoucherDetails((prev) => ({
      ...prev,
      features_Price: [...prev.features_Price, newPackage],
    }));
  };

  const removeFeaturePackage = (index: number) => {
    setVoucherDetails((prev) => ({
      ...prev,
      features_Price: prev.features_Price.filter((_, i) => i !== index),
    }));
  };

  const updateFeaturePackage = (
    index: number,
    field: keyof Feature,
    value: string
  ) => {
    setVoucherDetails((prev) => ({
      ...prev,
      features_Price: prev.features_Price.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    }));
  };

  const addFeatureToPackage = (packageIndex: number, feature: string) => {
    if (feature.trim()) {
      setVoucherDetails((prev) => ({
        ...prev,
        features_Price: prev.features_Price.map((pkg, i) =>
          i === packageIndex
            ? { ...pkg, features: [...pkg.features, feature.trim()] }
            : pkg
        ),
      }));
    }
  };

  const removeFeatureFromPackage = (
    packageIndex: number,
    featureIndex: number
  ) => {
    setVoucherDetails((prev) => ({
      ...prev,
      features_Price: prev.features_Price.map((pkg, i) =>
        i === packageIndex
          ? {
              ...pkg,
              features: pkg.features.filter((_, fi) => fi !== featureIndex),
            }
          : pkg
      ),
    }));
  };

  const handleSave = async () => {
    if (!selectedServiceId) {
      alert("Please select a service first!");
      return;
    }

    setSaveStatus("saving");
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update mock database
      const updatedData = {
        ...voucherDetails,
        id: selectedServiceId,
        lastUpdated: new Date().toISOString(),
      };
      mockDatabase[selectedServiceId] = updatedData;
      setVoucherDetails(updatedData);

      console.log(
        "Voucher Details Saved:",
        JSON.stringify(updatedData, null, 2)
      );
      setSaveStatus("saved");

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Voucher Management System</h1>
        <p className="text-muted-foreground">
          Manage voucher details, services, and feature packages
        </p>
      </div>

      {/* Service Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Service Selection
          </CardTitle>
          <CardDescription>
            Select a service to load existing data or create new voucher details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="service-select">Select Service</Label>
              <Select
                value={selectedServiceId}
                onValueChange={handleServiceSelect}
              >
                <SelectTrigger id="service-select">
                  <SelectValue placeholder="Choose a service to manage..." />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && (
            <Alert className="mt-4">
              <AlertDescription>Loading service data...</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {selectedServiceId && !isLoading && (
        <div className="space-y-6">
          {/* Service Name */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>Basic service details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={voucherDetails.serviceName}
                  onChange={(e) =>
                    setVoucherDetails((prev) => ({
                      ...prev,
                      serviceName: e.target.value,
                    }))
                  }
                  placeholder="Enter service name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Set the main voucher details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Main Price</Label>
                <Input
                  id="price"
                  value={voucherDetails.price}
                  onChange={(e) =>
                    setVoucherDetails((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="Rp. 3.000.000"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="limited-time"
                  checked={voucherDetails.isLimitedTime}
                  onCheckedChange={(checked) =>
                    setVoucherDetails((prev) => ({
                      ...prev,
                      isLimitedTime: checked,
                    }))
                  }
                />
                <Label htmlFor="limited-time">Limited Time Offer</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="job-completion"
                  checked={voucherDetails.isJobCompletion}
                  onCheckedChange={(checked) =>
                    setVoucherDetails((prev) => ({
                      ...prev,
                      isJobCompletion: checked,
                    }))
                  }
                />
                <Label htmlFor="job-completion">Job Completion Required</Label>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Manage available services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add new service"
                  onKeyPress={(e) => e.key === "Enter" && addService()}
                />
                <Button onClick={addService}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {voucherDetails.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{service}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Packages</CardTitle>
              <CardDescription>
                Manage service packages with features and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={addFeaturePackage} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Package
              </Button>

              {voucherDetails.features_Price.map((pkg, packageIndex) => (
                <Card key={packageIndex} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Package {packageIndex + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeaturePackage(packageIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={pkg.category}
                          onChange={(e) =>
                            updateFeaturePackage(
                              packageIndex,
                              "category",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Yayasan"
                        />
                      </div>
                      <div>
                        <Label>Package Name</Label>
                        <Input
                          value={pkg.name}
                          onChange={(e) =>
                            updateFeaturePackage(
                              packageIndex,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Pendirian Yayasan"
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          value={pkg.price}
                          onChange={(e) =>
                            updateFeaturePackage(
                              packageIndex,
                              "price",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Rp. 3.000.000"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium">Features</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add new feature"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addFeatureToPackage(packageIndex, newFeature);
                              setNewFeature("");
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            addFeatureToPackage(packageIndex, newFeature);
                            setNewFeature("");
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {pkg.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <span className="text-sm">{feature}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeFeatureFromPackage(
                                  packageIndex,
                                  featureIndex
                                )
                              }
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              size="lg"
              disabled={saveStatus === "saving"}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                ? "Saved!"
                : "Save Voucher Details"}
            </Button>
          </div>

          {saveStatus === "saved" && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Voucher details saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {saveStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Error saving voucher details. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {!selectedServiceId && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Service</h3>
              <p className="text-muted-foreground">
                Choose a service from the dropdown above to start managing
                voucher details
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
