import { dbConnect } from "@/lib/config/db";
import RequestProposalModel from "@/lib/models/RequestProposalModel";
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

// Get proposals
export async function GET(request: NextRequest) {
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
    const proposals = await RequestProposalModel.aggregate([
      {
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposalDetails",
        },
      },
      {
        $unwind: "$proposalDetails",
      },
      {
        $project: {
          proposalId: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json(
      { status: "Successful", data: proposals },
      {
        status: 200,
        headers,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.toString() },
      {
        status: 500,
        headers,
      }
    );
  }
}

// Request for proposal
export async function POST(request: Request) {
  const headers = getCorsHeaders(request);
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientWhatsAppNumber, proposalId } = body;

    if (!clientName || !clientEmail || !clientWhatsAppNumber || !proposalId) {
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

    const proposal = await RequestProposalModel.create({ ...body });
    return NextResponse.json(
      { status: "Successful", data: proposal },
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
