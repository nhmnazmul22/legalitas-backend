import RulesModel from "@/lib/models/RulesModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

// Update Blog
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const ruleId = (await params).id;
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Please, Input some data to change the blog",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const updatedRule = await RulesModel.findByIdAndUpdate(ruleId, body, {
      new: true,
    });

    return NextResponse.json(
      { status: "Successful", data: updatedRule },
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

// Update Blog
export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const ruleId = (await params).id;
  try {
    const deleteRule = await RulesModel.findByIdAndDelete(ruleId);
    
    if (!deleteRule) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Rule Delete failed",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: deleteRule },
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
