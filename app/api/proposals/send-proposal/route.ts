import { dbConnect } from "@/lib/config/db";
import SendProposalModel from "@/lib/models/SendProposalModel";
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

// Send proposal
export async function POST(request: NextRequest) {
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

    const {
      proposalTitle,
      proposalContent,
      proposalPrice,
      proposalId,
      clientId,
    } = body;

    if (
      !proposalTitle ||
      !proposalContent ||
      !proposalPrice ||
      !proposalId ||
      !clientId
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

    const sendProposal = await SendProposalModel.create({ ...body });
    return NextResponse.json(
      { status: "Successful", data: sendProposal },
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
