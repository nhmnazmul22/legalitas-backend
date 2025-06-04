import UserModel from "@/lib/models/UserModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const userId = (await params).id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "User not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: user },
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
