import { dbConnect } from "@/lib/config/db";
import ProposalModel from "@/lib/models/ProposalModel";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Get Proposal Request
export const GET = async (request: Request) => {
  try {
    const proposals = await ProposalModel.find({});
    if (proposals.length === 0) {
      return NextResponse.json({
        status: "Failed",
        message: "Proposals not found",
      });
    }
    return NextResponse.json({ status: "Successful", data: proposals });
  } catch (err: any) {
    return NextResponse.json({
      status: "Failed",
      message: err.toString(),
    });
  }
};
