import AuthorModel from "@/lib/models/AuthorModel";
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
  const authorId = (await params).id;

  try {
    const author = await AuthorModel.findById(authorId);

    if (!author) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Author not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      { status: "Successful", data: author },
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
