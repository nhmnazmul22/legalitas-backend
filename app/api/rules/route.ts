import { dbConnect } from "@/lib/config/db";
import RulesModel from "@/lib/models/RulesModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Get Service Request
export const GET = async (request: Request) => {
  const headers = getCorsHeaders(request);

  try {
    const rules = await RulesModel.find({});
    if (rules.length === 0) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Rules not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }
    return NextResponse.json(
      { status: "Successful", data: rules },
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
