import { dbConnect } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Login the users
export async function GET(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await UserModel.findOne({
      username: username,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({
        status: "Failed",
        message: "Invalid password",
      });
    }

    if (user.status !== "active") {
      return NextResponse.json({
        status: "Failed",
        message: "User account not active",
      });
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        status: user.status,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ status: "Failed", message: err.toString() });
  }
}
