"use client";

import { useState, useMemo } from "react";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { updateReviewStatus, deleteReview } from "@/lib/actions/reviews";
import { toast } from "sonner";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
    </div>
  );
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  pending: {
    label: "Pending",
    variant: "outline",
    color: "border-yellow-300 text-yellow-700 bg-yellow-50",
  },
  approved: {
    label: "Approved",
    variant: "outline",
    color: "border-green-300 text-green-700 bg-green-50",
  },
  rejected: {
    label: "Rejected",
    variant: "outline",
    color: "border-red-300 text-red-700 bg-red-50",
  },
};

interface ReviewsClientProps {
  initialReviews: Review[];
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function ReviewsClient({
  initialReviews,
  pendingCount,
  approvedCount,
  rejectedCount,
}: ReviewsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return reviews;
    return reviews.filter((r) => r.status === statusFilter);
  }, [reviews, statusFilter]);

  const getCurrentCounts = () => ({
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  });

  const counts = getCurrentCounts();

  const handleApprove = async (id: string) => {
    setActionLoading(id + "_approve");
    const result = await updateReviewStatus(id, "approved");
    if (result.success) {
      toast.success("Review approved");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      );
    } else {
      toast.error(result.error ?? "Failed to approve review");
    }
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "_reject");
    const result = await updateReviewStatus(id, "rejected");
    if (result.success) {
      toast.success("Review rejected");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
    } else {
      toast.error(result.error ?? "Failed to reject review");
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    setActionLoading(id + "_delete");
    const result = await deleteReview(id);
    if (result.success) {
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      toast.error(result.error ?? "Failed to delete review");
    }
    setActionLoading(null);
  };

  return (
    <>
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {counts.pending > 0 && (
              <span className="ml-1.5 bg-yellow-100 text-yellow-700 text-xs rounded-full px-1.5 min-w-5 text-center">
                {counts.pending}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <span className="ml-1.5 bg-green-100 text-green-700 text-xs rounded-full px-1.5 min-w-5 text-center">
              {counts.approved}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <span className="ml-1.5 bg-red-100 text-red-700 text-xs rounded-full px-1.5 min-w-5 text-center">
              {counts.rejected}
            </span>
          </TabsTrigger>
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 bg-muted text-muted-foreground text-xs rounded px-1">
              {reviews.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No reviews found in this category</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review) => {
                  const cfg = statusConfig[review.status];
                  return (
                    <TableRow key={review.id}>
                      <TableCell>
                        <p className="text-sm font-medium max-w-32 truncate">
                          {review.product?.name ?? "Unknown Product"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {review.customer?.name ?? "Anonymous"}
                          </p>
                          {review.customer?.email && (
                            <p className="text-xs text-muted-foreground">
                              {review.customer.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StarRating rating={review.rating} />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground max-w-48 truncate">
                          {review.message ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(review.created_at)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {review.status !== "approved" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(review.id)}
                              disabled={actionLoading === review.id + "_approve"}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                              onClick={() => handleReject(review.id)}
                              disabled={actionLoading === review.id + "_reject"}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(review.id)}
                            disabled={actionLoading === review.id + "_delete"}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
