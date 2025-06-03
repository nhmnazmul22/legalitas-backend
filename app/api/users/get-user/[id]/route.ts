import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    // Simulate a fetch from a database or external API
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found", status: 404 });
    }

    return NextResponse.json({ data: user, status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch user", status: 500 });
  }
}
