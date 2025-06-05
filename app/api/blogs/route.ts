import { dbConnect } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

// Create Blog
export const POST = async (request: Request) => {
  const headers = getCorsHeaders(request);
  try {
    const body = await request.json();

    const { title, thumbnail, shortDes, content, tags, category, authorId } =
      body;

    if (
      !title ||
      !thumbnail ||
      !shortDes ||
      !content ||
      !tags ||
      !category ||
      !authorId
    ) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Missing required fields",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const blog = await BlogModel.create({ ...body });
    return NextResponse.json(
      { status: "Successful", data: blog },
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

// get all blogs
export const GET = async (request: Request) => {
  const headers = getCorsHeaders(request);

  try {
    const blogs = await BlogModel.aggregate([
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

    if (blogs.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Blogs not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }
    return NextResponse.json(
      { status: "Successful", data: blogs },
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
};
