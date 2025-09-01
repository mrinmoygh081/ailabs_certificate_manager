// app/api/certificates/[...path]/route.js (Next.js 13+)
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const BASE_PATH = process.env.FOLDER_PATH;

export async function GET(request, context) {
  const { params } = await context;
  console.log("params", params);
  const filePath = path.join(BASE_PATH, ...params.path);
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = params.path[params.path.length - 1];

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
