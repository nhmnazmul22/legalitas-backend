import { dbConnect } from "@/lib/config/db";
import RulesModel from "@/lib/models/RulesModel";
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

export const POST = async (request: Request) => {
  const headers = getCorsHeaders(request);
  try {
    const body = await request.json();
    const { ruleCode, rule, description } = body;

    if (!ruleCode || !rule || !description) {
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
    const rules = await RulesModel.find({});
    const ruleData = await RulesModel.create({ ...body, no: rules.length + 1 });
    return NextResponse.json(
      { status: "Successful", data: ruleData },
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
