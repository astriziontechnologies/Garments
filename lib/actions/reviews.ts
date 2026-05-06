"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReviews(status?: string) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    let query = sb
      .from("reviews")
      .select(
        `
        *,
        product:products(id, name, slug, thumbnail_url),
        customer:customers(id, name, email)
      `
      )
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data ?? []) as unknown[] };
  } catch (error) {
    console.error("getReviews error:", error);
    return { success: false, data: [], error: String(error) };
  }
}

export async function updateReviewStatus(
  id: string,
  status: "approved" | "rejected"
) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("reviews")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/reviews");
    return { success: true };
  } catch (error) {
    console.error("updateReviewStatus error:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteReview(id: string) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("reviews").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard/reviews");
    return { success: true };
  } catch (error) {
    console.error("deleteReview error:", error);
    return { success: false, error: String(error) };
  }
}
