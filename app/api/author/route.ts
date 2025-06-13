import { dbConnect } from "@/lib/config/db";
import AdminModel from "@/lib/models/AdminModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
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
export const POST = async (request: NextRequest) => {
  const headers = getCorsHeaders(request);
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Please login." },
        { status: 401, headers }
      );
    }
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      ...body,
      password: hashedPassword,
    });
    return NextResponse.json(
      { status: "Successful", data: admin },
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
