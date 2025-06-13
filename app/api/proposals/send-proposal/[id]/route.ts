import { dbConnect } from "@/lib/config/db";
import SendProposalModel from "@/lib/models/SendProposalModel";
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

    const sendProposals = await SendProposalModel.aggregate([
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
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposalDetails",
        },
      },
      {
        $unwind: "$clientDetails",
      },
      {
        $unwind: "$proposalDetails",
      },
      {
        $project: {
          authorId: 0,
          paymentId: 0,
          "clientDetails.password": 0,
        },
      },
    ]);

    return NextResponse.json(
      { status: "Successful", data: sendProposals },
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
  const proposalId = (await params).id;
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

    if (!proposalId) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Proposal not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const body = await request.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Please, define a status of Proposal",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const updatedProposal = await SendProposalModel.findByIdAndUpdate(
      proposalId,
      { ...body },
      { new: true }
    );

    return NextResponse.json(
      { status: "Successful", data: updatedProposal },
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
