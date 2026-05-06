"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInventory() {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("inventory")
      .select(
        `
        *,
        product_variant:product_variants(
          id,
          size,
          color,
          fabric,
          sku_suffix,
          product:products(id, name, sku, thumbnail_url)
        )
      `
      )
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: (data ?? []) as unknown[] };
  } catch (error) {
    console.error("getInventory error:", error);
    return { success: false, data: [], error: String(error) };
  }
}

export async function stockIn(
  variantId: string,
  quantity: number,
  userId: string
) {
  try {
    if (quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    // Get current inventory record
    const { data: inv, error: fetchError } = await sb
      .from("inventory")
      .select("*")
      .eq("product_variant_id", variantId)
      .single();

    if (fetchError) throw fetchError;

    const newStock = (inv.stock_quantity || 0) + quantity;
    const newAvailable = (inv.available_quantity || 0) + quantity;

    const { error: updateError } = await sb
      .from("inventory")
      .update({
        stock_quantity: newStock,
        available_quantity: newAvailable,
        last_updated_by: userId,
      })
      .eq("product_variant_id", variantId);

    if (updateError) throw updateError;

    // Log to audit_logs
    await sb.from("audit_logs").insert({
      user_id: userId,
      action_type: "STOCK_IN",
      table_name: "inventory",
      record_id: inv.id,
      old_value: {
        stock_quantity: inv.stock_quantity,
        available_quantity: inv.available_quantity,
      },
      new_value: {
        stock_quantity: newStock,
        available_quantity: newAvailable,
      },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("stockIn error:", error);
    return { success: false, error: String(error) };
  }
}

export async function stockOut(
  variantId: string,
  quantity: number,
  userId: string
) {
  try {
    if (quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    // Get current inventory record
    const { data: inv, error: fetchError } = await sb
      .from("inventory")
      .select("*")
      .eq("product_variant_id", variantId)
      .single();

    if (fetchError) throw fetchError;

    if ((inv.available_quantity || 0) < quantity) {
      return {
        success: false,
        error: `Insufficient stock. Available: ${inv.available_quantity}`,
      };
    }

    const newStock = (inv.stock_quantity || 0) - quantity;
    const newAvailable = (inv.available_quantity || 0) - quantity;

    const { error: updateError } = await sb
      .from("inventory")
      .update({
        stock_quantity: newStock,
        available_quantity: newAvailable,
        last_updated_by: userId,
      })
      .eq("product_variant_id", variantId);

    if (updateError) throw updateError;

    // Log to audit_logs
    await sb.from("audit_logs").insert({
      user_id: userId,
      action_type: "STOCK_OUT",
      table_name: "inventory",
      record_id: inv.id,
      old_value: {
        stock_quantity: inv.stock_quantity,
        available_quantity: inv.available_quantity,
      },
      new_value: {
        stock_quantity: newStock,
        available_quantity: newAvailable,
      },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("stockOut error:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateThreshold(id: string, threshold: number) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("inventory")
      .update({ low_stock_threshold: threshold })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("updateThreshold error:", error);
    return { success: false, error: String(error) };
  }
}
