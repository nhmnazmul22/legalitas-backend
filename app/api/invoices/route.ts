import { dbConnect } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import { getCorsHeaders, generateInvoiceNumber } from "@/lib/utils";
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
    const { service, amount, dueDate, clientId, paymentId } = body;

    if (!service || !amount || !dueDate || !clientId || !paymentId) {
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

    let generateInvNo = generateInvoiceNumber();

    const prevInvoice = await InvoiceModel.findOne({ invNo: generateInvNo });

    if (prevInvoice) {
      generateInvNo = generateInvoiceNumber();
    }

    const invoiceInfo = await InvoiceModel.create({
      ...body,
      invNo: generateInvNo,
    });
    return NextResponse.json(
      { status: "Successful", data: invoiceInfo },
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
    const invoices = await InvoiceModel.aggregate([
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
          from: "banks",
          localField: "paymentId",
          foreignField: "_id",
          as: "bankDetails",
        },
      },
      {
        $unwind: "$clientDetails",
      },
      {
        $unwind: "$bankDetails",
      },
      {
        $project: {
          authorId: 0,
          paymentId: 0,
          "clientDetails.password": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (invoices.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invoices not found",
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
        data: invoices,
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
