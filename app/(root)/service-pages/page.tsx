"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/config/axios";
import { PlanKey, PricingDataType } from "@/types";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NoSSRImageUpload = dynamic(() => import("@/components/image-upload"), {
  ssr: false,
});

const CKEditorWrapper = dynamic(() => import("@/components/CKEditorWrapper"), {
  ssr: false,
});

interface ServiceData {
  serviceBasicInfo: {
    serviceName: string;
    shortDes: string;
    isBestSeller: boolean;
    thumbnail: string;
    description: string;
    lotsOfBonus?: Array<{
      bonusTitle: string;
      bonusSubTitle: string;
      icon: string;
    }>;
  };
  introduction?: {
    content: string[];
    isBoxStyle: boolean;
  };
  process?: Array<{
    subsection: string;
    content: string[];
  }>;
  requiredDocuments?: string[];
  choosingBusinessField?: string[];
  pricing?: PricingDataType;
  pricing2?: Array<{
    priceTitle: string;
    price: string;
    subTitle: string;
    isJobCompletion: boolean;
  }>;
  virtualOffice?: boolean;
  faqs: Array<{
    question: string;
    ans: string;
  }>;
  quiz?: Array<{
    id: number;
    question: string;
    options: string;
  }>;
  voucherDetails: {
    thumbnail: string;
    services: string[];
    price: string;
    isLimitedTime: boolean;
    voucherImg: string;
    features_Price: Array<{
      category: string;
      name: string;
      price: string;
      features: string[];
    }>;
    isJobCompletion: boolean;
  };
}

export default function AdminPageBuilder() {
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [currentServiceData, setCurrentServiceData] =
    useState<ServiceData | null>(null);
  const [activeSection, setActiveSection] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const planKeys: PlanKey[] = ["plans-1", "plans-2", "plans-3"];

  // API Functions
  const loadServicesFromDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/menu-services`);
      if (response.status === 200) {
        const data = response.data.data;
        let services: any[] = [];
        data.services.map((value: any) => {
          return value.children.map((child: any) => {
            return services.push({ ...child });
          });
        });
        setServiceData(services);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceInDatabase = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(`/api/service-pages/${selectedService}`, {
        ...currentServiceData,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Data saved successful");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceData = (section: string, data: any) => {
    if (!currentServiceData) return;

    setCurrentServiceData((prev) => ({
      ...prev!,
      [section]: data,
    }));
  };

  const loadServicesData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/service-pages/${selectedService}`);
      if (response.status === 200) {
        const data = response.data.data;
        setCurrentServiceData(data);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Load services from database on component mount
  useEffect(() => {
    loadServicesFromDatabase();
  }, []);

  // Load service data when selection changes
  useEffect(() => {
    if (selectedService) {
      loadServicesData();
    }
  }, [selectedService]);

  const renderBasicInfoEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Basic Service Information</CardTitle>
        <CardDescription>Edit the main service details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            value={currentServiceData?.serviceBasicInfo?.serviceName || ""}
            onChange={(e) =>
              updateServiceData("serviceBasicInfo", {
                ...currentServiceData?.serviceBasicInfo,
                serviceName: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="shortDes">Short Description</Label>
          <Textarea
            id="shortDes"
            value={currentServiceData?.serviceBasicInfo?.shortDes || ""}
            onChange={(e) =>
              updateServiceData("serviceBasicInfo", {
                ...currentServiceData?.serviceBasicInfo,
                shortDes: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={currentServiceData?.serviceBasicInfo?.description || ""}
            onChange={(e) =>
              updateServiceData("serviceBasicInfo", {
                ...currentServiceData?.serviceBasicInfo,
                description: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <NoSSRImageUpload
            value={currentServiceData?.serviceBasicInfo?.thumbnail || ""}
            onChange={(url) =>
              updateServiceData("serviceBasicInfo", {
                ...currentServiceData?.serviceBasicInfo,
                thumbnail: url,
              })
            }
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="bestSeller"
            checked={
              currentServiceData?.serviceBasicInfo?.isBestSeller || false
            }
            onCheckedChange={(checked) =>
              updateServiceData("serviceBasicInfo", {
                ...currentServiceData?.serviceBasicInfo,
                isBestSeller: checked,
              })
            }
          />
          <Label htmlFor="bestSeller">Best Seller</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="virtualOffice"
            checked={currentServiceData?.virtualOffice || false}
            onCheckedChange={(checked) =>
              updateServiceData("virtualOffice", checked)
            }
          />
          <Label htmlFor="virtualOffice">Virtual Office Available</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderBonusEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bonus Features</CardTitle>
        <CardDescription>
          Manage bonus features displayed in the hero section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentServiceData?.serviceBasicInfo?.lotsOfBonus?.map(
            (bonus, index) => (
              <div
                key={index}
                className="flex gap-4 items-end p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <Label>Bonus Title</Label>
                  <Input
                    value={bonus.bonusTitle}
                    onChange={(e) => {
                      const newBonus = [
                        ...(currentServiceData?.serviceBasicInfo?.lotsOfBonus ||
                          []),
                      ];
                      newBonus[index] = {
                        ...bonus,
                        bonusTitle: e.target.value,
                      };
                      updateServiceData("serviceBasicInfo", {
                        ...currentServiceData?.serviceBasicInfo,
                        lotsOfBonus: newBonus,
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label>Bonus Subtitle</Label>
                  <Input
                    value={bonus.bonusSubTitle}
                    onChange={(e) => {
                      const newBonus = [
                        ...(currentServiceData?.serviceBasicInfo?.lotsOfBonus ||
                          []),
                      ];
                      newBonus[index] = {
                        ...bonus,
                        bonusSubTitle: e.target.value,
                      };
                      updateServiceData("serviceBasicInfo", {
                        ...currentServiceData?.serviceBasicInfo,
                        lotsOfBonus: newBonus,
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label>Icon Image</Label>
                  <NoSSRImageUpload
                    value={bonus.icon}
                    onChange={(url) => {
                      const newBonus = [
                        ...(currentServiceData?.serviceBasicInfo?.lotsOfBonus ||
                          []),
                      ];
                      newBonus[index] = { ...bonus, icon: url };
                      updateServiceData("serviceBasicInfo", {
                        ...currentServiceData?.serviceBasicInfo,
                        lotsOfBonus: newBonus,
                      });
                    }}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newBonus =
                      currentServiceData?.serviceBasicInfo?.lotsOfBonus?.filter(
                        (_, i) => i !== index
                      ) || [];
                    updateServiceData("serviceBasicInfo", {
                      ...currentServiceData?.serviceBasicInfo,
                      lotsOfBonus: newBonus,
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )
          )}

          <Button
            onClick={() => {
              const newBonus = [
                ...(currentServiceData?.serviceBasicInfo?.lotsOfBonus || []),
                {
                  bonusTitle: "",
                  bonusSubTitle: "",
                  icon: "",
                },
              ];
              updateServiceData("serviceBasicInfo", {
                ...currentServiceData?.serviceBasicInfo,
                lotsOfBonus: newBonus,
              });
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bonus Feature
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderIntroductionEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Introduction Section</CardTitle>
        <CardDescription>Edit the introduction content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="boxStyle"
            checked={currentServiceData?.introduction?.isBoxStyle || false}
            onCheckedChange={(checked) =>
              updateServiceData("introduction", {
                ...currentServiceData?.introduction,
                isBoxStyle: checked,
              })
            }
          />
          <Label htmlFor="boxStyle">Box Style</Label>
        </div>

        <div className="space-y-4">
          {currentServiceData?.introduction?.content?.map((content, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <CKEditorWrapper
                  content={content}
                  setContent={(html) => {
                    const newContent = [
                      ...(currentServiceData?.introduction?.content || []),
                    ];
                    newContent[index] = html;
                    updateServiceData("introduction", {
                      ...currentServiceData?.introduction,
                      content: newContent,
                    });
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newContent =
                    currentServiceData?.introduction?.content?.filter(
                      (_, i) => i !== index
                    ) || [];
                  updateServiceData("introduction", {
                    ...currentServiceData?.introduction,
                    content: newContent,
                  });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            onClick={() => {
              const newContent = [
                ...(currentServiceData?.introduction?.content || []),
                "",
              ];
              updateServiceData("introduction", {
                ...currentServiceData?.introduction,
                content: newContent,
              });
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content Block
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Process Section</CardTitle>
        <CardDescription>Edit the service process steps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {currentServiceData?.process?.map((step, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div>
                <Label>Step Title</Label>
                <Input
                  value={step.subsection}
                  onChange={(e) => {
                    const newProcess = [...(currentServiceData?.process || [])];
                    newProcess[index] = { ...step, subsection: e.target.value };
                    updateServiceData("process", newProcess);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Step Content</Label>
                {step.content.map((content, contentIndex) => (
                  <div key={contentIndex} className="flex gap-2">
                    <div className="flex-1">
                      <CKEditorWrapper
                        content={content}
                        setContent={(html) => {
                          const newProcess = [
                            ...(currentServiceData?.process || []),
                          ];
                          newProcess[index].content[contentIndex] = html;
                          updateServiceData("process", newProcess);
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newProcess = [
                          ...(currentServiceData?.process || []),
                        ];
                        newProcess[index].content = newProcess[
                          index
                        ].content.filter((_, i) => i !== contentIndex);
                        updateServiceData("process", newProcess);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newProcess = [...(currentServiceData?.process || [])];
                    newProcess[index].content.push("");
                    updateServiceData("process", newProcess);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newProcess = (currentServiceData?.process || []).filter(
                    (_, i) => i !== index
                  );
                  updateServiceData("process", newProcess);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Step
              </Button>
            </div>
          ))}

          <Button
            onClick={() => {
              const newProcess = [
                ...(currentServiceData?.process || []),
                {
                  subsection: "",
                  content: [""],
                },
              ];
              updateServiceData("process", newProcess);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Process Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRequiredDocumentsEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
        <CardDescription>
          List of documents required for this service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentServiceData?.requiredDocuments?.map((doc, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={doc}
              onChange={(e) => {
                const newDocs = [
                  ...(currentServiceData?.requiredDocuments || []),
                ];
                newDocs[index] = e.target.value;
                updateServiceData("requiredDocuments", newDocs);
              }}
              placeholder="Document name"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDocs =
                  currentServiceData?.requiredDocuments?.filter(
                    (_, i) => i !== index
                  ) || [];
                updateServiceData("requiredDocuments", newDocs);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          onClick={() => {
            const newDocs = [
              ...(currentServiceData?.requiredDocuments || []),
              "",
            ];
            updateServiceData("requiredDocuments", newDocs);
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </CardContent>
    </Card>
  );

  const renderBusinessFieldEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Business Field Options</CardTitle>
        <CardDescription>
          Available business field choices for this service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentServiceData?.choosingBusinessField?.map((field, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={field}
              onChange={(e) => {
                const newFields = [
                  ...(currentServiceData?.choosingBusinessField || []),
                ];
                newFields[index] = e.target.value;
                updateServiceData("choosingBusinessField", newFields);
              }}
              placeholder="Business field"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newFields =
                  currentServiceData?.choosingBusinessField?.filter(
                    (_, i) => i !== index
                  ) || [];
                updateServiceData("choosingBusinessField", newFields);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          onClick={() => {
            const newFields = [
              ...(currentServiceData?.choosingBusinessField || []),
              "",
            ];
            updateServiceData("choosingBusinessField", newFields);
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Business Field
        </Button>
      </CardContent>
    </Card>
  );

  const renderPricingEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Plans (Table Format)</CardTitle>
        <CardDescription>
          Configure pricing plans with feature comparison table
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Plan Names</Label>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => {
              const planValue =
                currentServiceData?.pricing?.plans?.[index] || "";

              return (
                <Input
                  key={index}
                  value={planValue}
                  onChange={(e) => {
                    const currentPlans =
                      currentServiceData?.pricing?.plans || [];
                    const newPlans = [...currentPlans];

                    // Fill empty values if needed
                    while (newPlans.length < 3) {
                      newPlans.push("");
                    }

                    newPlans[index] = e.target.value;

                    updateServiceData("pricing", {
                      ...currentServiceData?.pricing,
                      plans: newPlans,
                    });
                  }}
                  placeholder={`Plan ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        <div>
          <Label>Plan Prices</Label>
          <div className="grid grid-cols-3 gap-4">
            {planKeys.map((planKey, index) => (
              <div key={planKey}>
                <Label className="text-sm">Plan {index + 1} Price</Label>
                <Input
                  value={currentServiceData?.pricing?.prices?.[planKey] ?? ""}
                  onChange={(e) =>
                    updateServiceData("pricing", {
                      ...currentServiceData?.pricing,
                      prices: {
                        ...currentServiceData?.pricing?.prices,
                        [planKey]: e.target.value,
                      },
                    })
                  }
                  placeholder={`Rp. ${index + 1}.000.000`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Features Comparison</Label>
          <div className="space-y-4">
            {currentServiceData?.pricing?.features?.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>
                    <Label className="text-sm">Feature Name</Label>
                    <Input
                      value={feature.name}
                      onChange={(e) => {
                        const newFeatures = [
                          ...(currentServiceData?.pricing?.features || []),
                        ];
                        newFeatures[index] = {
                          ...feature,
                          name: e.target.value,
                        };
                        updateServiceData("pricing", {
                          ...currentServiceData?.pricing,
                          features: newFeatures,
                        });
                      }}
                      placeholder="Feature name"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={feature.plans["plans-1"]}
                      onCheckedChange={(checked) => {
                        const newFeatures = [
                          ...(currentServiceData?.pricing?.features || []),
                        ];
                        newFeatures[index].plans["plans-1"] = checked;
                        updateServiceData("pricing", {
                          ...currentServiceData?.pricing,
                          features: newFeatures,
                        });
                      }}
                    />
                    <Label className="text-sm">Plan 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={feature.plans["plans-2"]}
                      onCheckedChange={(checked) => {
                        const newFeatures = [
                          ...(currentServiceData?.pricing?.features || []),
                        ];
                        newFeatures[index].plans["plans-2"] = checked;
                        updateServiceData("pricing", {
                          ...currentServiceData?.pricing,
                          features: newFeatures,
                        });
                      }}
                    />
                    <Label className="text-sm">Plan 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={feature.plans["plans-3"]}
                      onCheckedChange={(checked) => {
                        const newFeatures = [
                          ...(currentServiceData?.pricing?.features || []),
                        ];
                        newFeatures[index].plans["plans-3"] = checked;
                        updateServiceData("pricing", {
                          ...currentServiceData?.pricing,
                          features: newFeatures,
                        });
                      }}
                    />
                    <Label className="text-sm">Plan 3</Label>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    const newFeatures =
                      currentServiceData?.pricing?.features.filter(
                        (_, i) => i !== index
                      ) || [];
                    updateServiceData("pricing", {
                      ...currentServiceData?.pricing,
                      features: newFeatures,
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Feature
                </Button>
              </div>
            ))}

            <Button
              onClick={() => {
                const newFeatures = [
                  ...(currentServiceData?.pricing?.features || []),
                  {
                    name: "",
                    plans: {
                      "plans-1": false,
                      "plans-2": false,
                      "plans-3": false,
                    },
                  },
                ];
                updateServiceData("pricing", {
                  ...currentServiceData?.pricing,
                  features: newFeatures,
                });
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>

        <div>
          <Label>Footer Image</Label>
          <NoSSRImageUpload
            value={currentServiceData?.pricing?.footerImg || ""}
            onChange={(url) =>
              updateServiceData("pricing", {
                ...currentServiceData?.pricing,
                footerImg: url,
              })
            }
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderPricing2Editor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Alternative Pricing (Card Format)</CardTitle>
        <CardDescription>
          Simple pricing cards without feature comparison
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentServiceData?.pricing2?.map((price, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price Title</Label>
                <Input
                  value={price.priceTitle}
                  onChange={(e) => {
                    const newPricing = [
                      ...(currentServiceData?.pricing2 || []),
                    ];
                    newPricing[index] = {
                      ...price,
                      priceTitle: e.target.value,
                    };
                    updateServiceData("pricing2", newPricing);
                  }}
                  placeholder="Basic Package"
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  value={price.price}
                  onChange={(e) => {
                    const newPricing = [
                      ...(currentServiceData?.pricing2 || []),
                    ];
                    newPricing[index] = { ...price, price: e.target.value };
                    updateServiceData("pricing2", newPricing);
                  }}
                  placeholder="Rp. 1.000.000"
                />
              </div>
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={price?.subTitle}
                onChange={(e) => {
                  const newPricing = [...(currentServiceData?.pricing2 || [])];
                  newPricing[index] = { ...price, subTitle: e.target.value };
                  updateServiceData("pricing2", newPricing);
                }}
                placeholder="Perfect for startups"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={price?.isJobCompletion}
                onCheckedChange={(checked) => {
                  const newPricing = [...(currentServiceData?.pricing2 || [])];
                  newPricing[index] = { ...price, isJobCompletion: checked };
                  updateServiceData("pricing2", newPricing);
                }}
              />
              <Label>Job Completion Package</Label>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newPricing =
                  currentServiceData?.pricing2?.filter((_, i) => i !== index) ||
                  [];
                updateServiceData("pricing2", newPricing);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Package
            </Button>
          </div>
        ))}

        <Button
          onClick={() => {
            const newPricing = [
              ...(currentServiceData?.pricing2 || []),
              {
                priceTitle: "",
                price: "",
                subTitle: "",
                isJobCompletion: false,
              },
            ];
            updateServiceData("pricing2", newPricing);
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Package
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuizEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Section</CardTitle>
        <CardDescription>
          Create quiz questions for user engagement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentServiceData?.quiz?.map((question, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Question ID</Label>
                <Input
                  type="number"
                  value={question?.id || ""}
                  onChange={(e) => {
                    const newQuiz = [...(currentServiceData?.quiz || [])];
                    newQuiz[index] = {
                      ...question,
                      id: Number.parseInt(e.target.value) || 1,
                    };
                    updateServiceData("quiz", newQuiz);
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Question</Label>
              <Textarea
                value={question?.question || ""}
                onChange={(e) => {
                  const newQuiz = [...(currentServiceData?.quiz || [])];
                  newQuiz[index] = { ...question, question: e.target.value };
                  updateServiceData("quiz", newQuiz);
                }}
                placeholder="Enter your question here"
                rows={2}
              />
            </div>
            <div>
              <Label>Options (comma-separated)</Label>
              <Textarea
                value={question?.options || ""}
                onChange={(e) => {
                  const newQuiz = [...(currentServiceData?.quiz || [])];
                  newQuiz[index] = { ...question, options: e.target.value };
                  updateServiceData("quiz", newQuiz);
                }}
                placeholder="Option A, Option B, Option C, Option D"
                rows={3}
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newQuiz =
                  currentServiceData?.quiz?.filter((_, i) => i !== index) || [];
                updateServiceData("quiz", newQuiz);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Question
            </Button>
          </div>
        ))}

        <Button
          onClick={() => {
            const newQuiz = [
              ...(currentServiceData?.quiz || []),
              {
                id: (currentServiceData?.quiz?.length || 0) + 1,
                question: "",
                options: "",
              },
            ];
            updateServiceData("quiz", newQuiz);
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Quiz Question
        </Button>
      </CardContent>
    </Card>
  );

  const renderFAQEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Section</CardTitle>
        <CardDescription>Manage frequently asked questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentServiceData?.faqs?.map((faq, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div>
              <Label>Question</Label>
              <Input
                value={faq.question}
                onChange={(e) => {
                  const newFaqs = [...(currentServiceData?.faqs || [])];
                  newFaqs[index] = { ...faq, question: e.target.value };
                  updateServiceData("faqs", newFaqs);
                }}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <CKEditorWrapper
                content={faq.ans}
                setContent={(html) => {
                  const newFaqs = [...(currentServiceData?.faqs || [])];
                  newFaqs[index] = { ...faq, ans: html };
                  updateServiceData("faqs", newFaqs);
                }}
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newFaqs =
                  currentServiceData?.faqs?.filter((_, i) => i !== index) || [];
                updateServiceData("faqs", newFaqs);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove FAQ
            </Button>
          </div>
        ))}

        <Button
          onClick={() => {
            const newFaqs = [
              ...(currentServiceData?.faqs || []),
              {
                question: "",
                ans: "",
              },
            ];
            updateServiceData("faqs", newFaqs);
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </CardContent>
    </Card>
  );

  const renderVoucherEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Voucher Details</CardTitle>
        <CardDescription>Edit voucher and pricing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price</Label>
            <Input
              value={currentServiceData?.voucherDetails?.price || ""}
              onChange={(e) =>
                updateServiceData("voucherDetails", {
                  ...currentServiceData?.voucherDetails,
                  price: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={
                currentServiceData?.voucherDetails?.isLimitedTime || false
              }
              onCheckedChange={(checked) =>
                updateServiceData("voucherDetails", {
                  ...currentServiceData?.voucherDetails,
                  isLimitedTime: checked,
                })
              }
            />
            <Label>Limited Time Offer</Label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={
              currentServiceData?.voucherDetails?.isJobCompletion || false
            }
            onCheckedChange={(checked) =>
              updateServiceData("voucherDetails", {
                ...currentServiceData?.voucherDetails,
                isJobCompletion: checked,
              })
            }
          />
          <Label>Job Completion Package</Label>
        </div>

        <div>
          <Label>Voucher Image</Label>
          <NoSSRImageUpload
            value={currentServiceData?.voucherDetails?.voucherImg || ""}
            onChange={(url) =>
              updateServiceData("voucherDetails", {
                ...currentServiceData?.voucherDetails,
                voucherImg: url,
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <Label>Thumbnail Image</Label>
          <NoSSRImageUpload
            value={currentServiceData?.voucherDetails?.thumbnail || ""}
            onChange={(url) =>
              updateServiceData("voucherDetails", {
                ...currentServiceData?.voucherDetails,
                thumbnail: url,
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <Label>Services List</Label>
          <div className="space-y-2">
            {currentServiceData?.voucherDetails?.services?.map(
              (service, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={service}
                    onChange={(e) => {
                      const newServices = [
                        ...(currentServiceData?.voucherDetails?.services || []),
                      ];
                      newServices[index] = e.target.value;
                      updateServiceData("voucherDetails", {
                        ...currentServiceData?.voucherDetails,
                        services: newServices,
                      });
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newServices =
                        currentServiceData?.voucherDetails.services?.filter(
                          (_, i) => i !== index
                        ) || [];
                      updateServiceData("voucherDetails", {
                        ...currentServiceData?.voucherDetails,
                        services: newServices,
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            )}
            <Button
              variant="outline"
              onClick={() => {
                const newServices = [
                  ...(currentServiceData?.voucherDetails?.services || []),
                  "",
                ];
                updateServiceData("voucherDetails", {
                  ...currentServiceData?.voucherDetails,
                  services: newServices,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>

        <div>
          <Label>Feature Packages</Label>
          <div className="space-y-4">
            {currentServiceData?.voucherDetails?.features_Price?.map(
              (feature, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={feature?.category}
                        onChange={(e) => {
                          const newFeatures = [
                            ...(currentServiceData?.voucherDetails
                              .features_Price || []),
                          ];
                          newFeatures[index] = {
                            ...feature,
                            category: e.target.value,
                          };
                          updateServiceData("voucherDetails", {
                            ...currentServiceData?.voucherDetails,
                            features_Price: newFeatures,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Package Name</Label>
                      <Input
                        value={feature.name}
                        onChange={(e) => {
                          const newFeatures = [
                            ...(currentServiceData?.voucherDetails
                              .features_Price || []),
                          ];
                          newFeatures[index] = {
                            ...feature,
                            name: e.target.value,
                          };
                          updateServiceData("voucherDetails", {
                            ...currentServiceData?.voucherDetails,
                            features_Price: newFeatures,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={feature.price}
                        onChange={(e) => {
                          const newFeatures = [
                            ...(currentServiceData?.voucherDetails
                              .features_Price || []),
                          ];
                          newFeatures[index] = {
                            ...feature,
                            price: e.target.value,
                          };
                          updateServiceData("voucherDetails", {
                            ...currentServiceData?.voucherDetails,
                            features_Price: newFeatures,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="space-y-2">
                      {feature.features.map((feat, featIndex) => (
                        <div key={featIndex} className="flex gap-2">
                          <Input
                            value={feat}
                            onChange={(e) => {
                              const newFeatures = [
                                ...(currentServiceData?.voucherDetails
                                  .features_Price || []),
                              ];
                              newFeatures[index].features[featIndex] =
                                e.target.value;
                              updateServiceData("voucherDetails", {
                                ...currentServiceData?.voucherDetails,
                                features_Price: newFeatures,
                              });
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = [
                                ...(currentServiceData?.voucherDetails
                                  .features_Price || []),
                              ];
                              newFeatures[index].features = newFeatures[
                                index
                              ].features.filter((_, i) => i !== featIndex);
                              updateServiceData("voucherDetails", {
                                ...currentServiceData?.voucherDetails,
                                features_Price: newFeatures,
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFeatures = [
                            ...(currentServiceData?.voucherDetails
                              .features_Price || []),
                          ];
                          newFeatures[index].features.push("");
                          updateServiceData("voucherDetails", {
                            ...currentServiceData?.voucherDetails,
                            features_Price: newFeatures,
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newFeatures =
                        currentServiceData?.voucherDetails.features_Price?.filter(
                          (_, i) => i !== index
                        ) || [];
                      updateServiceData("voucherDetails", {
                        ...currentServiceData?.voucherDetails,
                        features_Price: newFeatures,
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Package
                  </Button>
                </div>
              )
            )}

            <Button
              onClick={() => {
                const newFeatures = [
                  ...(currentServiceData?.voucherDetails?.features_Price || []),
                  {
                    category: "",
                    name: "",
                    price: "",
                    features: [""],
                  },
                ];
                updateServiceData("voucherDetails", {
                  ...currentServiceData?.voucherDetails,
                  features_Price: newFeatures,
                });
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature Package
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loading Services...</h2>
            <p className="text-muted-foreground">
              Please wait while we load your service data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Service Page Builder</h1>
          <p className="text-muted-foreground mb-8">
            Select a category and service to start editing, or create a new
            service
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {serviceData.map((service) => (
                  <SelectItem
                    key={service._id}
                    value={service.link.split("/")[2]}
                  >
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Service Page Builder</h1>
          <p className="text-muted-foreground">Editing: {selectedService}</p>
        </div>

        <div className="flex gap-2">
          <Button disabled={isSaving} onClick={updateServiceInDatabase}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="voucher">Voucher</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {renderBasicInfoEditor()}
          {renderBonusEditor()}
        </TabsContent>

        <TabsContent value="introduction" className="space-y-6">
          {renderIntroductionEditor()}
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          {renderProcessEditor()}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {renderRequiredDocumentsEditor()}
          {renderBusinessFieldEditor()}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          {renderPricingEditor()}
          {renderPricing2Editor()}
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          {renderQuizEditor()}
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          {renderFAQEditor()}
        </TabsContent>

        <TabsContent value="voucher" className="space-y-6">
          {renderVoucherEditor()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
