"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleUser, Facebook, Instagram, Save, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import api from "@/lib/config/axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useSession } from "next-auth/react";
import { fetchAdminByEmail } from "@/store/AdminSlice";

const AdminInfo = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.admin);

  const { data: session } = useSession();
  const [adminInfo, setAdminInfo] = useState({
    authorName: "",
    bio: "",
    email: "",
    currentPassword: "",
    password: "",
    phone: "",
    socialLinks: {
      facebookLink: "",
      twitterLink: "",
      instagramLink: "",
    },
  });

  const handleAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (
      id.includes("facebook") ||
      id.includes("twitter") ||
      id.includes("instagram")
    ) {
      setAdminInfo((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [id]: value,
        },
      }));
    } else {
      setAdminInfo((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const finalData = {
        ...adminInfo,
      };
      if (finalData) {
        const res = await api.put(
          `/api/author/${session?.user?.email}`,
          finalData
        );
        if (res.status === 201) {
          toast.success("Info updated Successful");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Info updated failed");
    } finally {
      setLoading(false);
      dispatch(fetchAdminByEmail(session?.user?.email || ""));
    }
  };

  useEffect(() => {
    dispatch(fetchAdminByEmail(session?.user?.email || ""));
    if (items.data) {
      setAdminInfo((prevInfo) => ({
        ...prevInfo,
        authorName: items.data.authorName || "",
        bio: items.data.bio || "",
        email: items.data.email || "",
        phone: items.data.phone || "",
        socialLinks: {
          ...prevInfo.socialLinks,
          facebookLink: items.data.socialLinks?.facebookLink || "",
          twitterLink: items.data.socialLinks?.twitterLink || "",
          instagramLink: items.data.socialLinks?.instagramLink || "",
        },
      }));
    }
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleUser className="w-8 h-8" />
          Info Admin
        </CardTitle>
        <CardDescription>Tambahkan informasi admin untuk blog</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="authorName">Nama Admin</Label>
          <Input
            id="authorName"
            placeholder="Admin"
            value={adminInfo.authorName}
            onChange={handleAdminChange}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio Admin</Label>
          <Textarea
            id="bio"
            placeholder="Tulis sesuatu tentang admin..."
            rows={3}
            value={adminInfo.bio}
            onChange={handleAdminChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="admin@legalitas.org"
              value={adminInfo.email}
              onChange={handleAdminChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input
              id="phone"
              placeholder="+62 21 1234 5678"
              value={adminInfo.phone}
              onChange={handleAdminChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              type="password"
              id="currentPassword"
              placeholder="Current password"
              value={adminInfo.currentPassword}
              onChange={handleAdminChange}
            />
          </div>
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              placeholder="New password"
              value={adminInfo.password}
              onChange={handleAdminChange}
            />
          </div>
        </div>

        <div>
          <p className="mb-5 text-base font-semibold">Tautan Sosial</p>
          <div className="flex gap-2 items-center">
            <Label htmlFor="facebookLink">
              <Facebook />
            </Label>
            <Input
              id="facebookLink"
              type="url"
              placeholder="www.facebook.com/admin"
              value={adminInfo.socialLinks.facebookLink}
              onChange={handleAdminChange}
            />
          </div>
          <div className="flex gap-2 items-center mt-2">
            <Label htmlFor="twitterLink">
              <Twitter />
            </Label>
            <Input
              id="twitterLink"
              type="url"
              placeholder="www.x.com/admin"
              value={adminInfo.socialLinks.twitterLink}
              onChange={handleAdminChange}
            />
          </div>
          <div className="flex gap-2 items-center mt-2">
            <Label htmlFor="instagramLink">
              <Instagram />
            </Label>
            <Input
              id="instagramLink"
              type="url"
              placeholder="www.instagram.com/admin"
              value={adminInfo.socialLinks.instagramLink}
              onChange={handleAdminChange}
            />
          </div>
        </div>
        <Button disabled={loading} onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Simpan Info..." : "Simpan Info"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminInfo;
