import { dbConnect } from "@/lib/config/db";
import ProposalModel from "@/lib/models/ProposalModel";
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

    const proposal = await ProposalModel.findById(proposalId);

    return NextResponse.json(
      { status: "Successful", data: proposal },
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
}
