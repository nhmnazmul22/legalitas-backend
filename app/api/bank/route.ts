import { dbConnect } from "@/lib/config/db";
import BankModel from "@/lib/models/BankModel";
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



export const POST = async (request: NextRequest) => {
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

export const GET = async (request: NextRequest) => {
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
    
    const BankInfo = await BankModel.find({});

    if (BankInfo.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Bank info not found",
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
        data: BankInfo,
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
