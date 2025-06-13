"use client";
import { Download, FileText, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchFiles } from "@/store/FileSlice";
import { convertMb, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileType } from "@/types";
import api from "@/lib/config/axios";
import { toast } from "sonner";

const FileLists = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { data: files } = useSelector((state: RootState) => state.files.items);

  const groupedFiles = files.reduce(
    (acc: Record<string, any[]>, file: FileType) => {
      if (!acc[file.clientDetails.username!]) {
        acc[file.clientDetails.username!] = [];
      }
      acc[file.clientDetails.username!].push(file);
      return acc;
    },
    {}
  );

  const updateStatus = async (fileId: string, status: string) => {
    try {
      setLoading(true);
      const res = await api.put(`/api/file/${fileId}`, { status });
      if (res.status === 201) {
        toast.success(`File ${status} successful`);
        dispatch(fetchFiles());
      }
    } catch (err: any) {
      console.error(err);
      toast.error("File status update filed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      dispatch(fetchFiles());
    }
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Dokumen Anda
        </CardTitle>
        <CardDescription>Daftar semua dokumen yang tersimpan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.length > 0 ? (
            Object.entries(groupedFiles).map(([username, userFiles]) => (
              <div key={username} className="space-y-3">
                <p className="font-bold">
                  Username: <span className="font-medium">{username}</span>
                </p>
                {userFiles.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-3 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{doc.fileName}</h4>
                        <p className="text-sm text-gray-500">
                          {convertMb(Number(doc.size))} •{" "}
                          {formatDate(doc.createdAt!)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          doc.status === "accepted"
                            ? "secondary"
                            : doc.status === "draft"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {`${doc.status[0].toUpperCase()}${doc.status.slice(
                          1,
                          doc.status.length
                        )}`}
                      </Badge>
                      <Button
                        variant="default"
                        className="text-white bg-green-500 hover:text-white hover:bg-green-500"
                        size="sm"
                        onClick={() => updateStatus(doc._id, "accepted")}
                        disabled={doc.status === "accepted" || loading}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus(doc._id, "rejected")}
                        disabled={doc.status === "rejected" || loading}
                      >
                        Reject
                      </Button>
                      <Link href={doc.fileLink} target="_blank">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center italic">No saved files</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileLists;
