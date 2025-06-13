import { dbConnect } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";import { getCorsHeaders } from "@/lib/utils";
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

// Login the users
export async function POST(request: Request) {
  const headers = getCorsHeaders(request);

  try {
    const { username, password } = await request.json();

    const user = await UserModel.findOne({
      username: username,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invalid password",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    if (user.status !== "aktif") {
      return NextResponse.json(
        {
          status: "Failed",
          message: "User account not active",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          status: user.status,
        },
      },
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
