import { NextResponse } from "next/server";
import { getApprovedReviews, addReview } from "@/lib/db";

export async function GET() {
  try {
    const reviews = await getApprovedReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, car, rating, comment } = body;

    if (!name || !car || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const ratingVal = parseInt(rating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const reviewId = await addReview({
      name: name.substring(0, 100),
      car: car.substring(0, 100),
      rating: ratingVal,
      comment: comment.substring(0, 1000),
    });

    return NextResponse.json({ success: true, id: reviewId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
