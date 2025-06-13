import { dbConnect } from "@/lib/config/db";
import AdminModel from "@/lib/models/AdminModel";
import BlogModel from "@/lib/models/BlogModel";
import { getCorsHeaders } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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
export const POST = async (request: NextRequest) => {
  const headers = getCorsHeaders(request);
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

    const { title, thumbnail, shortDes, content, tags, category, authorId } =
      body;

    if (!title || !thumbnail || !shortDes || !content || !tags || !category) {
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

    const author = await AdminModel.find({});

    if (!author[0]._id) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Author not found",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const blog = await BlogModel.create({
      ...body,
      authorId: author[0]._id,
      thumbnail: `https://202.74.74.123${thumbnail}`,
    });

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
          from: "admins",
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
