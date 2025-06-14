import { dbConnect } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import MenuServicesModel from "@/lib/models/ServiceMenuModel";
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

export const GET = async (request: NextRequest) => {
  const headers = getCorsHeaders(request);
  try {
    const menuServices = await MenuServicesModel.findOne();

    if (menuServices) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Menu Services not found",
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
        data: menuServices,
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
