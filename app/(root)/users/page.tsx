"use client";

import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import UserCard from "@/components/UserCard";
import api from "@/lib/config/axios";
import { UserType } from "@/types";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);

  const fetchUsers = async () => {
    const res = await api.get("/api/users/get-user");
    const datas: UserType[] = res.data.data;
    setUsers(datas);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <p className="text-muted-foreground">
          Kelola akun user dan kirim proposal/invoice
        </p>
      </div>

      <div className="grid gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user._id}
              _id={user._id}
              fullName={user.fullName}
              email={user.email}
              username={user.username}
              whatsappNumber={user.whatsappNumber}
              service={user.service}
              proposalId={user.proposalId}
              status={user.status}
              createdAt={user?.createdAt}
            />
          ))
        ) : (
          <SkeletonCard />
        )}
      </div>
    </div>
  );
}
