"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: (data ?? []) as unknown[] };
  } catch (error) {
    console.error("getCoupons error:", error);
    return { success: false, data: [], error: String(error) };
  }
}

export async function createCoupon(data: {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  expiry_date?: string | null;
  usage_limit?: number | null;
  is_active: boolean;
}) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inserted, error } = await (supabase as any)
      .from("coupons")
      .insert({
        code: data.code.toUpperCase().trim(),
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        expiry_date: data.expiry_date || null,
        usage_limit: data.usage_limit || null,
        is_active: data.is_active,
        used_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/coupons");
    return { success: true, data: inserted };
  } catch (error) {
    console.error("createCoupon error:", error);
    return { success: false, data: null, error: String(error) };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("coupons").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("deleteCoupon error:", error);
    return { success: false, error: String(error) };
  }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("coupons")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("toggleCouponStatus error:", error);
    return { success: false, error: String(error) };
  }
}
