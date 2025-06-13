import { dbConnect } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { getCorsHeaders } from "@/lib/utils";
import bcrypt from "bcrypt";
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

// Create new User
export async function POST(request: NextRequest) {
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

    const {
      fullName,
      email,
      whatsappNumber,
      service,
      username,
      password,
      status,
    } = body;

    if (
      !fullName ||
      !email ||
      !whatsappNumber ||
      !service ||
      !username ||
      !password ||
      !status
    ) {
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

    const prevUser = await UserModel.findOne({ username: username });
    if (prevUser) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "User Name already exists",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    // hashed the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ ...body, password: hashedPassword });
    return NextResponse.json(
      { status: "Successful", data: user },
      {
        status: 200,
        headers,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.toString() },
      {
        status: 500,
        headers,
      }
    );
  }
}
