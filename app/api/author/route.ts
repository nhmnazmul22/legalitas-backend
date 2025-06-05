import { dbConnect } from "@/lib/config/db";
import AuthorModel from "@/lib/models/AuthorModel";
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

// Create Author
export const POST = async (request: Request) => {
  const headers = getCorsHeaders(request);
  try {
    const body = await request.json();
    const { authorName, bio } = body;

    if (!authorName || !bio) {
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

    const author = await AuthorModel.create({ ...body });
    return NextResponse.json(
      { status: "Successful", data: author },
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
