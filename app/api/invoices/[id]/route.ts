import { dbConnect } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import { getCorsHeaders } from "@/lib/utils";
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

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
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
    const invoiceId = (await params).id;

    if (!invoiceId) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invoice id not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const invoice = await InvoiceModel.findById(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invoice not found",
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
        data: invoice,
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const headers = getCorsHeaders(request);
  try {
    const invoiceId = (await params).id;
    const body = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invoice id not found",
        },
        {
          status: 404,
          headers: headers,
        }
      );
    }

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Please, insert a status of invoice",
        },
        {
          status: 400,
          headers: headers,
        }
      );
    }

    const updateInvoice = await InvoiceModel.findByIdAndUpdate(
      invoiceId,
      { status },
      {
        new: true,
      }
    );

    return NextResponse.json(
      { status: "Successful", data: updateInvoice },
      {
        status: 201,
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
