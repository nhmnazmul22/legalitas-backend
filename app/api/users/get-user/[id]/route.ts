import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({
        status: "Failed",
        message: "User not found",
      });
    }

    return NextResponse.json({ status: "Successful", data: user });
  } catch (err: any) {
    return NextResponse.json({
      status: "Failed",
      message: err.toString(),
    });
  }
}
