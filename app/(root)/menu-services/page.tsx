"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/config/axios";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  ImageIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ServiceItem {
  _id?: string;
  title: string;
  link: string;
}

interface ServiceCategory {
  _id?: string;
  title: string;
  children: ServiceItem[];
}

interface MenuItemsWithBanner {
  _id?: string;
  menuName: string;
  bannerImg: string;
  link: string;
}

export default function ServiceManagement() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [bannerMenuItems, setBannerMenuItems] = useState<MenuItemsWithBanner[]>(
    []
  );

  // UI State
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [editingBannerItem, setEditingBannerItem] =
    useState<MenuItemsWithBanner | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string>("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);

  // Category handlers
  const handleSaveCategory = () => {
    if (!editingCategory) return;

    if (editingCategory._id) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat._id === editingCategory._id ? editingCategory : cat
        )
      );
    } else {
      // Add new category (will get _id from database after save)
      setCategories([...categories, editingCategory]);
    }

    setEditingCategory(null);
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat._id !== id));
  };

  // Service handlers
  const handleSaveService = () => {
    if (!editingService || !editingCategoryId) return;

    if (editingService._id) {
      // Update existing service
      setCategories(
        categories.map((cat) =>
          cat._id === editingCategoryId
            ? {
                ...cat,
                children: cat.children.map((svc) =>
                  svc._id === editingService._id ? editingService : svc
                ),
              }
            : cat
        )
      );
    } else {
      // Add new service (will get _id from database after save)
      setCategories(
        categories.map((cat) =>
          cat._id === editingCategoryId
            ? { ...cat, children: [...cat.children, editingService] }
            : cat
        )
      );
    }
    setIsDeleting(false);
    setEditingCategoryId("");
    setIsServiceDialogOpen(false);
  };

  const handleDeleteService = (categoryId: string, serviceId: string) => {
    setCategories(
      categories.map((cat) =>
        cat._id === categoryId
          ? {
              ...cat,
              children: cat.children.filter((svc) => svc._id !== serviceId),
            }
          : cat
      )
    );
    setIsDeleting(true);
  };

  // Banner item handlers
  const handleSaveBannerItem = () => {
    if (!editingBannerItem) return;

    if (editingBannerItem._id) {
      // Update existing banner item
      setBannerMenuItems(
        bannerMenuItems.map((item) =>
          item._id === editingBannerItem._id ? editingBannerItem : item
        )
      );
    } else {
      // Add new banner item (will get _id from database after save)
      setBannerMenuItems([...bannerMenuItems, editingBannerItem]);
    }

    setEditingBannerItem(null);
    setIsBannerDialogOpen(false);
  };

  const handleDeleteBannerItem = (id: string) => {
    setBannerMenuItems(bannerMenuItems.filter((item) => item._id !== id));
  };

  // Toggle expand/collapse
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  // Save all data - only UPDATE existing data
  const saveAllData = async () => {
    if (!menuId) {
      console.error("No menu ID found - cannot update");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        services: categories,
        servicesWithBanner: {
          title: "Services With Banner",
          children: bannerMenuItems,
        },
      };

      const response = await fetch(`/api/menu-services/${menuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!isDeleting) {
        const res = await api.put(
          `/api/service-pages/${editingService?.title}`,
          { serviceBasicInfo: {} }
        );

        if (res.status === 201 || res.status === 200) {
          toast.success("Service page added");
        } else {
          toast.error("Error occurred Service page  added");
        }
      }
      if (result.services) {
        setCategories(result.services);
      }
      if (result.servicesWithBanner?.children) {
        setBannerMenuItems(result.servicesWithBanner.children);
      }
      toast.success("All data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Load data from API
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/menu-services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { data } = await response.json();

        // Store the main document _id
        if (data._id) {
          setMenuId(data._id);
        }

        // Load services (categories)
        if (data.services) {
          setCategories(data.services);
        }

        // Load banner items from servicesWithBanner.children
        if (data.servicesWithBanner?.children) {
          setBannerMenuItems(data.servicesWithBanner.children);
        }

        console.log("Data loaded successfully:", data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading service data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Service Management</h1>
        <p className="text-muted-foreground">
          Manage service categories and banner menu items
        </p>
        {menuId && (
          <p className="text-sm text-muted-foreground">Document ID: {menuId}</p>
        )}
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Service Categories</TabsTrigger>
          <TabsTrigger value="banner-menu">Banner Menu</TabsTrigger>
        </TabsList>

        {/* Service Categories Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
              <CardDescription>
                Manage your service categories and their items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {categories.map((category) => {
                  const isExpanded = expandedCategories.has(category._id!);
                  return (
                    <Card key={category._id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(category._id!)}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                            <div>
                              <CardTitle className="text-lg">
                                {category.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {category.children.length} services • ID:{" "}
                                {category._id}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingService({
                                  title: "",
                                  link: "",
                                });
                                setEditingCategoryId(category._id!);
                                setIsServiceDialogOpen(true);
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCategory(category);
                                setIsCategoryDialogOpen(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCategory(category._id!)
                              }
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {category.children.map((service) => (
                              <div
                                key={service._id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <div className="font-medium">
                                    {service.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {service.link}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    ID: {service._id}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingService(service);
                                      setEditingCategoryId(category._id!);
                                      setIsServiceDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteService(
                                        category._id!,
                                        service._id!
                                      )
                                    }
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banner Menu Tab */}
        <TabsContent value="banner-menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Banner Menu Items
              </CardTitle>
              <CardDescription>
                Manage menu items with banner images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  setEditingBannerItem({
                    menuName: "",
                    bannerImg: "",
                    link: "",
                  });
                  setIsBannerDialogOpen(true);
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Banner Menu Item
              </Button>

              <div className="grid gap-4">
                {bannerMenuItems.map((item) => (
                  <Card key={item._id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {item.bannerImg ? (
                              <img
                                src={item.bannerImg || "/placeholder.svg"}
                                alt={item.menuName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.menuName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.link}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {item._id}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {item.bannerImg ? "Image uploaded" : "No image"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBannerItem(item);
                              setIsBannerDialogOpen(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBannerItem(item._id!)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Edit Dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!editingCategory?._id ? "Add New Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription>
              Configure the category details
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-title">Category Title</Label>
                <Input
                  id="category-title"
                  value={editingCategory.title}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      title: e.target.value,
                    })
                  }
                  placeholder="Category name"
                />
              </div>
              {editingCategory._id && (
                <div className="text-sm text-muted-foreground">
                  Category ID: {editingCategory._id}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Edit Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!editingService?._id ? "Add New Service" : "Edit Service"}
            </DialogTitle>
            <DialogDescription>Configure the service details</DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-title">Service Title</Label>
                <Input
                  id="service-title"
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      title: e.target.value,
                    })
                  }
                  placeholder="Service name"
                />
              </div>
              <div>
                <Label htmlFor="service-link">Service Link</Label>
                <Input
                  id="service-link"
                  value={editingService.link}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      link: e.target.value,
                    })
                  }
                  placeholder="/layanan/service-name"
                />
              </div>
              {editingService._id && (
                <div className="text-sm text-muted-foreground">
                  Service ID: {editingService._id}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsServiceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveService}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Banner Item Edit Dialog */}
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!editingBannerItem?._id
                ? "Add New Banner Menu Item"
                : "Edit Banner Menu Item"}
            </DialogTitle>
            <DialogDescription>
              Configure the banner menu item details
            </DialogDescription>
          </DialogHeader>
          {editingBannerItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="menu-name">Menu Name</Label>
                <Input
                  id="menu-name"
                  value={editingBannerItem.menuName}
                  onChange={(e) =>
                    setEditingBannerItem({
                      ...editingBannerItem,
                      menuName: e.target.value,
                    })
                  }
                  placeholder="Menu item name"
                />
              </div>
              <div>
                <Label htmlFor="banner-img">Banner Image</Label>
                <div className="space-y-2">
                  <Input
                    id="banner-img"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          setEditingBannerItem({
                            ...editingBannerItem,
                            bannerImg: result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  {editingBannerItem.bannerImg && (
                    <div className="mt-2">
                      <img
                        src={editingBannerItem.bannerImg || "/placeholder.svg"}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="banner-link">Link</Label>
                <Input
                  id="banner-link"
                  value={editingBannerItem.link}
                  onChange={(e) =>
                    setEditingBannerItem({
                      ...editingBannerItem,
                      link: e.target.value,
                    })
                  }
                  placeholder="/path/to/page"
                />
              </div>
              {editingBannerItem._id && (
                <div className="text-sm text-muted-foreground">
                  Banner Item ID: {editingBannerItem._id}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBannerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveBannerItem}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="text-right">
        <Button
          className="mt-10 inline-block"
          onClick={saveAllData}
          disabled={isSaving || !menuId}
        >
          {isSaving ? "Saving..." : "Save All Data"}
        </Button>
      </div>
    </div>
  );
}
