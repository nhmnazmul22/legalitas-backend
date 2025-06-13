import cloudinary from "@/lib/config/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const resourceType = file.type === "application/pdf" ? "raw" : "image";

    if (!file) {
      return NextResponse.json(
        { status: "Failed", message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadToCloudinary = () =>
      new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: "uploads",
            public_id: resourceType === "raw" ? "my_document.pdf" : undefined,
            type: "upload",
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(result as { secure_url: string });
            }
          }
        );
        stream.end(buffer);
      });

    const result = await uploadToCloudinary();
    return NextResponse.json(
      { status: "Success", url: result.secure_url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { status: "Failed", message: error.message || error.toString() },
      { status: 500 }
    );
  }
}
