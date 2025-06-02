import { dbConnect } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Create new User
export async function POST(req: Request) {
  try {
    const body = await req.json();
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
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const prevUser = await UserModel.findOne({ username: username });
    if (prevUser) {
      return NextResponse.json(
        { message: "User Name already exists" },
        { status: 400 }
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

    return NextResponse.json({ data: user, status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

// Login the users
