import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Utility: wraps a long text into multiple lines for pdf-lib
 */
function wrapText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Utility: draws an array of lines to the page with vertical spacing
 */
function drawLines(
  page: any,
  lines: string[],
  x: number,
  y: number,
  fontSize: number,
  font: any,
  color: any
) {
  let currentY = y;
  lines.forEach((line) => {
    page.drawText(line, { x, y: currentY, size: fontSize, font, color });
    currentY -= fontSize + 4;
  });
}

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const CorsHeaders = getCorsHeaders(req);
  const proposalId = (await params).id;

  if (!proposalId) {
    return new Response(
      JSON.stringify({ status: "Failed", message: "Proposal Not found" }),
      {
        status: 404,
        headers: CorsHeaders,
      }
    );
  }

  const { title, price, date, status, details, includes, note } =
    await req.json();

  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  // Add a blank page
  const page = pdfDoc.addPage([595, 842]); // A4 size in points (approx 8.27 x 11.69 inches)

  // Load fonts
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Define some styling constants
  const margin = 40;
  let y = 800; // start near top of the page

  // Draw title
  page.drawText(title, {
    x: margin,
    y,
    size: 24,
    font: fontHelveticaBold,
    color: rgb(0.07, 0.07, 0.07),
  });

  y -= 30;

  // Draw price and date
  page.drawText(`${price} · Dikirim: ${date}`, {
    x: margin,
    y,
    size: 12,
    font: fontHelvetica,
    color: rgb(0.42, 0.42, 0.42),
  });

  // Draw status as a tag box on right
  const statusWidth = fontHelvetica.widthOfTextAtSize(status, 12) + 20;
  const statusHeight = 20;
  page.drawRectangle({
    x: 595 - margin - statusWidth,
    y: y - 4,
    width: statusWidth,
    height: statusHeight,
    color: rgb(0.99, 0.91, 0.54), // #fde68a light yellow
    borderColor: rgb(0.57, 0.25, 0.05), // #92400e dark orange
    borderWidth: 1,
  });
  page.drawText(status, {
    x: 595 - margin - statusWidth + 10,
    y: y,
    size: 12,
    font: fontHelvetica,
    color: rgb(0.57, 0.25, 0.05),
  });

  y -= 50;

  // Description paragraph
  const description =
    "Proposal lengkap untuk pendirian PT termasuk akta notaris, SK Kemenkumham, dan dokumen pendukung lainnya.";
  const wrappedDesc = wrapText(
    description,
    fontHelvetica,
    14,
    595 - 2 * margin
  );
  drawLines(
    page,
    wrappedDesc,
    margin,
    y,
    14,
    fontHelvetica,
    rgb(0.07, 0.07, 0.07)
  );
  y -= wrappedDesc.length * 18 + 10;

  // Draw details list (left)
  page.drawText("Detail Layanan:", {
    x: margin,
    y,
    size: 16,
    font: fontHelveticaBold,
    color: rgb(0.07, 0.07, 0.07),
  });
  y -= 22;

  details.forEach((item: string) => {
    const line = `✅ ${item}`;
    const wrappedLines = wrapText(line, fontHelvetica, 12, 250);
    drawLines(page, wrappedLines, margin, y, 12, fontHelvetica, rgb(0, 0, 0));
    y -= wrappedLines.length * 16;
  });

  // Draw includes list (right)
  let yIncludes = 740; // fixed y near top for right column
  const includesX = margin + 300;

  page.drawText("Yang Termasuk:", {
    x: includesX,
    y: yIncludes,
    size: 16,
    font: fontHelveticaBold,
    color: rgb(0.07, 0.07, 0.07),
  });
  yIncludes -= 22;

  includes.forEach((item: string) => {
    const line = `🟢 ${item}`;
    const wrappedLines = wrapText(line, fontHelvetica, 12, 250);
    drawLines(
      page,
      wrappedLines,
      includesX,
      yIncludes,
      12,
      fontHelvetica,
      rgb(0, 0, 0)
    );
    yIncludes -= wrappedLines.length * 16;
  });

  // Draw alert box with note (bottom)
  const alertBoxHeight = 70;
  const alertY = 100;
  page.drawRectangle({
    x: margin,
    y: alertY,
    width: 595 - 2 * margin,
    height: alertBoxHeight,
    color: rgb(0.93, 0.99, 0.98), // #ecfdf5
    borderColor: rgb(0.65, 0.95, 0.82), // #a7f3d0
    borderWidth: 1,
  });

  const alertText = `✅ Proposal Diterima\n${note}`;
  const alertLines = alertText.split("\n");
  let alertTextY = alertY + alertBoxHeight - 20;
  alertLines.forEach((line) => {
    page.drawText(line, {
      x: margin + 10,
      y: alertTextY,
      size: 12,
      font: fontHelvetica,
      color: rgb(0.04, 0.39, 0.28), // #065f46
    });
    alertTextY -= 18;
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      ...CorsHeaders,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=proposal-${proposalId}.pdf`,
    },
  });
}
