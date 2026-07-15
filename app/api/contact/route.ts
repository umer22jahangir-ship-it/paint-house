import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, company, model, year, message } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const leadId = await insertLead({
      name: name.trim(),
      phone: phone.trim(),
      company: company?.trim() || "N/A",
      model: model?.trim() || "N/A",
      year: year?.trim() || "N/A",
    });

    return NextResponse.json({
      success: true,
      id: leadId,
      message: message
        ? "Thank you! We'll get back to you soon."
        : "Thank you! We'll contact you shortly.",
    });
  } catch (error) {
    console.error("Failed to save lead:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}
