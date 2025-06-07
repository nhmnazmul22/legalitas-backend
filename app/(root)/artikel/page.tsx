"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/config/axios";
import { toast } from "sonner";
import { BlogType } from "@/types";
import { formatDate } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { redirect } from "next/navigation";
import { fetchBlogById } from "@/store/blogSlice";
import DynamicPagination from "@/components/DynamicPagination";

export default function BlogListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentItems } = useSelector((state: RootState) => state.pagination);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/artikel");
      if (res.status === 200) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!!");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogs = async (blogId: string) => {
    try {
      setLoading(true);
      const res = await api.delete(`/api/artikel/${blogId}`);
      if (res.status === 201) {
        // Delete the pervious img
        const { data } = res.data;
        const imgName = data.thumbnail.split("/")[2];
        await fetch(`/api/delete-image?filename=${imgName}`, {
          method: "DELETE",
        });

        fetchBlogs();
        toast.success("Blog delete Successful");
      }
    } catch (err) {
      console.error(err);
      toast.error("Blog delete failed");
    } finally {
      setLoading(false);
    }
  };

  const editBlog = (blogId: string) => {
    setLoading(true);
    dispatch(fetchBlogById(blogId));
    setLoading(false);
    redirect("/artikel/edit-artikel");
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Blog Manager</h1>
        <Link href="/artikel/add-artikel">
          <Button disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="max-sm:hidden">Description</TableHead>
              <TableHead className="w-40 max-lg:hidden">Date</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems &&
              currentItems.map((post, index) => (
                <TableRow key={post._id}>
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-sm:hidden">
                    {post.shortDes}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-lg:hidden">
                    {formatDate(post.createdAt!)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      onClick={() => editBlog(post._id!)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={loading}
                      onClick={() => deleteBlogs(post._id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {currentItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No blog posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-5">
        <DynamicPagination data={blogs} />
      </div>
    </div>
  );
}
