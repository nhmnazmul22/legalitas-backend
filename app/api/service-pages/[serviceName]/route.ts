import { dbConnect } from "@/lib/config/db";
import ServicePagesModel from "@/lib/models/ServicePagesModel";
import { getCorsHeaders } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

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

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ serviceName: string }> }
) => {
  const headers = getCorsHeaders(request);
  try {
    const serviceName = (await params).serviceName;

    if (!serviceName) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Service Name not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const servicePages = await ServicePagesModel.findOne({});

    if (!servicePages) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Service Pages not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const servicePage: any = servicePages.documents.get(serviceName);

    if (!servicePage) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Service page data not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    return NextResponse.json(
      {
        status: "Success",
        data: servicePage,
      },
      {
        status: 200,
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
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ serviceName: string }> }
) => {
  const headers = getCorsHeaders(request);

  try {
    const serviceName = (await params).serviceName;
    const body = await request.json();

    if (!serviceName) {
      return NextResponse.json(
        { status: "Failed", message: "Service Name not found" },
        { status: 404, headers }
      );
    }

    // Find the main servicePages document
    const servicePages = await ServicePagesModel.findOne({});
    if (!servicePages) {
      return NextResponse.json(
        { status: "Failed", message: "Service Pages not found" },
        { status: 404, headers }
      );
    }

    // Check if the key already exists in the Map
    const existingPage = servicePages.documents.get(serviceName);

    if (!existingPage) {
      // ❗Create a new entry
      servicePages.documents.set(serviceName, body);
    } else {
      // 🔁 Merge with existing data
      const updatedPage = { ...existingPage, ...body };
      servicePages.documents.set(serviceName, updatedPage);
    }

    await servicePages.save(); // 💾 Save changes to DB

    const savedData = servicePages.documents.get(serviceName);

    return NextResponse.json(
      { status: "Successful", data: savedData },
      { status: 201, headers }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.message || err.toString() },
      { status: 500, headers }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ serviceName: string }> }
) => {
  const headers = getCorsHeaders(request);

  try {
    const serviceName = (await params).serviceName;

    if (!serviceName) {
      return NextResponse.json(
        { status: "Failed", message: "Service name is required" },
        { status: 400, headers }
      );
    }

    // Find the servicePages document
    const servicePages = await ServicePagesModel.findOne({});
    if (!servicePages) {
      return NextResponse.json(
        { status: "Failed", message: "Service Pages not found" },
        { status: 404, headers }
      );
    }

    // Check if the key exists
    if (!servicePages.documents.has(serviceName)) {
      return NextResponse.json(
        { status: "Failed", message: `No page found for '${serviceName}'` },
        { status: 404, headers }
      );
    }

    // Delete the key
    servicePages.documents.delete(serviceName);
    await servicePages.save();

    return NextResponse.json(
      {
        status: "Successful",
        message: `Page '${serviceName}' deleted successfully`,
      },
      { status: 200, headers }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.message || err.toString() },
      { status: 500, headers }
    );
  }
};
