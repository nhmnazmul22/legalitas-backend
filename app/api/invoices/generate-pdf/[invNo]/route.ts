import { NextRequest } from "next/server";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { formatDate } from "@/lib/utils";

export const runtime = "nodejs"; // for pdf-lib to work properly

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invNo: string }> }
) {
  const invNo = (await params).invNo;
  if (!invNo) {
    return new Response(JSON.stringify({ message: "Invalid Invoice Number" }), {
      status: 400,
    });
  }

  const data = await req.json();
  const {
    service,
    amount,
    dueDate,
    description,
    status,
    bankDetails,
    clientDetails,
    createdAt,
  } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const margin = 40;

  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 12,
    fontType = font,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, { x, y, size, font: fontType, color });
  };

  // Optional Logo
  try {
    console.log(path.join(process.cwd(), "public/logo.jpg"));
    const logoPath = path.join(process.cwd(), "public/logo.jpg");
    const logoBytes = await fs.readFile(logoPath);
    const logoImg = await pdfDoc.embedJpg(logoBytes);
    page.drawImage(logoImg, { x: margin, y: y - 40, width: 170, height: 70 });
  } catch (err) {
    drawText("Mitra Jasa Legalitas", margin, y, 18, bold, rgb(0.2, 0.2, 0.6));
  }

  y -= 80;

  drawText("INVOICE", margin, y, 24, bold);
  drawText(`Date: ${createdAt?.slice(0, 10) || ""}`, 400, y);
  y -= 30;

  drawText(`Invoice No: ${invNo}`, margin, y);
  drawText(`Status: ${status}`, 400, y);
  y -= 30;

  drawText("Billed To:", margin, y, 14, bold);
  y -= 18;
  drawText(`Full Name: ${clientDetails?.fullName || ""}`, margin, y);
  y -= 15;
  drawText(`Email: ${clientDetails?.email || ""}`, margin, y);
  y -= 15;
  drawText(`Address: ${clientDetails?.address || ""}`, margin, y);
  y -= 30;

  drawText("Description:", margin, y, 14, bold);
  y -= 18;
  drawText(description || "", margin, y);
  y -= 30;

  drawText("Amount Due:", margin, y, 14, bold);
  drawText(`${amount} BDT`, margin + 120, y);
  drawText(`Due Date: ${formatDate(dueDate)}`, 400, y);
  y -= 40;

  drawText("Bank Information:", margin, y, 14, bold);
  y -= 18;
  drawText(`Bank Name: ${bankDetails?.bankName || ""}`, margin, y);
  y -= 15;
  drawText(`Account No: ${bankDetails?.accountNo || ""}`, margin, y);
  y -= 15;
  drawText(`Account Holder: ${bankDetails?.accountHolder || ""}`, margin, y);
  y -= 15;
  drawText(`Branch: ${bankDetails?.address || ""}`, margin, y);

  const pdfBytes = await pdfDoc.save();

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invNo}.pdf`,
    },
  });
}
