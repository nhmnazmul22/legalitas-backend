import { dbConnect } from "@/lib/config/db";
import ServiceModel from "@/lib/models/ServiceModel";
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
    const services = await ServiceModel.find({});
    if (services.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Services not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }
    return NextResponse.json(
      { status: "Successful", data: services },
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
