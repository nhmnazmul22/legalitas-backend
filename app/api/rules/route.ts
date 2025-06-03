import { dbConnect } from "@/lib/config/db";
import RulesModel from "@/lib/models/RulesModel";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Get Service Request
export const GET = async (request: Request) => {
  try {
    const rules = await RulesModel.find({});
    if (rules.length === 0) {
      return NextResponse.json({
        status: "Failed",
        message: "Rules not found",
      });
    }
    return NextResponse.json({ status: "Successful", data: rules });
  } catch (err: any) {
    return NextResponse.json({
      status: "Failed",
      message: err.toString(),
    });
  }
};
