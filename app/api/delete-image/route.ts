import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getCorsHeaders } from "@/lib/utils";

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

export async function DELETE(req: NextRequest) {
  const headers = getCorsHeaders(req);
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400, headers }
      );
    }

    // Prevent directory traversal
    if (filename.includes("..") || filename.startsWith("/")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400, headers }
      );
    }

    const filePath = path.join(process.cwd(), "public", "blogs-img", filename);
    await fs.unlink(filePath);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200, headers }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }
}
