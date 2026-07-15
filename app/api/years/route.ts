import { NextRequest, NextResponse } from "next/server";
import { getYears } from "@/lib/db";

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get("company");
  const model = request.nextUrl.searchParams.get("model");

  if (!company || !model) {
    return NextResponse.json(
      { error: "Company and model parameters are required" },
      { status: 400 }
    );
  }

  try {
    const years = await getYears(company, model);
    return NextResponse.json({ years });
  } catch (error) {
    console.error("Failed to fetch years:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
