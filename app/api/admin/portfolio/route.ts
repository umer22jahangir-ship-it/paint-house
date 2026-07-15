import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/auth";
import {
  getPortfolioItems,
  addPortfolioItem,
  deletePortfolioItem,
} from "@/lib/db";

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) return null;
  return token;
}

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const isAdmin = requireAdmin(request);

  try {
    const items = await getPortfolioItems(category ?? undefined);
    if (!isAdmin && items.length === 0) {
      return NextResponse.json({ items: [] });
    }
    return NextResponse.json({ items });
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
    const { title, description, media_type, media_url, category, sort_order } = body;

    if (!media_url?.trim()) {
      return NextResponse.json({ error: "Please upload a file or paste a media URL" }, { status: 400 });
    }

    if (media_type !== "image" && media_type !== "video") {
      return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
    }

    const id = await addPortfolioItem({
      title: title?.trim() || "",
      description: description?.trim(),
      media_type,
      media_url: media_url.trim(),
      category: category || "expertise",
      sort_order: sort_order ? parseInt(String(sort_order), 10) : 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Item id required" }, { status: 400 });
  }
  const deleted = await deletePortfolioItem(parseInt(id, 10));
  if (!deleted) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
