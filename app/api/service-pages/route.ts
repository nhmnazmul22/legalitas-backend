import { dbConnect } from "@/lib/config/db";
import ServicePagesModel from "@/lib/models/ServicePagesModel";
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

// Get Service Request
export const GET = async (request: Request) => {
  const headers = getCorsHeaders(request);

  try {
    const servicePages = await ServicePagesModel.findOne({});

    if (!servicePages) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Service Pages not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: servicePages },
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
