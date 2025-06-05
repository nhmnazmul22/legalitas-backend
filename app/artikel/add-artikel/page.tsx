"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/constants";
import api from "@/lib/config/axios";
import { toast } from "sonner";

export default function AddArticlePage() {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("/placeholder.svg");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [shortDes, setShortDes] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("<p>Write your blog post here...</p>");

  const resetInfo = () => {
    setThumbnailFile(null);
    setThumbnailPreview("/placeholder.svg");
    setTitle("");
    setShortDes("");
    setTags("");
    setCategory("");
    setContent("<p>Write your blog post here...</p>");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let imageUrl = "";

      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);

        const res = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imageUrl = data.url;
      }

      const blogData = {
        title,
        shortDes,
        tags: tags.split(",").map((tag) => tag.trim()),
        category,
        content: content,
        thumbnail: imageUrl,
        authorId: "6841e0fccf78d430c5d0f8ac",
      };

      const res = await api.post("/api/blogs", blogData);
      if (res.status === 201) {
        toast.success("Blog Create Successful");
        resetInfo();
      }
    } catch (err) {
      console.error(err);
      toast.error("Blog create failed");
    } finally {
      resetInfo();
      setLoading(false);
      redirect("/artikel");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add Artikel</h1>

      <div className="border rounded-lg bg-white p-5 shadow-sm flex flex-col gap-5">
        {/* Thumbnail Upload */}
        <div className="flex flex-col gap-2 w-full">
          <figure className="rounded-md overflow-hidden max-w-[250px]">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </figure>
          <div className="w-[250px]">
            <Input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/svg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnailFile(file);
                  setThumbnailPreview(URL.createObjectURL(file));
                }
              }}
            />
            <p className="text-muted-foreground text-xs mt-1 text-center">
              Accepts .png .jpg .jpeg .svg only
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Artikel title"
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="shortDes">Short Description</Label>
          <Textarea
            id="shortDes"
            value={shortDes}
            onChange={(e) => setShortDes(e.target.value)}
            placeholder="Artikel short description"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Contents</Label>
          <div className="editor border border-gray-300 rounded-md overflow-hidden">
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={(_, editor) => {
                const html = editor.getData();
                setContent(html);
              }}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "blockQuote",
                  "insertTable",
                  "undo",
                  "redo",
                ],
                ui: {
                  viewportOffset: { top: 20 }, // Optional padding
                },
              }}
            />
          </div>
          <style jsx global>{`
            .ck-editor__editable {
              min-height: 400px !important;
            }
          `}</style>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {services.map((item) => (
                <SelectItem key={item.id} value={item.value}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">Insert Tags</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. tech, ai, nextjs"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          Submit Blog
        </button>
      </div>
    </div>
  );
}
