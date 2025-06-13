import { progressSteps } from "@/constants";
import { dbConnect } from "@/lib/config/db";
import ProgressModel from "@/lib/models/ProgressModel";
import { getCorsHeaders } from "@/lib/utils";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";
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

// Get Proposal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const clientId = (await params).id;
  try {
    if (!clientId) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "User not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const progress = await ProgressModel.aggregate([
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
          clientId: 0,
          "clientDetails.password": 0,
        },
      },
    ]);

    if (progress.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Progress not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: progress },
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
}

// Update status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const progressId = (await params).id;
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

    if (!progressId) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Progress Id not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const body = await request.json();

    const prevProgress = await ProgressModel.findById(progressId);

    if (!prevProgress) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Progress not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const { currentStep, status } = body;

    const nextStep = {
      title: currentStep,
      status: status ? status : "reviewing",
    };

    const data = {
      ...body,
      currentStep: nextStep,
      status: status ? status : "in progress",
    };

    const updatedProgress = await ProgressModel.findByIdAndUpdate(
      progressId,
      data,
      { new: true }
    );

    return NextResponse.json(
      { status: "Successful", data: updatedProgress },
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
}
