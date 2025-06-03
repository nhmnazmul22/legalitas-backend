import { dbConnect } from "@/lib/config/db";
import ServiceModel from "@/lib/models/ServiceModel";
import { NextResponse } from "next/server";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Get Service Request
export const GET = async (request: Request) => {
  try {
    const services = await ServiceModel.find({});
    if (services.length === 0) {
      return NextResponse.json({
        status: "Failed",
        message: "Services not found",
      });
    }
    return NextResponse.json({ status: "Successful", data: services });
  } catch (err: any) {
    return NextResponse.json({
      status: "Failed",
      message: err.toString(),
    });
  }
};
