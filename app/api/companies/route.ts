import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/db";

export async function GET() {
  try {
    const companies = await getCompanies();
    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return NextResponse.json(
      { error: "Database error. Please run npm run db:seed first." },
      { status: 500 }
    );
  }
}
