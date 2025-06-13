import { dbConnect } from "@/lib/config/db";
import FileModel from "@/lib/models/FileModel";
import { getCorsHeaders } from "@/lib/utils";
import mongoose from "mongoose";
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

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const clientId = (await params).id;

  try {
    if (!clientId) {
      return NextResponse.json(
        { status: "Failed", message: "Client not found" },
        { status: 401, headers }
      );
    }

    const files = await FileModel.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const fileId = (await params).id;
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "File Status not defined",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    if (!fileId) {
      return NextResponse.json(
        { status: "Failed", message: "File not found" },
        { status: 401, headers }
      );
    }

    const fileInfo = await FileModel.findByIdAndUpdate(fileId, {
      status: status,
    });
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
