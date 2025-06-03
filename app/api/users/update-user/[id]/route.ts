import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

// User update and password update request
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id;

  if (!userId) {
    return NextResponse.json({
      status: "Failed",
      message: "User id not found",
    });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: "Failed",
        message: "User not found",
      });
    }

    const body = await request.json();
    const updateData = body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({
        status: "Failed",
        message: "Please insert some update data to update user",
      });
    }

    // if user try to update password
    let hashedPassword = null;
    if (
      updateData["password"] &&
      updateData["confirmPassword"] &&
      updateData["password"] === updateData["confirmPassword"]
    ) {
      // hashed the password with bcrypt
      hashedPassword = await bcrypt.hash(updateData["password"], 10);
      updateData["password"] = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return NextResponse.json({ status: "Successful", data: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ status: "Failed", message: err.toString() });
  }
}
