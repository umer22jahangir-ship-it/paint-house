import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/db";

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get("company");

  if (!company) {
    return NextResponse.json(
      { error: "Company parameter is required" },
      { status: 400 }
    );
  }

  try {
    const models = await getModels(company);
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
