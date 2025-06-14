import { dbConnect } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import MenuServicesModel from "@/lib/models/ServiceMenuModel";
import { deleteItemById, getCorsHeaders } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  const { id: menuId } = await params;
  const body = await request.json();

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

    if (!menuId) {
      return NextResponse.json(
        { status: "Failed", message: "Invalid menu ID" },
        { status: 400, headers }
      );
    }

    const prevMenu = await MenuServicesModel.findById(menuId);

    if (!prevMenu) {
      return NextResponse.json(
        { status: "Failed", message: "Menu not found" },
        { status: 404, headers }
      );
    }

    const { services, servicesWithBanner } = body;

    if (!services || !servicesWithBanner) {
      return NextResponse.json(
        { status: "Failed", message: "Missing update data" },
        { status: 400, headers }
      );
    }

    const updated = await MenuServicesModel.findByIdAndUpdate(
      menuId,
      {
        services,
        servicesWithBanner,
      },
      { new: true }
    );

    return NextResponse.json(
      { status: "Success", data: updated },
      { status: 200, headers }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: "Failed", message: err.toString() },
      { status: 500, headers }
    );
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = getCorsHeaders(request);
  const menuId = (await params).id;
  try {
    const PrevMenu = await MenuServicesModel.findOne();

    if (!PrevMenu) {
      return NextResponse.json(
        { message: "Service data not found" },
        { status: 404, headers }
      );
    }

    let changed = false;

    // Remove from `services` (including)
    const updatedServiceChildren = deleteItemById(PrevMenu.services, menuId);
    if (
      JSON.stringify(PrevMenu.services) !==
      JSON.stringify(updatedServiceChildren)
    ) {
      PrevMenu.services = updatedServiceChildren;
      changed = true;
    }

    // Also try deleting from servicesWithBanner if needed
    const updatedBannerChildren = deleteItemById(
      PrevMenu.servicesWithBanner.children,
      menuId
    );
    if (
      JSON.stringify(PrevMenu.servicesWithBanner.children) !==
      JSON.stringify(updatedBannerChildren)
    ) {
      PrevMenu.servicesWithBanner.children = updatedBannerChildren;
      changed = true;
    }

    if (changed) {
      await PrevMenu.save();
      return NextResponse.json(
        {
          status: "Successful",
          message: `Item '${menuId}' deleted successfully.`,
        },
        { status: 200, headers }
      );
    } else {
      return NextResponse.json(
        { status: "Failed", message: `Item '${menuId}' not found.` },
        { status: 404, headers }
      );
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { status: "Failed", message: err.toString() },
      { status: 404, headers }
    );
  }
}

