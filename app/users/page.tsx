import UserCard from "@/components/UserCard";
import api from "@/lib/config/axios";
import { UserType } from "@/types";

export default async function UsersPage() {
  const res = await api.get("/api/users/get-user");
  const datas: UserType[] = res.data.data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <p className="text-muted-foreground">
          Kelola akun user dan kirim proposal/invoice
        </p>
      </div>

      <div className="grid gap-6">
        {datas.length > 0
          ? datas.map((user) => (
              <UserCard
                key={user._id}
                _id={user._id}
                fullName={user.fullName}
                email={user.email}
                username={user.username}
                whatsappNumber={user.whatsappNumber}
                service={user.service}
                status={user.status}
              />
            ))
          : "No data Found"}
      </div>
    </div>
  );
}
