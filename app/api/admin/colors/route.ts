import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/auth";
import {
  getAllColorsAdmin,
  addColorRecord,
  deleteColorRecord,
} from "@/lib/db";

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) return null;
  return token;
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ colors: await getAllColorsAdmin() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { company, model, year, color_name, paint_code, imported_available, china_available } = body;

    if (!company?.trim() || !model?.trim() || !year || !color_name?.trim() || !paint_code?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const id = await addColorRecord({
      company: company.trim(),
      model: model.trim(),
      year: parseInt(String(year), 10),
      color_name: color_name.trim(),
      paint_code: paint_code.trim(),
      imported_available: Boolean(imported_available),
      china_available: Boolean(china_available),
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add color" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Color id required" }, { status: 400 });
  }
  const deleted = await deleteColorRecord(parseInt(id, 10));
  if (!deleted) {
    return NextResponse.json({ error: "Color not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
