import { dbConnect } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import UserModel from "@/lib/models/UserModel";
import { getCorsHeaders, generateInvoiceNumber } from "@/lib/utils";
import mongoose, { Mongoose } from "mongoose";
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

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  try {
    const { id: clientId } = await params;

    if (!clientId) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Valid client not found",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const invoices = await InvoiceModel.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
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
