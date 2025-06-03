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
export async function POST(request: Request) {
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
      return NextResponse.json({
        status: "Failed",
        message: "Missing required fields",
      });
    }

    const prevUser = await UserModel.findOne({ username: username });
    if (prevUser) {
      return NextResponse.json({
        status: "Failed",
        message: "User Name already exists",
      });
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

    return NextResponse.json({ status: "Successful", data: user });
  } catch (err: any) {
    return NextResponse.json({ status: "Failed", message: err.toString() });
  }
}
