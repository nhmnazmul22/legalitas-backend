"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCallback, useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import FileLists from "@/components/FileLists";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchFiles } from "@/store/FileSlice";
import { fetchUsers } from "@/store/UsersSlice";

const Document = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: users } = useSelector((state: RootState) => state.users.items);

  const resetDialog = () => {
    setSelectedUser("");
    setSelectedFile(null);
    setIsDragging(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetDialog();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedUser) {
      toast.error("Please select both a user and a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", selectedUser);

    try {
      setUploading(true);

      // Upload file to storage
      const uploadRes = await fetch("/api/uploads/documents", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok) {
        const fileInfo = {
          fileName: selectedFile.name,
          size: selectedFile.size,
          fileLink: uploadData.url,
          clientId: selectedUser,
        };

        const saveRes = await fetch("/api/file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fileInfo),
        });

        if (saveRes.ok) {
          toast.success("File upload successful");
          closeDialog();
          dispatch(fetchFiles());
        } else {
          throw new Error("Failed to save file info");
        }
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (err) {
      console.error(err);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const openUploadDialog = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div className="space-y-6 p-10">
      <div>
        <h2 className="text-2xl font-bold mb-2">Brankas Legalitas</h2>
        <p className="text-gray-600">
          Dokumen legal Anda tersimpan aman dan dapat diakses kapan saja
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Dokumen
          </CardTitle>
          <CardDescription>
            Upload dokumen pendukung untuk layanan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              handleDrop(e);
              openUploadDialog();
            }}
            onClick={openUploadDialog}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Dokumen</h3>
            <p className="text-gray-500 mb-4">
              Drag & drop file atau klik untuk browse
            </p>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                openUploadDialog();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Pilih File
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Maksimal 5MB • PDF, DOC, JPG, PNG
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Dokumen
            </DialogTitle>
            <DialogDescription>
              Pilih pengguna dan upload dokumen untuk layanan Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user-select">Pilih Pengguna</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pengguna..." />
                </SelectTrigger>
                <SelectContent>
                  {users &&
                    users.map((user) => (
                      <SelectItem key={user._id} value={String(user._id!)}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-sm text-gray-500">
                            {user.username}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                  isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {selectedFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag & drop file atau klik untuk browse
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih File
                    </Button>
                  </>
                )}
                <input
                  type="file"
                  ref={inputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
              <p className="text-xs text-gray-400">
                Maksimal 10MB • PDF, DOC, JPG, PNG
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={uploading}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedUser || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FileLists />
    </div>
  );
};

export default Document;
