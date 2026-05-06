import { Suspense } from "react";
import { Star, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { ReviewsClient } from "./ReviewsClient";

type Review = {
  id: string;
  product_id: string;
  customer_id: string | null;
  rating: number;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  product: { id: string; name: string; slug: string } | null;
  customer: { id: string; name: string; email: string } | null;
};

async function fetchReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        product:products(id, name, slug),
        customer:customers(id, name, email)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Review[]) ?? [];
  } catch {
    return [];
  }
}

function ReviewsSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

async function ReviewsContent() {
  const reviews = await fetchReviews();

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <ReviewsClient
      initialReviews={reviews}
      pendingCount={pendingCount}
      approvedCount={approvedCount}
      rejectedCount={rejectedCount}
    />
  );
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Moderate customer reviews and ratings
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <MessageSquare className="h-4 w-4" />
          <span>Review Moderation</span>
        </div>
      </div>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsContent />
      </Suspense>
    </div>
  );
}
