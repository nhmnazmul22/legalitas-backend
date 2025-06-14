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

// Get single Banks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const bankId = (await params).id;

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
    const bankInfo = await BankModel.findById(bankId);

    if (!bankInfo) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Bank info not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: bankInfo },
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
}

// Update Banks
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const bankId = (await params).id;
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

    if (!body) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Please, Input some data to change the bank",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const updatedBank = await BankModel.findByIdAndUpdate(bankId, body, {
      new: true,
    });

    return NextResponse.json(
      { status: "Successful", data: updatedBank },
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

// Delete Banks
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const bankId = (await params).id;
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

    const deletedBank = await BankModel.findByIdAndDelete(bankId, {
      new: true,
    });

    return NextResponse.json(
      { status: "Successful", data: deletedBank },
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
