import BlogModel from "@/lib/models/BlogModel";
import { getCorsHeaders } from "@/lib/utils";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

// Get Blogs By id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const blogId = (await params).id;

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Please login." },
        { status: 401, headers }
      );
    }
    const blog = await BlogModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails",
      },
      {
        $project: {
          authorId: 0,
        },
      },
    ]);

    if (!blog) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Blog not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: blog[0] },
      {
        status: 200,
        headers,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "Failed",
        message: err.toString(),
      },
      {
        status: 500,
        headers,
      }
    );
  }
}

// Update Blog
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const blogId = (await params).id;
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Please login." },
        { status: 401, headers }
      );
    }
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Please, Input some data to change the blog",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, body, {
      new: true,
    });

    return NextResponse.json(
      { status: "Successful", data: updatedBlog },
      {
        status: 201,
        headers: headers,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.toString() },
      {
        status: 500,
        headers: headers,
      }
    );
  }
};

// Update Blog
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const blogId = (await params).id;
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Please login." },
        { status: 401, headers }
      );
    }
    const deleteBlog = await BlogModel.findByIdAndDelete(blogId);
    if (!deleteBlog) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Blog Delete failed",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: deleteBlog },
      {
        status: 201,
        headers: headers,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.toString() },
      {
        status: 500,
        headers: headers,
      }
    );
  }
};
