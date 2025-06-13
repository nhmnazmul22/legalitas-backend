import { dbConnect } from "@/lib/config/db";
import FileModel from "@/lib/models/FileModel";
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

export const POST = async (request: NextRequest) => {
  const headers = getCorsHeaders(request);

  try {
    const body = await request.json();
    const { fileName, fileLink, clientId } = body;

    if (!fileName || !fileLink || !clientId) {
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

    const fileInfo = await FileModel.create({ ...body });
    return NextResponse.json(
      { status: "Successful", data: fileInfo },
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

export const GET = async (request: NextRequest) => {
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

    const files = await FileModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "clientDetails",
        },
      },
      {
        $unwind: "$clientDetails",
      },
      {
        $project: {
          "clientDetails.password": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (files.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Files not found",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }
    return NextResponse.json(
      {
        status: "Success",
        data: files,
      },
      {
        status: 200,
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
