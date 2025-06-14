"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Edit,
  ChevronDown,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ServiceItem {
  id: string;
  title: string;
  link: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  children: ServiceItem[];
}

interface MenuItemsWithBanner {
  id: string;
  menuName: string;
  bannerImg: string;
  link: string;
}

export default function ServiceManagement() {
  const [categories, setCategories] = useState<ServiceCategory[]>([
    {
      id: "2-1",
      title: "Badan Usaha",
      children: [
        {
          id: "2-1-1",
          title: "PT / Perseroan Terbatas",
          link: "/layanan/perseroan-terbatas",
        },
        {
          id: "2-1-2",
          title: "CV / Commanditaire Veidotschap",
          link: "/layanan/cv",
        },
        {
          id: "2-1-3",
          title: "PT Perorangan",
          link: "/layanan/perseroan-perorangan",
        },
        { id: "2-1-4", title: "PT PMA", link: "/layanan/pma-penanaman" },
        { id: "2-1-5", title: "Firma", link: "/layanan/firma" },
        {
          id: "2-1-6",
          title: "Persekutuan Perdata",
          link: "/layanan/persekutuan-perdata",
        },
        { id: "2-1-7", title: "Perkumpulan", link: "/layanan/perkumpulan" },
        { id: "2-1-8", title: "Yayasan", link: "/layanan/yayasan" },
      ],
    },
    {
      id: "2-2",
      title: "Perizinan",
      children: [
        { id: "2-2-1", title: "NIB & OSS", link: "/layanan/jasa-nib-oss" },
        {
          id: "2-2-2",
          title: "Izin PKP",
          link: "/layanan/pengusaha-kena-pajak",
        },
        { id: "2-2-3", title: "Izin Restoran", link: "/layanan/izin-restoran" },
        {
          id: "2-2-4",
          title: "Izin Konstruksi",
          link: "/layanan/izin-konstruksi",
        },
        { id: "2-2-5", title: "Izin PSE", link: "/layanan/izin-pse" },
        { id: "2-2-6", title: "Izin K3L", link: "/layanan/registrasi-k3l" },
        { id: "2-2-7", title: "Izin Yayasan", link: "/layanan/yayasan" },
        { id: "2-2-8", title: "33++ Izin Lainnya", link: "/layanan" },
      ],
    },
    {
      id: "2-3",
      title: "Lainnya",
      children: [
        {
          id: "2-3-1",
          title: "Virtual Office",
          link: "/layanan/virtual-office",
        },
        {
          id: "2-3-2",
          title: "Perubahan Anggaran Dasar",
          link: "/layanan/perubahan-anggaran-dasar",
        },
        {
          id: "2-3-3",
          title: "Penutupan Perusahaan",
          link: "/layanan/penutupan-perusahaan",
        },
        {
          id: "2-3-4",
          title: "Perjanjian Pisah Harta",
          link: "/layanan/akta-pisah-harta",
        },
        {
          id: "2-3-5",
          title: "Pendaftaran Merek",
          link: "/layanan/daftar-merek",
        },
        { id: "2-3-6", title: "KITAS Pekerja", link: "/layanan/kitas-pekerja" },
        {
          id: "2-3-7",
          title: "KITAS Investor",
          link: "/layanan/kitas-investor",
        },
        { id: "2-3-8", title: "17++ Layanan", link: "/layanan" },
      ],
    },
  ]);

  const [bannerMenuItems, setBannerMenuItems] = useState<MenuItemsWithBanner[]>(
    [
      {
        id: "m-1",
        menuName: "Paket PT + VO Jakarta Selatan",
        bannerImg: "/images/category-banner-01.png",
        link: "/layanan/pembuatan-pt-virtual-office",
      },
      {
        id: "m-2",
        menuName: "Paket PT + VO Jakarta Pusat",
        bannerImg: "/images/category-banner-01.png",
        link: "/layanan/pembuatan-pt-virtual-office",
      },
      {
        id: "m-3",
        menuName: "Paket PT + VO Jakarta Utara",
        bannerImg: "/images/category-banner-02.png",
        link: "/layanan/pembuatan-pt-virtual-office",
      },
      {
        id: "m-4",
        menuName: "Paket PT + VO Jakarta Barat",
        bannerImg: "/images/category-banner-01.png",
        link: "/tulisan/rekomendasi-virtual-office-jakarta",
      },
      {
        id: "m-5",
        menuName: "Paket PT + VO Jakarta Timur",
        bannerImg: "/images/category-banner-01.png",
        link: "/layanan/pembuatan-pt-virtual-office",
      },
      {
        id: "m-6",
        menuName: "Paket PT + VO SCBD",
        bannerImg: "/images/category-banner-02.png",
        link: "tulisan/rekomendasi-virtual-office-jakarta",
      },
    ]
  );

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

  // Generate unique ID
  const generateId = (prefix = "") => {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Category Functions
  const handleSaveCategory = () => {
    if (!editingCategory) return;

    if (editingCategory.id.startsWith("new-")) {
      // Adding new category
      const newCategory = { ...editingCategory, id: generateId("cat-") };
      setCategories([...categories, newCategory]);
    } else {
      // Updating existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
    }

    setEditingCategory(null);
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  // Service Functions
  const handleSaveService = () => {
    if (!editingService || !editingCategoryId) return;

    if (editingService.id.startsWith("new-")) {
      // Adding new service
      const newService = { ...editingService, id: generateId("svc-") };
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategoryId
            ? { ...cat, children: [...cat.children, newService] }
            : cat
        )
      );
    } else {
      // Updating existing service
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategoryId
            ? {
                ...cat,
                children: cat.children.map((svc) =>
                  svc.id === editingService.id ? editingService : svc
                ),
              }
            : cat
        )
      );
    }

    setEditingService(null);
    setEditingCategoryId("");
    setIsServiceDialogOpen(false);
  };

  const handleDeleteService = (categoryId: string, serviceId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              children: cat.children.filter((svc) => svc.id !== serviceId),
            }
          : cat
      )
    );
  };

  // Banner Menu Functions
  const handleSaveBannerItem = () => {
    if (!editingBannerItem) return;

    if (editingBannerItem.id.startsWith("new-")) {
      // Adding new banner item
      const newItem = { ...editingBannerItem, id: generateId("m-") };
      setBannerMenuItems([...bannerMenuItems, newItem]);
    } else {
      // Updating existing banner item
      setBannerMenuItems(
        bannerMenuItems.map((item) =>
          item.id === editingBannerItem.id ? editingBannerItem : item
        )
      );
    }

    setEditingBannerItem(null);
    setIsBannerDialogOpen(false);
  };

  const handleDeleteBannerItem = (id: string) => {
    setBannerMenuItems(bannerMenuItems.filter((item) => item.id !== id));
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Service Management</h1>
        <p className="text-muted-foreground">
          Manage service categories and banner menu items
        </p>
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
              <Button
                onClick={() => {
                  setEditingCategory({
                    id: "new-" + Date.now(),
                    title: "",
                    children: [],
                  });
                  setIsCategoryDialogOpen(true);
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Button>

              <div className="space-y-4">
                {categories.map((category) => {
                  const isExpanded = expandedCategories.has(category.id);
                  return (
                    <Card key={category.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(category.id)}
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
                                {category.children.length} services
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingService({
                                  id: "new-" + Date.now(),
                                  title: "",
                                  link: "",
                                });
                                setEditingCategoryId(category.id);
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
                              onClick={() => handleDeleteCategory(category.id)}
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
                                key={service.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <div className="font-medium">
                                    {service.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {service.link}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingService(service);
                                      setEditingCategoryId(category.id);
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
                                        category.id,
                                        service.id
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
                    id: "new-" + Date.now(),
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
                  <Card key={item.id} className="border-2">
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
                            onClick={() => handleDeleteBannerItem(item.id)}
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
              {editingCategory?.id.startsWith("new-")
                ? "Add New Category"
                : "Edit Category"}
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
              {editingService?.id.startsWith("new-")
                ? "Add New Service"
                : "Edit Service"}
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
              {editingBannerItem?.id.startsWith("new-")
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
    </div>
  );
}
