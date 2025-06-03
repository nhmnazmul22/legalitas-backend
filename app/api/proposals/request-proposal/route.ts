import RequestProposalModel from "@/lib/models/RequestProposalModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientWhatsAppNumber, proposalId } = body;

    if (!clientName || !clientEmail || !clientWhatsAppNumber || !proposalId) {
      return NextResponse.json({
        status: "Failed",
        message: "Missing required fields",
      });
    }

    const proposal = await RequestProposalModel.create({ ...body });
    return NextResponse.json({ status: "Successful", data: proposal });
  } catch (err: any) {
    return NextResponse.json({ status: "Failed", message: err.toString() });
  }
}
