import { NextResponse } from "next/server";
import { getPortfolioItems } from "@/lib/db";

export async function GET() {
  try {
    const items = await getPortfolioItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
