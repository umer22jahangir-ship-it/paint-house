"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquareQuote, Plus, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/Card";
import type { Review } from "@/lib/types";

export function Reviews() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [car, setCar] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !car || !comment) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, car, rating, comment }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: t("msgReviewSuccess") });
        // Reset form
        setName("");
        setCar("");
        setRating(5);
        setComment("");
        // Reload reviews
        fetchReviews();
        // Hide form after a small delay
        setTimeout(() => {
          setShowForm(false);
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: "error", text: data.error || t("msgReviewError") });
      }
    } catch {
      setMessage({ type: "error", text: t("msgReviewError") });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t border-[var(--color-border)] bg-gradient-to-b from-white to-[var(--color-surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-600 ring-1 ring-yellow-600/10">
                <Star className="h-3.5 w-3.5 fill-current" />
                {t("reviewsBadge")}
              </span>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-500/10">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>
                  <span>
                    {(
                      reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                      reviews.length
                    ).toFixed(1)} / 5.0
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              {t("reviewsTitle")}
            </h2>
            <p className="mt-2 max-w-xl text-[var(--color-muted)]">
              {t("reviewsSubtitle")}
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-lg active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t("btnWriteReview")}
          </button>
        </div>

        {/* Review Form Box */}
        {showForm && (
          <div className="mb-12 rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-md transition-all duration-300 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
                    {t("lblReviewName")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("phReviewName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
                    {t("lblReviewCar")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("phReviewCar")}
                    value={car}
                    onChange={(e) => setCar(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>
              </div>

              {/* Rating selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
                  {t("lblReviewRating")}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform active:scale-125"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
                  {t("lblReviewComment")}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t("phReviewComment")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white shadow hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("btnSubmitReview")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          /* Reviews Grid */
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Quote watermark */}
                <div className="absolute right-6 top-6 text-gray-100">
                  <MessageSquareQuote className="h-10 w-10 stroke-1" />
                </div>

                <div>
                  {/* Rating stars */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4.5 w-4.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="mb-6 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-foreground)]">
                      {review.name}
                    </h4>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      {review.car}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">
                    {new Date(review.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center text-gray-400">
            No reviews yet. Be the first to share your feedback!
          </div>
        )}
      </div>
    </section>
  );
}
