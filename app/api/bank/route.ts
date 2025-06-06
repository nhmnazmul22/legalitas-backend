import { dbConnect } from "@/lib/config/db";
import BankModel from "@/lib/models/BankModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

export const POST = async (request: Request) => {
  const headers = getCorsHeaders(request);
  try {
    const body = await request.json();
    const { bankName, accountNo, accountHolder } = body;

    if (!bankName || !accountNo || !accountHolder) {
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

    const bankInfo = await BankModel.create({
      ...body,
    });
    return NextResponse.json(
      { status: "Successful", data: bankInfo },
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
