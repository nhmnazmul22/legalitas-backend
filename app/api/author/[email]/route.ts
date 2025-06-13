import AdminModel from "@/lib/models/AdminModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/config/db";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  const headers = getCorsHeaders(request);
  const authorEmail = (await params).email;

  try {
    const author = await AdminModel.findOne({ email: authorEmail });

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const headers = getCorsHeaders(request);
  const authorEmail = (await params).email;
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
    const updateData = body;
    const prevAdmin = await AdminModel.findOne({ email: authorEmail });

    if (!prevAdmin) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Admin not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    // if user try to update password
    if (updateData["password"] && updateData["currentPassword"]) {
      const isPasswordRight = bcrypt.compare(
        updateData["currentPassword"],
        prevAdmin.password!
      );

      if (!isPasswordRight) {
        return NextResponse.json(
          {
            status: "Failed",
            message: "Please, Insert the right current password",
          },
          {
            status: 400,
            headers: headers,
          }
        );
      }

      // hashed the password with bcrypt
      let hashedPassword = await bcrypt.hash(updateData["password"], 10);
      updateData["password"] = hashedPassword;
    }

    if (updateData["password"] === "") {
      updateData["password"] = prevAdmin.password;
    }
    if (updateData["email"] === "") {
      updateData["email"] = prevAdmin.email;
    }

    const updatedAdmin = await AdminModel.findOneAndUpdate(
      { email: authorEmail },
      updateData
    ).select("-password");
    return NextResponse.json(
      { status: "Successful", data: updatedAdmin },
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
}
