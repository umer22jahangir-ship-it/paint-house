import { NextRequest, NextResponse } from "next/server";
import { searchPaintMatches } from "@/lib/db";

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get("company");
  const model = request.nextUrl.searchParams.get("model");
  const year = request.nextUrl.searchParams.get("year");

  if (!company || !model || !year) {
    return NextResponse.json(
      { error: "Company, model, and year are required" },
      { status: 400 }
    );
  }

  if (isNaN(parseInt(year, 10))) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const results = await searchPaintMatches(company, model, year);
    return NextResponse.json({ results, count: results.length });
  } catch (error) {
    console.error("Paint search failed:", error);
    return NextResponse.json(
      { error: "Database error. Please ensure the database is seeded." },
      { status: 500 }
    );
  }
}
