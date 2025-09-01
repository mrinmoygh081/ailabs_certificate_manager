// app/api/getFolders/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const topic = searchParams.get("topic");
  const name = searchParams.get("name")?.toLowerCase();

  const basePath = process.env.FOLDER_PATH || "";

  // Case 1: No params → return years
  if (!year) {
    const years = fs
      .readdirSync(basePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return NextResponse.json(years);
  }

  // Case 2: Year only → return topics
  if (year && !topic) {
    const topicsPath = path.join(basePath, year);
    const topics = fs
      .readdirSync(topicsPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return NextResponse.json(topics);
  }

  // Case 3: Year + Topic → return PDF files
  if (year && topic) {
    const topicPath = path.join(basePath, year, topic);
    const pdfs = fs
      .readdirSync(topicPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && dirent.name.toLowerCase().endsWith(".pdf"))
      .map((dirent) => dirent.name);
    const filtered = name ? pdfs.filter((file) => file.toLowerCase().includes(name)) : pdfs;
    return NextResponse.json(filtered);
  }

  return NextResponse.json([]);
}
