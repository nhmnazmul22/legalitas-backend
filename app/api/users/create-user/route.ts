import { dbConnect } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { getCorsHeaders } from "@/lib/utils";
import bcrypt from "bcrypt";
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

// Create new User
export async function POST(request: Request) {
  const headers = getCorsHeaders(request);

  try {
    const body = await request.json();
    const {
      fullName,
      email,
      whatsappNumber,
      service,
      username,
      password,
      notes,
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

    const user = await UserModel.create({
      fullName,
      email,
      whatsappNumber,
      service,
      username,
      password: hashedPassword,
      notes,
      status,
    });

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
