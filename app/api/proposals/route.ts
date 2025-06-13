import { dbConnect } from "@/lib/config/db";
import ProposalModel from "@/lib/models/ProposalModel";
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

// Get Proposal Request
export const GET = async (request: Request) => {
  const headers = getCorsHeaders(request);

  try {
    const proposals = await ProposalModel.find({}).sort({ createdAt: -1 });
    if (proposals.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Proposals not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }
    return NextResponse.json(
      { status: "Successful", data: proposals },
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
