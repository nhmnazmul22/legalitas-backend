"use client";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { fetchAdminByEmail } from "@/store/AdminSlice";
import {
  InvoiceType,
  ProgressType,
  RequestedProposal,
  UserType,
} from "@/types";
import { Clock, FileText, Receipt, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AdminDashboard() {
  const { data: users } = useFetch<UserType[]>("api/users/get-user");
  const { data: proposals } = useFetch<RequestedProposal[]>(
    "api/proposals/request-proposal"
  );
  const { data: invoices } = useFetch<InvoiceType[]>("api/invoices");
  const { data: progress } = useFetch<ProgressType[]>("api/progress");

  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const activeUser = users && users.filter((user) => user.status === "aktif");
  const newProposals =
    proposals && proposals.filter((prop) => prop.status === "new");
  const pendingInvoices =
    invoices && invoices.filter((prop) => prop.status === "pending");

  const inProgress =
    progress && progress.filter((prop) => prop.status === "in progress");

  const stats = [
    {
      title: "Permintaan Proposal Baru",
      value: newProposals?.length,
      description: "Menunggu review",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Total User Aktif",
      value: activeUser?.length,
      description: "User terdaftar",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Invoice Pending",
      value: pendingInvoices?.length,
      description: "Belum dibayar",
      icon: Receipt,
      color: "bg-yellow-500",
    },
    {
      title: "Pekerjaan Berlangsung",
      value: inProgress?.length,
      description: "Sedang dikerjakan",
      icon: Clock,
      color: "bg-purple-500",
    },
  ];

  const recentProposals = [
    {
      id: "PR001",
      client: "Siti Juliana",
      service: "Pendirian PT",
      status: "Baru",
      date: "2024-01-15",
    },
    {
      id: "PR002",
      client: "Ahmad Rizki",
      service: "Pendirian CV",
      status: "Review",
      date: "2024-01-14",
    },
    {
      id: "PR003",
      client: "Maya Sari",
      service: "Trademark",
      status: "Approved",
      date: "2024-01-13",
    },
  ];

  useEffect(() => {
    dispatch(fetchAdminByEmail(session?.user?.email || ""));
  }, [session]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang di panel admin Legalitas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Permintaan Proposal Terbaru</CardTitle>
          <CardDescription>
            Daftar permintaan proposal yang masuk hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newProposals ? (
              newProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{proposal.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {proposal.proposalDetails.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {proposal._id}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant={
                        proposal.status === "Baru"
                          ? "destructive"
                          : proposal.status === "Review"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(proposal.createdAt || "")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <SkeletonCard />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
